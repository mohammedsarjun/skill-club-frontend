import * as React from 'react';
import { cn } from '@/utils/cn';
import { ButtonProps } from '@/types/interfaces/ui';

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className, children, ...props }) => {
  const base = 'inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors';
  const variantClass =
    variant === 'primary'
      ? 'bg-blue-600 text-white hover:bg-blue-700'
      : variant === 'secondary'
      ? 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
      : variant === 'outline'
      ? 'bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-50'
      : 'bg-red-600 text-white hover:bg-red-700';

  return (
    <button className={cn(base, variantClass, className)} {...props}>
      {children}
    </button>
  );
};

export default Button;
