
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const LoadingParticles = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    
    // Create particles
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const particle = document.createElement('div');
        particle.className = 'absolute w-1 h-1 rounded-full opacity-0';
        
        // Randomize particle properties
        const size = Math.random() * 3 + 1;
        const posX = containerWidth / 2 + (Math.random() * 10 - 5);
        const posY = containerHeight / 2 + (Math.random() * 10 - 5);
        const speedX = Math.random() * 4 - 2;
        const speedY = Math.random() * -3 - 1; // Always move upward
        const rotation = Math.random() * 360;
        const lifespan = Math.random() * 1000 + 500;
        
        // Set random color (neon)
        const colors = ['#00FFE7', '#FF00C8', '#b4f10a', '#9b87f5'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Apply styles
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}px`;
        particle.style.top = `${posY}px`;
        particle.style.backgroundColor = color;
        particle.style.boxShadow = `0 0 4px ${color}`;
        
        // Add particle to container
        container.appendChild(particle);
        
        // Animate the particle
        let start: number | null = null;
        let opacity = 0;
        
        function animate(timestamp: number) {
          if (!start) start = timestamp;
          const elapsed = timestamp - start;
          
          if (elapsed < 200) {
            opacity = elapsed / 200;
          } else if (elapsed > lifespan - 200) {
            opacity = (lifespan - elapsed) / 200;
          } else {
            opacity = 1;
          }
          
          const x = posX + speedX * elapsed / 20;
          const y = posY + speedY * elapsed / 20;
          const rot = rotation + elapsed / 10;
          
          particle.style.opacity = opacity.toString();
          particle.style.transform = `translate(${x - posX}px, ${y - posY}px) rotate(${rot}deg)`;
          
          if (elapsed < lifespan) {
            requestAnimationFrame(animate);
          } else {
            container.removeChild(particle);
          }
        }
        
        requestAnimationFrame(animate);
      }, Math.random() * 1000); // Stagger particle creation
    }
  }, []);
  
  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Particles will be dynamically added here */}
    </div>
  );
};

export default LoadingParticles;
