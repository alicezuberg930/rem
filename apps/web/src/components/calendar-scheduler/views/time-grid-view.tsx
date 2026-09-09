import { useMemo } from 'react'
import { format, isToday } from 'date-fns'
import { cn } from '@/lib/utils'
import { CalendarEventCard } from '../calendar-event-card'
import type { CalendarEvent, CalendarViewProps } from '../types'
import {
  DAY_HEIGHT,
  HOUR_HEIGHT,
  TIME_AXIS_WIDTH,
  TIME_SLOTS,
  formatDayKey,
  getDateGridEventLayout,
  getTimedEventLayout,
} from '../utils'
import { DateGrid } from './date-grid'

type TimeGridViewProps<TEvent extends CalendarEvent> =
  CalendarViewProps<TEvent> & {
    days: Date[]
  }

export const TimeGridView = <TEvent extends CalendarEvent>({
  days,
  events,
  view,
  emptyMessage = 'No bookings scheduled.',
  onEventClick,
  renderEventTooltip,
}: TimeGridViewProps<TEvent>) => {
  const dateGridEvents = useMemo(
    () => getDateGridEventLayout(events, days),
    [days, events]
  )
  const timedEventLayouts = useMemo(
    () => days.map((day) => getTimedEventLayout(events, day)),
    [days, events]
  )
  const eventCount =
    dateGridEvents.length +
    timedEventLayouts.reduce((count, dayEvents) => count + dayEvents.length, 0)
  const gridTemplateColumns = `${TIME_AXIS_WIDTH}px repeat(${days.length}, minmax(0, 1fr))`

  return (
    <div
      className={cn(
        'relative rounded-md border bg-background',
        days.length > 1 && 'min-w-[700px]'
      )}
    >
      <div className='sticky top-0 z-30 border-b bg-background'>
        <div className='grid' style={{ gridTemplateColumns }}>
          <div className='border-r' />
          {days.map((day) => (
            <div
              key={formatDayKey(day)}
              className={cn(
                'flex flex-col items-center gap-1 border-r py-3 last:border-r-0',
                isToday(day) && 'text-primary'
              )}
            >
              <span className='text-xs font-medium text-muted-foreground uppercase'>
                {format(day, 'EEE')}
              </span>
              <span
                className={cn(
                  'flex size-8 items-center justify-center text-lg font-medium',
                  isToday(day) &&
                    'rounded-full bg-primary text-primary-foreground'
                )}
              >
                {format(day, 'd')}
              </span>
            </div>
          ))}
        </div>
        <DateGrid
          days={days}
          events={dateGridEvents}
          view={view}
          onEventClick={onEventClick}
          renderEventTooltip={renderEventTooltip}
        />
      </div>

      <div
        className='grid overflow-hidden rounded-b-md'
        style={{ gridTemplateColumns }}
      >
        <TimeAxis />
        {days.map((day, dayIndex) => (
          <div
            key={formatDayKey(day)}
            className='relative border-r last:border-r-0'
            style={{ height: DAY_HEIGHT }}
          >
            <DayLines />
            {timedEventLayouts[dayIndex].map((item) => {
              const left = (item.column / item.columnCount) * 100

              return (
                <CalendarEventCard
                  key={item.event.id}
                  event={item.event}
                  view={view}
                  startsAt={item.startsAt}
                  endsAt={item.endsAt}
                  compact={item.height < 36}
                  presentation='time-grid'
                  onClick={onEventClick}
                  renderEventTooltip={renderEventTooltip}
                  className='absolute overflow-hidden'
                  style={{
                    top: item.top,
                    left: `${left}%`,
                    width: `${100 - left}%`,
                    height: item.height,
                    zIndex: item.column,
                  }}
                />
              )
            })}
          </div>
        ))}
      </div>

      {eventCount === 0 && (
        <div className='border-t px-4 py-3 text-sm text-muted-foreground'>
          {emptyMessage}
        </div>
      )}
    </div>
  )
}

const TimeAxis = () => {
  return (
    <div className='relative border-r' style={{ height: DAY_HEIGHT }}>
      {TIME_SLOTS.map((time, index) => (
        <div
          key={time}
          className={cn(
            'absolute right-0 left-0',
            index > 0 && 'border-t border-border'
          )}
          style={{ top: index * HOUR_HEIGHT }}
        >
          {index > 0 && (
            <div className='-translate-y-2 pr-3 text-right text-[11px] text-muted-foreground'>
              {time}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

const DayLines = () => {
  return TIME_SLOTS.slice(1).map((time, index) => (
    <div
      key={time}
      className='absolute right-0 left-0 border-t border-border'
      style={{ top: (index + 1) * HOUR_HEIGHT }}
    />
  ))
}
