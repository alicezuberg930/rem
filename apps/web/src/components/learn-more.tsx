import { CircleQuestionMark } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'

type LearnMoreProps = {
  children: React.ReactNode
  contentProps?: React.ComponentProps<typeof PopoverContent>
  triggerProps?: React.ComponentProps<typeof PopoverTrigger>
}

export function LearnMore({
  children,
  contentProps,
  triggerProps,
}: LearnMoreProps) {
  return (
    <Popover>
      <PopoverTrigger {...triggerProps}>
        <Button
          variant='outline'
          size='icon'
          className={cn('size-5', triggerProps?.className)}
        >
          <span className='sr-only'>Learn more</span>
          <CircleQuestionMark className='size-4' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        {...contentProps}
        className={cn('text-sm text-muted-foreground', contentProps?.className)}
      >
        {children}
      </PopoverContent>
    </Popover>
  )
}
