
import React, { useState, useRef, useEffect } from 'react';
import { useIntersectionObserver } from '@/utils/performance';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
  placeholder?: React.ReactNode;
  threshold?: number;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  fallback = '/placeholder.svg',
  placeholder,
  threshold = 0.1,
  className = '',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');
  const { targetRef, isIntersecting } = useIntersectionObserver({ threshold });

  useEffect(() => {
    if (isIntersecting && !imageSrc) {
      setImageSrc(src);
    }
  }, [isIntersecting, src, imageSrc]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setIsError(true);
    setImageSrc(fallback);
  };

  const defaultPlaceholder = (
    <div className={`animate-pulse bg-muted rounded ${className}`}>
      <div className="w-full h-full flex items-center justify-center">
        <span className="text-xs text-muted-foreground">Carregando...</span>
      </div>
    </div>
  );

  return (
    <div ref={targetRef} className={`relative ${className}`}>
      {!isLoaded && (placeholder || defaultPlaceholder)}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`
            transition-opacity duration-300
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
            ${className}
          `}
          {...props}
        />
      )}
    </div>
  );
};

// Optimized image component for avatars
export const LazyAvatar: React.FC<{
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
}> = ({ src, alt, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <LazyImage
      src={src || '/placeholder.svg'}
      alt={alt}
      className={`rounded-full ${sizeClasses[size]}`}
      placeholder={
        <div className={`bg-muted rounded-full ${sizeClasses[size]} flex items-center justify-center`}>
          <span className="text-xs text-muted-foreground">
            {alt.charAt(0).toUpperCase()}
          </span>
        </div>
      }
    />
  );
};
