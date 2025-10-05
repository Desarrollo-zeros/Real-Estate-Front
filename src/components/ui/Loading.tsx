import { Loader2 } from 'lucide-react';
import { classNames } from '../../utils/helpers';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

/**
 * Loading Spinner Component
 */
export const Loading = ({ size = 'md', message, fullScreen = false, className }: LoadingProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const content = (
    <div className="flex flex-col items-center justify-center">
      <Loader2 className={classNames('animate-spin text-primary', sizeClasses[size])} />
      {message && <p className="mt-3 text-text-light text-sm">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        {content}
      </div>
    );
  }

  return <div className={classNames('flex items-center justify-center p-8', className)}>{content}</div>;
};

/**
 * Skeleton loader for content placeholders
 */
export const Skeleton = ({ className }: { className?: string }) => {
  return (
    <div
      className={classNames('animate-pulse bg-neutral-200 rounded', className)}
      style={{ animationDuration: '1.5s' }}
    />
  );
};
