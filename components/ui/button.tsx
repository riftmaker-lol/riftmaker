import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import LoadingIndicator from '../loading-indicator';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline: 'border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        accent: 'bg-accent text-accent-foreground shadow-sm hover:bg-accent/90',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

interface ButtonProps extends VariantProps<typeof buttonVariants> {
  onClick?: () => void;
  loading?: boolean;
  className?: string;
  children?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  ref?: React.ForwardedRef<HTMLButtonElement>;
  icon?: React.ReactNode;
  disabled?: boolean;
}
const Button: React.FC<ButtonProps> = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, loading, onClick, className, type, variant, icon, size, disabled }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }), {
          'gap-2': loading,
        })}
        disabled={loading || disabled}
        type={type ?? 'button'}
        ref={ref}
        {...(onClick && { onClick })}
      >
        {!loading && icon}
        {loading && <LoadingIndicator variant="spinner" className="h-4 w-4" />}
        {children ?? null}
      </button>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
