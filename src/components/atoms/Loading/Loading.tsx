
import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import { LoadingProps } from './types';

const Loading = memo<LoadingProps>(({ size = 'default', className, text }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    default: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-muted border-t-primary',
          sizeClasses[size],
          className
        )}
      />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  );
});

Loading.displayName = 'Loading';

export { Loading };
