import { useEffect, useRef } from "react";

// Add a single style block for all particle animations
const particleStyles = `
  @keyframes float {
    0% {
      transform: translate(var(--tx-start), var(--ty-start)) rotate(0deg);
      opacity: var(--opacity-start);
    }
    100% {
      transform: translate(var(--tx-end), var(--ty-end)) rotate(var(--rotate-end));
      opacity: 0;
    }
  }

  @keyframes pulse-neon {
    0%, 100% {
      transform: scale(1);
      opacity: var(--opacity-start);
    }
    50% {
      transform: scale(1.5);
      opacity: 1;
    }
  }

  .particle, .star {
    position: absolute;
    border-radius: 50%;
  }
`;

type ParticleProps = {
  count?: number;
  className?: string;
  colorful?: boolean;
};

const Particles: React.FC<ParticleProps> = ({ count = 30, className = "", colorful = true }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const styleTagRef = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Inject styles once
    if (!styleTagRef.current) {
      const styleTag = document.createElement('style');
      styleTag.id = 'particle-animations';
      styleTag.textContent = particleStyles;
      document.head.appendChild(styleTag);
      styleTagRef.current = styleTag;
    }
    
    const container = containerRef.current;
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    
    container.innerHTML = '';
    const fragment = document.createDocumentFragment();
    
    // Create particles
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      const x = Math.random() * containerWidth;
      const y = Math.random() * containerHeight;
      const size = Math.random() * 3 + 1;
      const opacity = Math.random() * 0.5 + 0.3;
      
      const colors = colorful 
        ? ['#2F80ED', '#9B53FF', '#FF4ECD', '#00C48C', '#FF5252'] 
        : ['#ffffff', '#f0f0f0', '#e0e0e0'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      const duration = Math.random() * 15 + 10;
      const translateX = (Math.random() - 0.5) * 150;
      const translateY = Math.random() * -150 - 50;
      
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.backgroundColor = color;
      particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;
      
      particle.style.setProperty('--tx-start', '0px');
      particle.style.setProperty('--ty-start', '0px');
      particle.style.setProperty('--tx-end', `${translateX}px`);
      particle.style.setProperty('--ty-end', `${translateY}px`);
      particle.style.setProperty('--rotate-end', `${Math.random() * 360}deg`);
      particle.style.setProperty('--opacity-start', opacity.toString());
      
      particle.style.animation = `float ${duration}s infinite linear`;
      
      fragment.appendChild(particle);
    }
    
    // Create star background
    for (let i = 0; i < 80; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      
      const x = Math.random() * containerWidth;
      const y = Math.random() * containerHeight;
      const size = Math.random() * 2 + 0.5;
      const opacity = Math.random() * 0.5 + 0.3;
      const duration = Math.random() * 3 + 2;
      
      star.style.left = `${x}px`;
      star.style.top = `${y}px`;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.backgroundColor = 'white';

      star.style.setProperty('--opacity-start', opacity.toString());
      star.style.animation = `pulse-neon ${duration}s infinite alternate`;
      
      fragment.appendChild(star);
    }
    
    container.appendChild(fragment);

    return () => {
      if (styleTagRef.current && styleTagRef.current.parentNode) {
        styleTagRef.current.parentNode.removeChild(styleTagRef.current);
        styleTagRef.current = null;
      }
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
