import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, id, checked, onChange, ...props }, ref) => {
    const checkboxId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        <label
          htmlFor={checkboxId}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <input
            id={checkboxId}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className={cn(
              'w-4 h-4 rounded border-2 border-gray-300 text-primary-600',
              'focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
              'transition-all duration-200',
              'group-hover:border-primary-400',
              'checked:bg-primary-600 checked:border-primary-600',
              error && 'border-red-500',
              className
            )}
            ref={ref}
            {...props}
          />
          {label && (
            <span className={cn('text-sm', error && 'text-red-600')}>{label}</span>
          )}
        </label>
        {error && <p className="mt-1 text-sm text-red-600 ml-6">{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
