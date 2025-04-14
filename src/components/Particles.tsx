
import { useEffect, useRef } from "react";

type ParticleProps = {
  count?: number;
  className?: string;
};

const Particles: React.FC<ParticleProps> = ({ count = 30, className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    
    // Clear any existing particles
    container.innerHTML = '';
    
    // Create particles
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random positions
      const x = Math.random() * containerWidth;
      const y = Math.random() * containerHeight;
      
      // Random sizes
      const size = Math.random() * 3 + 1;
      
      // Random animation delay
      const delay = Math.random() * 5;
      
      // Random color from our neon palette
      const colors = ['#00FFE7', '#FF00C8', '#b4f10a', '#9b87f5', '#1EAEDB'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Apply styles
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.backgroundColor = color;
      particle.style.animationDelay = `${delay}s`;
      
      container.appendChild(particle);
    }
    
    // Create star background
    for (let i = 0; i < 50; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      
      // Random positions
      const x = Math.random() * containerWidth;
      const y = Math.random() * containerHeight;
      
      // Random sizes
      const size = Math.random() * 2 + 1;
      
      // Apply styles
      star.style.left = `${x}px`;
      star.style.top = `${y}px`;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      
      // Random twinkling effect
      star.style.animation = `pulse-neon ${Math.random() * 3 + 2}s infinite`;
      
      container.appendChild(star);
    }
  }, [count]);

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${className}`}
    ></div>
  );
};

export default Particles;
