// src/components/PracticeMode/WaveformVisualizer.jsx
import React, { useEffect, useRef } from 'react';

/**
 * Real-time audio waveform visualizer using Canvas API
 * Shows animated bars when microphone is active
 */
const WaveformVisualizer = ({ isListening, color = '#667eea' }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const barsRef = useRef([]);

  // Initialize bars with random heights
  useEffect(() => {
    const barCount = 20;
    barsRef.current = Array(barCount).fill(0).map(() => ({
      height: Math.random() * 0.5 + 0.2,
      speed: Math.random() * 0.05 + 0.02,
      direction: Math.random() > 0.5 ? 1 : -1
    }));
  }, []);

  // Animation loop
  useEffect(() => {
    if (!isListening) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Update and draw bars
      const barWidth = width / barsRef.current.length;
      const gap = 2;

      barsRef.current.forEach((bar, index) => {
        // Update height with wave motion
        bar.height += bar.speed * bar.direction;
        
        // Bounce when reaching limits
        if (bar.height > 1) {
          bar.height = 1;
          bar.direction = -1;
        } else if (bar.height < 0.2) {
          bar.height = 0.2;
          bar.direction = 1;
        }

        // Calculate bar dimensions
        const x = index * barWidth + gap / 2;
        const barHeight = bar.height * height * 0.8;
        const y = (height - barHeight) / 2;

        // Draw bar with gradient
        const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, `${color}80`);

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth - gap, barHeight);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isListening, color]);

  return (
    <div className="relative w-full h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
      <canvas
        ref={canvasRef}
        width={400}
        height={80}
        className="w-full h-full"
      />
      
      {/* Overlay text when not listening */}
      {!isListening && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
          🎤 Nyomd meg a mikrofont a felvételhez
        </div>
      )}
    </div>
  );
};

export default WaveformVisualizer;
