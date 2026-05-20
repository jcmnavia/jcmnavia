import * as React from 'react';
import {cva, type VariantProps} from 'class-variance-authority';
import {cn} from '@/app/lib/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        solid: 'bg-foreground text-background hover:bg-accent',
        accent: 'bg-accent text-accent-foreground hover:opacity-90',
        ghost: 'border border-border text-foreground hover:bg-muted',
      },
      size: {
        default: 'h-11 px-5',
        sm: 'h-9 px-4',
      },
    },
    defaultVariants: {variant: 'solid', size: 'default'},
  }
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({className, variant, size, ...props}, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({variant, size}), className)}
      {...props}
    />
  )
);
Button.displayName = 'Button';

export {buttonVariants};
