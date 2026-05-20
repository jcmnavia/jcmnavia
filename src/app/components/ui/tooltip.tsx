'use client';

import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import {cn} from '@/app/lib/cn';

/**
 * Shadcn-style Tooltip wrapper over Radix's accessible Tooltip primitive.
 *
 * Re-exports the four pieces a consumer typically composes:
 *   • TooltipProvider — wraps your subtree (usually at section root).
 *   • Tooltip          — controls open state for one trigger/content pair.
 *   • TooltipTrigger   — the focusable element the tooltip is anchored to.
 *   • TooltipContent   — the floating bubble, styled to match the redesign
 *                        (dark ink on cream, mono caption font).
 *
 * Theme: uses the existing `--foreground` / `--background` tokens, so the
 * tooltip inverts cleanly in dark mode.
 *
 * Accessibility: Radix handles focus management, ESC dismissal, keyboard
 * navigation, and `aria-describedby` plumbing.
 */
const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({className, sideOffset = 6, ...props}, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      'z-50 overflow-hidden rounded-md bg-foreground px-2.5 py-1.5 font-mono text-xs font-bold uppercase tracking-[0.04em] text-background shadow-md',
      'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
      'data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95',
      className
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger};
