
import { useState, useEffect, useRef, RefObject } from 'react';

/**
 * Configuration options for the intersection observer
 */
interface IntersectionObserverOptions {
  /** The element that is used as the viewport for checking visibility of the target */
  root?: Element | null;
  /** Margin around the root */
  rootMargin?: string;
  /** Threshold(s) at which to trigger callback */
  threshold?: number | number[];
  /** Whether to unobserve the element after it has been intersected once */
  triggerOnce?: boolean;
}

/**
 * Hook that tracks when an element is visible in the viewport
 * Useful for implementing lazy loading, infinite scrolling, and animations
 * 
 * @param options Configuration options for the intersection observer
 * @returns [ref, isIntersecting] - Ref to attach to the element and boolean indicating if element is visible
 */
export function useIntersectionObserver<T extends Element>({
  root = null,
  rootMargin = '0px',
  threshold = 0,
  triggerOnce = false,
}: IntersectionObserverOptions = {}): [RefObject<T>, boolean] {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const elementRef = useRef<T>(null);
  
  useEffect(() => {
    const targetElement = elementRef.current;
    if (!targetElement) return;
    
    const observerCallback = ([entry]: IntersectionObserverEntry[]) => {
      const isElementIntersecting = entry.isIntersecting;
      setIsIntersecting(isElementIntersecting);
      
      // Unobserve element after intersection if triggerOnce is enabled
      if (isElementIntersecting && triggerOnce && targetElement) {
        observer.unobserve(targetElement);
      }
    };
    
    const observer = new IntersectionObserver(
      observerCallback,
      { root, rootMargin, threshold }
    );
    
    observer.observe(targetElement);
    
    // Cleanup observer on unmount
    return () => {
      if (targetElement) {
        observer.unobserve(targetElement);
      }
    };
  }, [root, rootMargin, threshold, triggerOnce]);
  
  return [elementRef, isIntersecting];
}

export default useIntersectionObserver;
