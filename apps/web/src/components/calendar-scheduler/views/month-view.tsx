import { useMemo } from 'react'
import { format, isToday } from 'date-fns'
import { cn } from '@/lib/utils'
import { CalendarEventCard } from '../calendar-event-card'
import type { CalendarEvent, CalendarViewProps } from '../types'
import { formatDayKey, getMonthEventLayout, getMonthWeeks } from '../utils'

const MAX_VISIBLE_EVENTS = 4
const EVENT_HEIGHT = 24
const EVENT_GAP = 4
const WEEK_MIN_HEIGHT = 184

export const MonthView = <TEvent extends CalendarEvent = CalendarEvent>({
  date,
  events,
  view,
  onEventClick,
  onSelectDate,
  renderEventTooltip,
}: CalendarViewProps<TEvent>) => {
  const weeks = useMemo(() => getMonthWeeks(date), [date])
  const layouts = useMemo(
    () => weeks.map((week) => getMonthEventLayout(events, week)),
    [events, weeks]
  )

  return (
    <div className='flex min-w-[700px] flex-col overflow-hidden rounded-md border bg-background'>
      {weeks.map((week, weekIndex) => {
        const layout = layouts[weekIndex]
        const laneCount = layout.reduce(
          (count, event) => Math.max(count, event.lane + 1),
          0
        )
        const visibleLaneCount = Math.min(laneCount, MAX_VISIBLE_EVENTS)
        const eventByPosition = new Map(
          layout.map((event) => [`${event.startColumn}:${event.lane}`, event])
        )
        const hiddenEventsByColumn = Array.from(
          { length: week.length },
          () => 0
        )

        for (const event of layout) {
          if (event.lane < MAX_VISIBLE_EVENTS) continue
          for (
            let column = event.startColumn;
            column <= event.endColumn;
            column++
          ) {
            hiddenEventsByColumn[column]++
          }
        }

        return (
          <div
            key={formatDayKey(week[0])}
            className='grid flex-1 grid-cols-7 border-b last:border-b-0'
            style={{ minHeight: WEEK_MIN_HEIGHT }}
          >
            {week.map((day, column) => {
              const hiddenEventCount = hiddenEventsByColumn[column]

              return (
                <div
                  key={formatDayKey(day)}
                  className='relative min-w-0 border-r py-2 last:border-r-0'
                >
                  <div className='flex flex-col items-center'>
                    {weekIndex === 0 && (
                      <span className='text-[11px] font-medium text-muted-foreground uppercase'>
                        {format(day, 'EEE')}
                      </span>
                    )}
                    <span
                      className={cn(
                        'flex size-6 items-center justify-center rounded-full text-xs font-medium',
                        isToday(day) && 'bg-primary text-primary-foreground'
                      )}
                    >
                      {format(day, 'd')}
                    </span>
                  </div>

                  <div
                    className='mt-1 grid'
                    style={{
                      gridTemplateRows: `repeat(${visibleLaneCount}, ${EVENT_HEIGHT}px)`,
                      gap: EVENT_GAP,
                    }}
                  >
                    {Array.from({ length: visibleLaneCount }, (_, lane) => {
                      const item = eventByPosition.get(`${column}:${lane}`)

                      return (
                        <div key={lane} className='relative min-w-0'>
                          {item && (
                            <CalendarEventCard
                              event={item.event}
                              view={view}
                              startsAt={item.startsAt}
                              endsAt={item.endsAt}
                              compact
                              presentation='month-grid'
                              showStartBorder={!item.continuesBefore}
                              continuesBefore={
                                weekIndex === 0 && item.continuesBefore
                              }
                              continuesAfter={
                                weekIndex === weeks.length - 1 &&
                                item.continuesAfter
                              }
                              onClick={onEventClick}
                              renderEventTooltip={renderEventTooltip}
                              className='absolute inset-y-0 left-0 z-10 overflow-hidden'
                              style={{
                                width: `calc(${(item.endColumn - item.startColumn + 1) * 100}% + ${item.endColumn - item.startColumn + 1}px - 10px)`,
                              }}
                            />
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {hiddenEventCount > 0 && (
                    <button
                      type='button'
                      className='relative z-20 my-1 w-[calc(100%-10px)] rounded-sm px-1 py-1 text-left text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
                      aria-label={`${hiddenEventCount} more ${hiddenEventCount === 1 ? 'event' : 'events'} on ${format(day, 'PPP')}`}
                      onClick={() => onSelectDate(day, 'day')}
                    >
                      + {hiddenEventCount}{' '}
                      {hiddenEventCount === 1 ? 'event' : 'events'}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
