import { CalendarEventCard } from '../calendar-event-card'
import type {
  CalendarEvent,
  CalendarEventRenderer,
  SpanningCalendarEvent,
  View,
} from '../types'
import { TIME_AXIS_WIDTH, formatDayKey } from '../utils'

const EVENT_HEIGHT = 24
const EVENT_GAP = 2

type DateGridProps<TEvent extends CalendarEvent> = {
  days: Date[]
  events: SpanningCalendarEvent<TEvent>[]
  view: View
  onEventClick: (event: TEvent) => void
  renderEventTooltip?: CalendarEventRenderer<TEvent>
}

export const DateGrid = <TEvent extends CalendarEvent>({
  days,
  events,
  view,
  onEventClick,
  renderEventTooltip,
}: DateGridProps<TEvent>) => {
  const rowCount = events.reduce(
    (count, event) => Math.max(count, event.lane + 1),
    0
  )
  const eventByPosition = new Map(
    events.map((event) => [`${event.startColumn}:${event.lane}`, event])
  )

  if (rowCount === 0) return null

  return (
    <div
      className='grid'
      aria-label='Multiple day events'
      style={{
        gridTemplateColumns: `${TIME_AXIS_WIDTH}px repeat(${days.length}, minmax(0, 1fr))`,
      }}
    >
      <div className='border-r' />
      {days.map((day, column) => (
        <div
          key={formatDayKey(day)}
          className='grid border-r py-1 last:border-r-0'
          style={{
            gridTemplateRows: `repeat(${rowCount}, ${EVENT_HEIGHT}px)`,
            gap: EVENT_GAP,
          }}
        >
          {Array.from({ length: rowCount }, (_, lane) => {
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
                    presentation='date-grid'
                    showStartBorder={!item.continuesBefore}
                    continuesBefore={item.continuesBefore}
                    continuesAfter={item.continuesAfter}
                    onClick={onEventClick}
                    renderEventTooltip={renderEventTooltip}
                    className='absolute inset-y-0 left-0 z-10 overflow-hidden'
                    style={{
                      width: `calc(${(item.endColumn - item.startColumn + 1) * 100}% - 2px)`,
                    }}
                  />
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
