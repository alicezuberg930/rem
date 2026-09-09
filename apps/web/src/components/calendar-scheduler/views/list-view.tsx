import { useEffect, useMemo, useRef } from 'react'
import { addDays, format, startOfDay } from 'date-fns'
import { cn } from '@/lib/utils'
import { CalendarEventTooltip } from '../calendar-event-tooltip'
import type {
  CalendarEvent,
  CalendarEventRenderer,
  CalendarViewProps,
  IndexedCalendarEvent,
  View,
} from '../types'
import { formatDayKey, formatTimeLabel, resolveCalendarEvents } from '../utils'

type ListDay<TEvent extends CalendarEvent> = {
  date: Date
  dateKey: string
  events: IndexedCalendarEvent<TEvent>[]
}

export const ListView = <TEvent extends CalendarEvent = CalendarEvent>({
  date,
  events,
  view,
  emptyMessage = 'No bookings scheduled.',
  onEventClick,
  renderEventTooltip,
}: CalendarViewProps<TEvent>) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const days = useMemo(() => getListDays(events), [events])
  const selectedDateKey = formatDayKey(date)

  useEffect(() => {
    wrapperRef.current
      ?.querySelector<HTMLElement>(`[data-date="${selectedDateKey}"]`)
      ?.scrollIntoView({ behavior: 'auto', block: 'start' })
  }, [days, selectedDateKey])

  if (days.length === 0) {
    return (
      <div className='flex min-h-64 items-center justify-center rounded-md border bg-background px-4 text-center text-xs text-muted-foreground'>
        {emptyMessage}
      </div>
    )
  }

  return (
    <div
      ref={wrapperRef}
      className='relative min-h-64 rounded-md border bg-background'
      aria-label='Calendar events'
    >
      {days.map((day) => (
        <section key={day.dateKey} data-date={day.dateKey}>
          <div className='sticky top-0 z-10 bg-muted px-4 py-2'>
            <h3 className='text-xs font-semibold tracking-[0.5px] text-muted-foreground uppercase'>
              {format(day.date, 'EEEE, MMMM d, yyyy')}
            </h3>
          </div>
          <div className='px-4'>
            {day.events.map((item, index) => (
              <ListEventRow
                key={`${item.event.id}:${item.inputIndex}`}
                item={item}
                dateKey={day.dateKey}
                view={view}
                showDivider={index > 0}
                onEventClick={onEventClick}
                renderEventTooltip={renderEventTooltip}
              />
            ))}
          </div>
          <div className='h-4' />
        </section>
      ))}
    </div>
  )
}

const ListEventRow = <TEvent extends CalendarEvent>({
  item,
  dateKey,
  view,
  showDivider,
  onEventClick,
  renderEventTooltip,
}: {
  item: IndexedCalendarEvent<TEvent>
  dateKey: string
  view: View
  showDivider: boolean
  onEventClick: (event: TEvent) => void
  renderEventTooltip?: CalendarEventRenderer<TEvent>
}) => {
  const { event, startsAt, endsAt } = item

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
            'flex w-full items-start gap-3 py-3 text-left transition-colors outline-none hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring/50',
            showDivider && 'border-t'
          )}
          onClick={() => onEventClick(event)}
        >
          <span
            className='h-6 w-[3px] shrink-0 rounded-sm'
            style={{ backgroundColor: event.color ?? '#2563eb' }}
          />
          <span className='flex min-w-0 flex-1 items-start justify-between gap-4'>
            <span className='min-w-0 flex-1 wrap-break-word text-foreground'>
              {event.title}
            </span>
            <EventTimes dateKey={dateKey} startsAt={startsAt} endsAt={endsAt} />
          </span>
        </button>
      }
    />
  )
}

const EventTimes = ({
  dateKey,
  startsAt,
  endsAt,
}: {
  dateKey: string
  startsAt: Date
  endsAt: Date
}) => {
  const startDateKey = formatDayKey(startsAt)
  const endDateKey = formatDayKey(endsAt)
  const content =
    startDateKey === endDateKey ? (
      <>
        <span>{formatTimeLabel(startsAt)}</span>
        <span className='text-muted-foreground'>{formatTimeLabel(endsAt)}</span>
      </>
    ) : dateKey === startDateKey ? (
      <>
        <span>{formatTimeLabel(startsAt)}</span>
        <span className='leading-none text-muted-foreground'>&rarr;</span>
      </>
    ) : dateKey === endDateKey ? (
      <>
        <span className='leading-none text-muted-foreground'>&larr;</span>
        <span className='text-muted-foreground'>{formatTimeLabel(endsAt)}</span>
      </>
    ) : (
      <span className='leading-none text-muted-foreground'>&harr;</span>
    )

  return (
    <span className='flex min-w-20 shrink-0 flex-col items-end gap-0.5 text-[0.85em]'>
      {content}
    </span>
  )
}

const getListDays = <TEvent extends CalendarEvent>(events: TEvent[]) => {
  const days = new Map<string, ListDay<TEvent>>()

  resolveCalendarEvents(events).forEach((listEvent) => {
    const { startsAt, endsAt } = listEvent
    const lastDay = startOfDay(endsAt)

    for (
      let currentDay = startOfDay(startsAt);
      currentDay.getTime() <= lastDay.getTime();
      currentDay = addDays(currentDay, 1)
    ) {
      const dateKey = formatDayKey(currentDay)
      const day = days.get(dateKey)

      if (day) {
        day.events.push(listEvent)
      } else {
        days.set(dateKey, {
          date: currentDay,
          dateKey,
          events: [listEvent],
        })
      }
    }
  })

  return [...days.values()]
    .sort((first, second) => first.date.getTime() - second.date.getTime())
    .map((day) => ({
      ...day,
      events: day.events.sort(
        (first, second) =>
          first.startsAt.getTime() - second.startsAt.getTime() ||
          first.inputIndex - second.inputIndex
      ),
    }))
}
