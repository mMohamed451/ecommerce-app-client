import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, type, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          className={cn(
            'flex h-11 w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-2.5 text-sm',
            'placeholder:text-gray-400',
            'focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-all duration-200 hover:border-gray-300',
            error && 'border-red-500 focus:ring-red-500/20 focus:border-red-500',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
