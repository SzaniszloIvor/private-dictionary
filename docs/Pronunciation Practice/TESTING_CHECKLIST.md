// TESTING_CHECKLIST.md

# 🧪 Pronunciation Practice Mode - Testing Checklist

## Browser Compatibility
- [ ] Chrome (Desktop) - Full functionality
- [ ] Chrome (Mobile) - Touch optimized
- [ ] Edge (Desktop) - Full functionality
- [ ] Edge (Mobile) - Touch optimized
- [ ] Safari (Desktop) - Limited support warning
- [ ] Safari (iOS) - Limited support warning
- [ ] Firefox (Desktop) - Not supported message
- [ ] Firefox (Mobile) - Not supported message

## Microphone Permissions
- [ ] First time access - permission prompt shows
- [ ] Permission granted - microphone works
- [ ] Permission denied - clear error message with instructions
- [ ] Permission revoked - proper error handling
- [ ] Multiple tabs - no conflicts

## Speech Recognition
- [ ] Clear speech recognized correctly (>90% accuracy)
- [ ] Whispered speech - appropriate feedback
- [ ] Background noise - handles gracefully
- [ ] No speech detected - timeout and retry
- [ ] Network interruption - error handling
- [ ] Multiple attempts - score updates correctly

## UI/UX
- [ ] Waveform animation smooth (60fps)
- [ ] Button press feedback immediate (<100ms)
- [ ] Score animation plays correctly
- [ ] Badges appear with animation
- [ ] Tips toggle works
- [ ] Progress bar updates
- [ ] Auto-finish triggers correctly

## Mobile Specific
- [ ] Touch targets min 44x44px
- [ ] No double-tap zoom
- [ ] Prevents context menu on long press
- [ ] Landscape orientation works
- [ ] Screen doesn't sleep during recording
- [ ] Haptic feedback (if available)

## Accessibility
- [ ] Keyboard navigation works (Space, Escape)
- [ ] Screen reader announces status
- [ ] ARIA labels present
- [ ] Focus management correct
- [ ] Color contrast WCAG AA compliant
- [ ] Works without mouse

## Performance
- [ ] Initial load <2s
- [ ] Microphone starts <500ms
- [ ] Recognition completes <3s
- [ ] Score calculation <100ms
- [ ] No memory leaks after 10 sessions
- [ ] Smooth animations (no jank)

## Error Handling
- [ ] Network error - retry option
- [ ] Microphone error - troubleshooting tips
- [ ] Browser not supported - clear message
- [ ] Component crash - error boundary
- [ ] Invalid scores - graceful handling

## Data & Privacy
- [ ] No audio data stored
- [ ] No data sent to server
- [ ] localStorage cleaned on logout
- [ ] Session stats persist correctly
- [ ] No PII leaked in console

## Integration
- [ ] Works with existing practice modes
- [ ] Stats integrate with results screen
- [ ] Badges work with reward system
- [ ] Modal close/escape works
- [ ] Navigation between words smooth

## Edge Cases
- [ ] 0 words in lesson - handled
- [ ] 1 word in lesson - works
- [ ] 50+ words in lesson - performance OK
- [ ] Rapid start/stop - no crashes
- [ ] Switch tabs during recording - handled
- [ ] Browser back button - state preserved

## Localization
- [ ] Hungarian UI text correct
- [ ] Error messages in Hungarian
- [ ] Tips in Hungarian
- [ ] Phonetic symbols display correctly

---

## Test Results

**Date:** ___________
**Tester:** ___________
**Browser:** ___________
**Device:** ___________

**Pass Rate:** _____ / _____
**Critical Issues:** ___________
**Notes:** ___________