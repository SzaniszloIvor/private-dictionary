// src/components/PracticeMode/ConfettiReward.jsx
import React, { useEffect, useRef } from 'react';

const ConfettiReward = ({ active, intensity = 'normal' }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!active) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const ctx = canvas.getContext('2d');
    
    // Confetti particles array
    const particles = [];
    const particleCount = intensity === 'epic' ? 200 : intensity === 'high' ? 150 : 100;
    const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#FFD700', '#FF6B6B'];
    
    class Particle {
      constructor() {
        this.reset();
      }
      
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = -20;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = Math.random() * 3 + 2;
        this.size = Math.random() * 8 + 4;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 10;
      }
      
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.1; // Gravity
        this.rotation += this.rotationSpeed;
        
        // Reset particle when it goes off screen
        if (this.y > canvas.height + 20) {
          this.reset();
        }
      }
      
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
        ctx.restore();
      }
    }
    
    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    // Animation loop
    let animationId;
    const startTime = Date.now();
    const duration = intensity === 'epic' ? 4000 : 3000;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      
      if (elapsed > duration) {
        cancelAnimationFrame(animationId);
        return;
      }
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [active, intensity]);
  
  if (!active) return null;
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
    />
  );
};

export default ConfettiReward;
