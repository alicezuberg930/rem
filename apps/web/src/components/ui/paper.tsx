import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const paperVariants = cva(
  'rounded-lg bg-card text-card-foreground transition-shadow p-4',
  {
    variants: {
      variant: {
        outline: 'border border-border',
        elevation: '',
      },
      elevation: {
        0: 'shadow-none',
        1: 'shadow-sm',
        2: 'shadow-md',
        3: 'shadow-lg',
        4: 'shadow-xl',
      },
    },
    defaultVariants: {
      variant: 'outline',
    },
  }
)

export function Paper({
  className,
  variant,
  elevation,
  ...props
}: React.ComponentProps<'div'> &
  VariantProps<typeof paperVariants> & {
    asChild?: boolean
  }) {
  return (
    <div
      className={cn(paperVariants({ variant, elevation, className }))}
      {...props}
    />
  )
}
