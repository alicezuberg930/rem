import type { CSSProperties } from 'react'
import { alpha, cn } from '@/lib/utils'
import { CalendarEventTooltip } from './calendar-event-tooltip'
import type {
  CalendarEvent,
  CalendarEventRenderer,
  CalendarEventRenderProps,
} from './types'
import { formatTimeLabel } from './utils'

type CalendarEventCardProps<TEvent extends CalendarEvent = CalendarEvent> =
  CalendarEventRenderProps<TEvent> & {
    compact?: boolean
    presentation?: 'time-grid' | 'date-grid' | 'month-grid'
    showStartBorder?: boolean
    continuesBefore?: boolean
    continuesAfter?: boolean
    className?: string
    style?: CSSProperties
    onClick: (event: TEvent) => void
    renderEventTooltip?: CalendarEventRenderer<TEvent>
  }

export const CalendarEventCard = <
  TEvent extends CalendarEvent = CalendarEvent,
>({
  event,
  view,
  startsAt,
  endsAt,
  compact = false,
  presentation,
  showStartBorder = true,
  continuesBefore = false,
  continuesAfter = false,
  className,
  style,
  onClick,
  renderEventTooltip,
}: CalendarEventCardProps<TEvent>) => {
  const color = event.color ?? '#2563eb'
  const resolvedPresentation = presentation ?? (view === 'month' ? 'month-grid' : 'time-grid')
  const isZeroDuration = startsAt.getTime() === endsAt.getTime()

  return (
    <CalendarEventTooltip
      event={event}
      view={view}
      startsAt={startsAt}
      endsAt={endsAt}
      renderEventTooltip={renderEventTooltip}
      trigger={
        <button
          type='button'
          aria-label={event.title}
          className={cn(
            'group/event flex min-w-0 flex-col rounded-md border border-l-4 px-2 py-1 text-left text-xs shadow-xs transition outline-none hover:brightness-95 focus-visible:ring-2 focus-visible:ring-ring/50',
            compact && 'h-full justify-center px-1.5 py-0.5',
            !showStartBorder && 'border-l',
            continuesBefore && 'rounded-l-none border-l',
            continuesAfter && 'rounded-r-none',
            className
          )}
          style={{
            backgroundColor: alpha(color, 0.14),
            borderColor: alpha(color, 0.3),
            borderLeftColor: showStartBorder ? color : alpha(color, 0.3),
            borderLeftWidth: showStartBorder ? 4 : 1,
            ...style,
          }}
          onClick={() => onClick(event)}
        >
          <span className='flex w-full min-w-0 items-center gap-1'>
            {resolvedPresentation === 'month-grid' && (
              <span className='shrink-0 font-medium text-foreground/70'>
                {formatTimeLabel(startsAt)}
              </span>
            )}
            <span className='min-w-0 truncate font-medium text-foreground'>
              {event.title}
            </span>
            {(resolvedPresentation === 'date-grid' ||
              (resolvedPresentation === 'time-grid' && compact)) && (
                <span className='shrink-0 text-foreground/70'>
                  {formatTimeLabel(startsAt)}
                </span>
              )}
          </span>
          {!compact && resolvedPresentation === 'time-grid' && (
            <span className='mt-0.5 truncate text-[11px] text-muted-foreground'>
              {formatTimeLabel(startsAt)}
              {!isZeroDuration && ` - ${formatTimeLabel(endsAt)}`}
            </span>
          )}
        </button>
      }
    />
  )
}
