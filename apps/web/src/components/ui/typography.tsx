import * as React from 'react'
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const typographyVariants = cva('mb-1 text-base leading-7 font-normal', {
  variants: {
    variant: {
      h1: 'mb-8 scroll-m-20 text-7xl font-extrabold tracking-tight text-balance lg:text-8xl',
      h2: 'mb-5 scroll-m-20 text-5xl font-bold tracking-tight text-balance first:mt-0 lg:text-6xl',
      h3: 'mb-4 scroll-m-20 text-4xl font-semibold tracking-tight text-balance lg:text-5xl',
      h4: 'mb-3 scroll-m-20 text-3xl font-semibold tracking-tight text-balance lg:text-4xl',
      h5: 'mb-2.5 scroll-m-20 text-xl font-semibold tracking-tight text-balance lg:text-2xl',
      h6: 'mb-2 scroll-m-20 text-lg font-semibold tracking-tight text-balance lg:text-xl',
      p: 'text-xs text-pretty lg:text-sm',
      ul: 'my-4 ml-6 list-disc text-base lg:text-lg [&>li]:mt-2 [&>li]:first:mt-0',
      ol: '"my-4 ml-6 list-decimal text-base lg:text-lg [&>li]:mt-2 [&>li]:first:mt-0',
      blockquote: 'my-2 border-l-2 pl-6 italic',
      code: 'relative w-fit rounded-md bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-medium',
      caption: 'block text-sm tracking-wide',
      span: 'text-xs text-pretty lg:text-base',
    },
  },
  defaultVariants: {
    variant: 'p',
  },
})

interface TypographyProps
  extends React.ComponentProps<'p'>, VariantProps<typeof typographyVariants> {
  component?: React.ElementType
}

const Typography = React.forwardRef<
  HTMLParagraphElement | HTMLHeadingElement | HTMLSpanElement,
  TypographyProps
>(({ className, variant = 'p', component, ...props }, ref) => {
  const Comp = component ?? (variant as React.ElementType)

  return (
    <Comp
      ref={ref}
      data-slot='typography'
      className={cn(typographyVariants({ variant }), className)}
      {...props}
    />
  )
})
Typography.displayName = 'TypographyButton'

export { Typography, typographyVariants, type TypographyProps }
