
import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import { CardProps } from './types';

const Card = memo<CardProps>(({ className, children, ...props }) => (
  <div
    className={cn(
      'rounded-lg border bg-card text-card-foreground shadow-sm',
      className
    )}
    {...props}
  >
    {children}
  </div>
));

const CardHeader = memo<React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }) => (
  <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
));

const CardTitle = memo<React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }) => (
  <h3 className={cn('text-2xl font-semibold leading-none tracking-tight', className)} {...props} />
));

const CardDescription = memo<React.HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }) => (
  <p className={cn('text-sm text-muted-foreground', className)} {...props} />
));

const CardContent = memo<React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }) => (
  <div className={cn('p-6 pt-0', className)} {...props} />
));

const CardFooter = memo<React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }) => (
  <div className={cn('flex items-center p-6 pt-0', className)} {...props} />
));

Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardTitle.displayName = 'CardTitle';
CardDescription.displayName = 'CardDescription';
CardContent.displayName = 'CardContent';
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
