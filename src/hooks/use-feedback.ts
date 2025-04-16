
import { useState } from 'react';
import { toastSuccess, toastError, toastInfo, toastWarning } from '@/utils/toast';
import { useSounds } from '@/hooks/use-sounds';

type FeedbackType = 'success' | 'error' | 'info' | 'warning';

interface UseFeedbackOptions {
  successMessage?: string;
  errorMessage?: string;
  playSounds?: boolean;
}

/**
 * Hook for managing loading states and feedback notifications
 */
export const useFeedback = (options: UseFeedbackOptions = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { playSound } = useSounds();
  const { successMessage, errorMessage, playSounds = true } = options;
  
  const showFeedback = (type: FeedbackType, title: string, description?: string) => {
    if (playSounds) {
      const soundMap: Record<FeedbackType, string> = {
        success: 'success',
        error: 'error',
        info: 'notification',
        warning: 'notification'
      };
      playSound(soundMap[type]);
    }
    
    switch (type) {
      case 'success':
        toastSuccess(title, description, false); // passing false since we already played sound
        break;
      case 'error':
        toastError(title, description, false);
        break;
      case 'info':
        toastInfo(title, description, false);
        break;
      case 'warning':
        toastWarning(title, description, false);
        break;
    }
  };
  
  /**
   * Executes an async function with loading state and automatic feedback
   */
  const withFeedback = async <T,>(
    asyncFn: () => Promise<T>,
    {
      successTitle = successMessage || 'Operação concluída',
      successDescription,
      errorTitle = errorMessage || 'Ocorreu um erro',
      errorDescription,
      showSuccessFeedback = true,
      showErrorFeedback = true,
    } = {}
  ): Promise<T | undefined> => {
    setIsLoading(true);
    
    try {
      const result = await asyncFn();
      
      if (showSuccessFeedback) {
        showFeedback('success', successTitle, successDescription);
      }
      
      return result;
    } catch (error) {
      if (showErrorFeedback) {
        const description = errorDescription || (error instanceof Error ? error.message : undefined);
        showFeedback('error', errorTitle, description);
      }
      console.error('Operation error:', error);
      return undefined;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    isLoading,
    setIsLoading,
    showFeedback,
    withFeedback,
    // Convenience methods
    showSuccess: (title: string, description?: string) => showFeedback('success', title, description),
    showError: (title: string, description?: string) => showFeedback('error', title, description),
    showInfo: (title: string, description?: string) => showFeedback('info', title, description),
    showWarning: (title: string, description?: string) => showFeedback('warning', title, description),
  };
};
