# ============================================================
# Private Dictionary - Simple Test Runner with Single Progress Bar
# Version: 4.0.0
# ============================================================

$ErrorActionPreference = "SilentlyContinue"

# Colors
$script:Red = "Red"
$script:Green = "Green"
$script:Yellow = "Yellow"
$script:Cyan = "Cyan"
$script:White = "White"
$script:Magenta = "Magenta"

# Global tracking
$script:AllResults = @()

# Banner
function Show-Banner {
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor $script:Magenta
    Write-Host "  PRIVATE DICTIONARY - TEST RUNNER" -ForegroundColor $script:Magenta
    Write-Host "==========================================" -ForegroundColor $script:Magenta
    Write-Host ""
}

# Progress bar
function Show-Progress {
    param(
        [int]$current,
        [int]$total,
        [int]$passed,
        [int]$failed,
        [string]$currentFile
    )
    
    if ($total -eq 0) { return }
    
    $percent = [math]::Floor(($current / $total) * 100)
    $barLength = 50
    $filled = [math]::Floor(($current / $total) * $barLength)
    $empty = $barLength - $filled
    
    $bar = ("=" * $filled) + ("-" * $empty)
    
    # Clear line and show progress
    Write-Host "`r" -NoNewline
    Write-Host "  Progress: [" -NoNewline -ForegroundColor $script:Cyan
    
    if ($failed -gt 0) {
        Write-Host $bar -NoNewline -ForegroundColor $script:Red
    } else {
        Write-Host $bar -NoNewline -ForegroundColor $script:Green
    }
    
    Write-Host "] $percent% " -NoNewline -ForegroundColor $script:Cyan
    Write-Host "($current/$total) " -NoNewline -ForegroundColor $script:White
    Write-Host "Pass: $passed " -NoNewline -ForegroundColor $script:Green
    Write-Host "Fail: $failed " -NoNewline -ForegroundColor $script:Red
    Write-Host "- $currentFile" -NoNewline -ForegroundColor $script:Yellow
}

# Extract failed test details from output
function Get-FailedTestDetails {
    param([string]$output)
    
    $lines = $output -split "`n"
    $failedTests = @()
    
    # Specific byte sequences for emojis
    # ❌ (Red X) = E2 9D 8C
    # ✅ (Check) = E2 9C 85
    
    foreach ($line in $lines) {
        # Remove ANSI codes
        $cleanLine = $line -replace "\x1B\[[0-9;]*[mGKH]", ""
        $cleanLine = $cleanLine.Trim()
        
        # Skip empty lines
        if ([string]::IsNullOrWhiteSpace($cleanLine)) {
            continue
        }
        
        # Convert to bytes to check for specific emoji
        $bytes = [System.Text.Encoding]::UTF8.GetBytes($cleanLine)
        
        # Check if line starts with ❌ (Red X emoji: 0xE2 0x9D 0x8C)
        if ($bytes.Length -ge 3 -and 
            $bytes[0] -eq 0xE2 -and 
            $bytes[1] -eq 0x9D -and 
            $bytes[2] -eq 0x8C) {
            
            # Found red X emoji, extract text after it
            # Skip the emoji bytes (3 bytes) and any spaces
            $textStart = 3
            while ($textStart -lt $bytes.Length -and $bytes[$textStart] -eq 0x20) {
                $textStart++
            }
            
            if ($textStart -lt $bytes.Length) {
                $remainingBytes = $bytes[$textStart..($bytes.Length - 1)]
                $testName = [System.Text.Encoding]::UTF8.GetString($remainingBytes).Trim()
                
                # Validate it's a real test name
                if ($testName.Length -gt 5 -and 
                    $testName -notmatch "^(Total|Passed|Failed|Success|SOME TESTS)") {
                    $failedTests += $testName
                }
            }
        }
    }
    
    return $failedTests
}

# Extract test counts
function Get-TestCounts {
    param([string]$output)
    
    $passed = 0
    $failed = 0
    $total = 0
    
    if ($output -match "Passed:\s*(\d+)") { $passed = [int]$matches[1] }
    if ($output -match "Failed:\s*(\d+)") { $failed = [int]$matches[1] }
    if ($output -match "Total Tests:\s*(\d+)") { $total = [int]$matches[1] }
    
    return @{
        Total = $total
        Passed = $passed
        Failed = $failed
    }
}

# Run single test file quietly
function Run-TestFile {
    param(
        [string]$path,
        [string]$name
    )
    
    try {
        $process = Start-Process -FilePath "node" -ArgumentList "`"$path`"" -NoNewWindow -PassThru -RedirectStandardOutput "temp_out.txt" -RedirectStandardError "temp_err.txt" -Wait
        
        $output = ""
        if (Test-Path "temp_out.txt") {
            $output = Get-Content "temp_out.txt" -Raw
        }
        
        $counts = Get-TestCounts -output $output
        $failedTests = @()
        
        if ($counts.Failed -gt 0) {
            $failedTests = Get-FailedTestDetails -output $output
        }
        
        Remove-Item "temp_out.txt" -Force -ErrorAction SilentlyContinue
        Remove-Item "temp_err.txt" -Force -ErrorAction SilentlyContinue
        
        return @{
            Name = $name
            Total = $counts.Total
            Passed = $counts.Passed
            Failed = $counts.Failed
            ExitCode = $process.ExitCode
            Output = $output
            FailedTests = $failedTests
        }
    }
    catch {
        return @{
            Name = $name
            Total = 0
            Passed = 0
            Failed = 0
            ExitCode = 1
            Output = "Error: $_"
            FailedTests = @()
        }
    }
}

# Find test files
function Get-TestFiles {
    param([string]$dir)
    
    $files = Get-ChildItem -Path $dir -Filter "*.js" -Recurse -File | 
             Where-Object { $_.Name -match "^test" } |
             Sort-Object FullName
    
    return $files
}

# Summary
function Show-Summary {
    Write-Host ""
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor $script:Cyan
    Write-Host "  SUMMARY" -ForegroundColor $script:Cyan
    Write-Host "==========================================" -ForegroundColor $script:Cyan
    Write-Host ""
    
    $totalTests = 0
    $totalPassed = 0
    $totalFailed = 0
    
    foreach ($result in $script:AllResults) {
        $totalTests += $result.Total
        $totalPassed += $result.Passed
        $totalFailed += $result.Failed
    }
    
    Write-Host "  Total Tests:  $totalTests" -ForegroundColor $script:White
    Write-Host "  Passed:       $totalPassed" -ForegroundColor $script:Green
    Write-Host "  Failed:       $totalFailed" -ForegroundColor $script:Red
    Write-Host ""
    
    if ($totalFailed -eq 0 -and $totalTests -gt 0) {
        Write-Host "  [SUCCESS] All tests passed! (100%)" -ForegroundColor $script:Green
        Write-Host ""
        
        # Show file breakdown
        Write-Host "  Files:" -ForegroundColor $script:Cyan
        foreach ($result in $script:AllResults) {
            Write-Host "    [OK] $($result.Name) - $($result.Passed)/$($result.Total) passed" -ForegroundColor $script:Green
        }
    } elseif ($totalTests -eq 0) {
        Write-Host "  [WARNING] No tests were executed!" -ForegroundColor $script:Yellow
    } else {
        Write-Host "  [FAILED] $totalFailed test(s) failed!" -ForegroundColor $script:Red
        Write-Host ""
        
        # Show detailed failed tests
        Write-Host "  Failed Tests (Details):" -ForegroundColor $script:Red
        Write-Host ""
        
        foreach ($result in $script:AllResults) {
            if ($result.Failed -gt 0) {
                Write-Host "    File: $($result.Name)" -ForegroundColor $script:Yellow
                Write-Host "    Failed: $($result.Failed)/$($result.Total) tests" -ForegroundColor $script:Red
                Write-Host ""
                
                if ($result.FailedTests.Count -gt 0) {
                    Write-Host "    Failed test names:" -ForegroundColor $script:Red
                    foreach ($failedTest in $result.FailedTests) {
                        Write-Host "      [X] $failedTest" -ForegroundColor $script:Red
                    }
                } else {
                    Write-Host "    (Could not parse test names - run file manually for details)" -ForegroundColor $script:Yellow
                    Write-Host "    Command: node test\path\to\$($result.Name)" -ForegroundColor $script:Gray
                }
                
                Write-Host ""
            }
        }
    }
    
    Write-Host ""
}

# ============================================================
# MAIN
# ============================================================

Show-Banner

# Check project root
$projectRoot = Get-Location
if (-not (Test-Path "$projectRoot\package.json")) {
    Write-Host "  [ERROR] Not in project root!" -ForegroundColor $script:Red
    exit 1
}

# Get version
$packageJson = Get-Content "$projectRoot\package.json" | ConvertFrom-Json
$version = $packageJson.version

Write-Host "  Version: v$version" -ForegroundColor $script:Cyan
Write-Host ""

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "  Node.js: $nodeVersion" -ForegroundColor $script:Green
} catch {
    Write-Host "  [ERROR] Node.js not found!" -ForegroundColor $script:Red
    exit 1
}

# Find tests
$testDir = "$projectRoot\test"
if (-not (Test-Path $testDir)) {
    Write-Host "  [ERROR] test folder not found!" -ForegroundColor $script:Red
    exit 1
}

$testFiles = Get-TestFiles -dir $testDir

if ($testFiles.Count -eq 0) {
    Write-Host "  No tests found." -ForegroundColor $script:Yellow
    exit 0
}

Write-Host "  Found: $($testFiles.Count) test files" -ForegroundColor $script:Green
Write-Host ""
Write-Host "  Running tests..." -ForegroundColor $script:Cyan
Write-Host ""

# Run all tests
$totalTests = 0
$totalPassed = 0
$totalFailed = 0
$currentFileIndex = 0

foreach ($file in $testFiles) {
    $currentFileIndex++
    
    $relativePath = $file.FullName.Replace($testDir + "\", "")
    $fileName = $file.Name
    
    # Update progress
    Show-Progress -current ($currentFileIndex - 1) -total $testFiles.Count -passed $totalPassed -failed $totalFailed -currentFile "Starting $fileName..."
    
    # Run test
    $result = Run-TestFile -path $file.FullName -name $fileName
    $script:AllResults += $result
    
    # Update totals
    $totalTests += $result.Total
    $totalPassed += $result.Passed
    $totalFailed += $result.Failed
    
    # Update progress
    Show-Progress -current $currentFileIndex -total $testFiles.Count -passed $totalPassed -failed $totalFailed -currentFile $fileName
    
    Start-Sleep -Milliseconds 100
}

# Final progress line
Write-Host ""
Write-Host ""
Write-Host "  Complete! Processed $($testFiles.Count) files, $totalTests tests total." -ForegroundColor $script:Cyan

# Show summary
Show-Summary

# Exit code
if ($totalFailed -gt 0) {
    exit 1
} else {
    exit 0
}
