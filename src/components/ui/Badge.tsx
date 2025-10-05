import { HTMLAttributes, ReactNode } from 'react';
import { classNames } from '../../utils/helpers';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  children: ReactNode;
}

/**
 * Reusable Badge Component
 */
export const Badge = ({ variant = 'primary', children, className, ...props }: BadgeProps) => {
  const variantClasses = {
    primary: 'badge-primary',
    secondary: 'badge-secondary',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
  };

  return (
    <span className={classNames('badge', variantClasses[variant], className)} {...props}>
      {children}
    </span>
  );
};
