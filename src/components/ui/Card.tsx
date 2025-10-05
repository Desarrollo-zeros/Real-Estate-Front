import { HTMLAttributes, ReactNode } from 'react';
import { classNames } from '../../utils/helpers';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: ReactNode;
}

/**
 * Reusable Card Component
 */
export const Card = ({
  hover = false,
  padding = 'md',
  children,
  className,
  ...props
}: CardProps) => {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={classNames(
        'bg-white rounded-card shadow-card',
        hover && 'hover:shadow-card-hover transition-shadow cursor-pointer',
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Card Header
 */
export const CardHeader = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <div className={classNames('mb-4 border-b border-neutral-200 pb-3', className)}>
      {children}
    </div>
  );
};

/**
 * Card Title
 */
export const CardTitle = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <h3 className={classNames('text-xl font-bold text-text', className)}>
      {children}
    </h3>
  );
};

/**
 * Card Content
 */
export const CardContent = ({ children, className }: { children: ReactNode; className?: string }) => {
  return <div className={classNames('text-text', className)}>{children}</div>;
};

/**
 * Card Footer
 */
export const CardFooter = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <div className={classNames('mt-4 pt-4 border-t border-neutral-200', className)}>
      {children}
    </div>
  );
};
