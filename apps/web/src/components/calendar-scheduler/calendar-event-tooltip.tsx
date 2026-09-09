import type { ComponentProps } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type {
  CalendarEvent,
  CalendarEventRenderer,
  CalendarEventRenderProps,
} from './types'
import { formatEventRange } from './utils'

type CalendarEventTooltipProps<TEvent extends CalendarEvent> =
  CalendarEventRenderProps<TEvent> & {
    trigger: NonNullable<ComponentProps<typeof TooltipTrigger>['render']>
    renderEventTooltip?: CalendarEventRenderer<TEvent>
  }

export const CalendarEventTooltip = <TEvent extends CalendarEvent>({
  event,
  view,
  startsAt,
  endsAt,
  trigger,
  renderEventTooltip,
}: CalendarEventTooltipProps<TEvent>) => {
  const renderProps = { event, view, startsAt, endsAt }

  return (
    <Tooltip>
      <TooltipTrigger render={trigger} />
      <TooltipContent
        align='start'
      >
        {renderEventTooltip ? (
          renderEventTooltip(renderProps)
        ) : (
          <DefaultEventTooltip {...renderProps} />
        )}
      </TooltipContent>
    </Tooltip>
  )
}

const DefaultEventTooltip = ({
  event,
  startsAt,
  endsAt,
}: CalendarEventRenderProps) => {
  return (
    <div className='space-y-1'>
      <p className='font-medium'>{event.title}</p>
      <p className='text-muted-foreground'>
        {formatEventRange(startsAt, endsAt)}
      </p>
    </div>
  )
}
