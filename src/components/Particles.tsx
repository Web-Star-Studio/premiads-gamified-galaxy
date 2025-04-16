
import { useEffect, useRef } from "react";

type ParticleProps = {
  count?: number;
  className?: string;
  colorful?: boolean;
};

const Particles: React.FC<ParticleProps> = ({ count = 30, className = "", colorful = true }) => {
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
      
      // Random opacity
      const opacity = Math.random() * 0.5 + 0.3;
      
      // Random color from our neon palette
      const colors = colorful 
        ? ['#2F80ED', '#9B53FF', '#FF4ECD', '#00C48C', '#FF5252'] 
        : ['#ffffff', '#f0f0f0', '#e0e0e0'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Random duration and movement range
      const duration = Math.random() * 15 + 10;
      const translateX = (Math.random() - 0.5) * 150;
      const translateY = Math.random() * -150 - 50;
      
      // Apply styles
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.backgroundColor = color;
      particle.style.opacity = opacity.toString();
      particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;
      
      // Apply custom animation
      particle.style.animation = `float ${duration}s infinite linear`;
      particle.style.transform = `translate(0, 0)`;
      
      // Create keyframe animation
      const anim = document.createElement('style');
      anim.textContent = `
        @keyframes float_${i} {
          0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: ${opacity};
          }
          50% {
            opacity: ${opacity + 0.2};
          }
          100% {
            transform: translate(${translateX}px, ${translateY}px) rotate(${Math.random() * 360}deg);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(anim);
      
      particle.style.animation = `float_${i} ${duration}s infinite`;
      
      container.appendChild(particle);
    }
    
    // Create star background
    for (let i = 0; i < 80; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      
      // Random positions
      const x = Math.random() * containerWidth;
      const y = Math.random() * containerHeight;
      
      // Random sizes
      const size = Math.random() * 2 + 0.5;
      
      // Random pulsing speed
      const duration = Math.random() * 3 + 2;
      
      // Apply styles
      star.style.left = `${x}px`;
      star.style.top = `${y}px`;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.opacity = (Math.random() * 0.5 + 0.3).toString();
      
      // Random twinkling effect
      star.style.animation = `pulse-neon ${duration}s infinite`;
      
      container.appendChild(star);
    }
    
    return () => {
      // Clean up style elements when component unmounts
      document.querySelectorAll(`style[data-particle-animation]`).forEach(el => el.remove());
    };
  }, [count, colorful]);

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${className}`}
    ></div>
  );
};

export default Particles;
