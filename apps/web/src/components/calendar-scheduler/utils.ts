import {
  addDays,
  differenceInCalendarDays,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import type {
  CalendarDateRange,
  CalendarEvent,
  IndexedCalendarEvent,
  SpanningCalendarEvent,
  TimedCalendarEvent,
} from './types'

export const DAY_HEIGHT = 1600
export const HOUR_HEIGHT = DAY_HEIGHT / 24
export const TIME_AXIS_WIDTH = 75
const HOUR_FORMATTER = new Intl.DateTimeFormat('en-US', { hour: 'numeric' })
const TIME_FORMATTER = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: 'numeric',
})
export const TIME_SLOTS = Array.from({ length: 24 }, (_, hour) =>
  HOUR_FORMATTER.format(new Date(2000, 0, 1, hour))
)

const toDate = (value: Date | string) => {
  return value instanceof Date ? value : new Date(value)
}

export const getEventRange = (event: CalendarEvent) => {
  const startsAt = toDate(event.start)
  const endsAt = toDate(event.end)

  return { startsAt, endsAt }
}

export const resolveCalendarEvents = <TEvent extends CalendarEvent>(
  events: TEvent[]
): IndexedCalendarEvent<TEvent>[] => {
  return events.map((event, inputIndex) => ({
    event,
    inputIndex,
    ...getEventRange(event),
  }))
}

export const getWeekRange = (date: Date): CalendarDateRange => {
  return {
    from: startOfWeek(date, { weekStartsOn: 1 }),
    to: endOfWeek(date, { weekStartsOn: 1 }),
  }
}

export const getWeekDays = (date: Date) => {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 })
  return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index))
}

export const getMonthWeeks = (date: Date) => {
  const monthStart = startOfMonth(date)
  const monthEnd = endOfMonth(date)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
  const weeks: Date[][] = []
  let current = calendarStart

  while (!isAfter(current, calendarEnd)) {
    weeks.push(Array.from({ length: 7 }, (_, index) => addDays(current, index)))
    current = addDays(current, 7)
  }

  return weeks
}

export const getMonthEventLayout = <TEvent extends CalendarEvent>(
  events: TEvent[],
  week: Date[]
): SpanningCalendarEvent<TEvent>[] => {
  return positionSpanningEvents(events, week, sortMonthEvents)
}

export const getDateGridEventLayout = <TEvent extends CalendarEvent>(
  events: TEvent[],
  days: Date[]
): SpanningCalendarEvent<TEvent>[] => {
  return positionSpanningEvents(events, days, sortTimedEvents, true)
}

const positionSpanningEvents = <TEvent extends CalendarEvent>(
  events: TEvent[],
  days: Date[],
  compare: (
    a: IndexedCalendarEvent<TEvent>,
    b: IndexedCalendarEvent<TEvent>
  ) => number,
  multiDayOnly = false
) => {
  const rangeStart = startOfDay(days[0])
  const rangeEnd = startOfDay(days[days.length - 1])
  const occupiedColumns: boolean[][] = []
  const visibleEvents = resolveCalendarEvents(events)
    .filter(
      ({ startsAt, endsAt }) =>
        (!multiDayOnly || formatDayKey(startsAt) !== formatDayKey(endsAt)) &&
        !isAfter(startOfDay(startsAt), rangeEnd) &&
        !isBefore(startOfDay(endsAt), rangeStart)
    )
    .sort((a, b) => compare(a, b) || a.inputIndex - b.inputIndex)
    .map(({ event, startsAt, endsAt }) => {
      const eventStart = startOfDay(startsAt)
      const eventEnd = startOfDay(endsAt)
      const visibleStart = isBefore(eventStart, rangeStart)
        ? rangeStart
        : eventStart
      const visibleEnd = isAfter(eventEnd, rangeEnd) ? rangeEnd : eventEnd

      return {
        event,
        startsAt,
        endsAt,
        startColumn: differenceInCalendarDays(visibleStart, rangeStart),
        endColumn: differenceInCalendarDays(visibleEnd, rangeStart),
        continuesBefore: isBefore(eventStart, rangeStart),
        continuesAfter: isAfter(eventEnd, rangeEnd),
      }
    })

  return visibleEvents.map((event) => {
    let lane = occupiedColumns.findIndex((columns) => {
      for (
        let column = event.startColumn;
        column <= event.endColumn;
        column++
      ) {
        if (columns[column]) return false
      }

      return true
    })

    if (lane === -1) {
      lane = occupiedColumns.length
      occupiedColumns.push(Array.from({ length: days.length }, () => false))
    }

    for (let column = event.startColumn; column <= event.endColumn; column++) {
      occupiedColumns[lane][column] = true
    }

    return { ...event, lane }
  })
}

const sortTimedEvents = <TEvent extends CalendarEvent>(
  a: IndexedCalendarEvent<TEvent>,
  b: IndexedCalendarEvent<TEvent>
) => {
  return (
    a.startsAt.getTime() - b.startsAt.getTime() ||
    b.endsAt.getTime() - a.endsAt.getTime()
  )
}

const sortMonthEvents = <TEvent extends CalendarEvent>(
  a: IndexedCalendarEvent<TEvent>,
  b: IndexedCalendarEvent<TEvent>
) => {
  const startDateDifference = differenceInCalendarDays(
    startOfDay(a.startsAt),
    startOfDay(b.startsAt)
  )

  if (startDateDifference !== 0) return startDateDifference

  const endDateDifference = differenceInCalendarDays(
    startOfDay(a.endsAt),
    startOfDay(b.endsAt)
  )

  if (endDateDifference !== 0) return -endDateDifference

  return a.startsAt.getTime() - b.startsAt.getTime()
}

export const getTimedEventLayout = <TEvent extends CalendarEvent>(
  events: TEvent[],
  day: Date
): TimedCalendarEvent<TEvent>[] => {
  const dayKey = formatDayKey(day)
  const positionedEvents = resolveCalendarEvents(events)
    .filter(({ startsAt, endsAt }) => {
      const startDayKey = formatDayKey(startsAt)
      return startDayKey === formatDayKey(endsAt) && startDayKey === dayKey
    })
    .sort((a, b) => sortTimedEvents(a, b) || a.inputIndex - b.inputIndex)
    .map(({ event, startsAt, endsAt }) => ({
      event,
      startsAt,
      endsAt,
      top: getMinutesFromDayStart(startsAt) * (HOUR_HEIGHT / 60),
      height:
        startsAt.getTime() === endsAt.getTime()
          ? HOUR_HEIGHT / 2
          : ((endsAt.getTime() - startsAt.getTime()) / 60000) *
            (HOUR_HEIGHT / 60),
      column: 0,
      columnCount: 1,
    }))

  for (let batchStart = 0; batchStart < positionedEvents.length; ) {
    let batchEnd = batchStart + 1
    let latestEnd = positionedEvents[batchStart].endsAt.getTime()

    while (
      batchEnd < positionedEvents.length &&
      (positionedEvents[batchEnd].startsAt.getTime() < latestEnd ||
        areZeroDurationEventsConcurrent(
          positionedEvents[batchEnd - 1],
          positionedEvents[batchEnd]
        ))
    ) {
      latestEnd = Math.max(
        latestEnd,
        positionedEvents[batchEnd].endsAt.getTime()
      )
      batchEnd++
    }

    let columnCount = 1
    for (let index = batchStart; index < batchEnd; index++) {
      const current = positionedEvents[index]
      const occupied = new Set<number>()

      for (
        let previousIndex = batchStart;
        previousIndex < index;
        previousIndex++
      ) {
        const previous = positionedEvents[previousIndex]
        if (
          previous.endsAt.getTime() > current.startsAt.getTime() ||
          areZeroDurationEventsConcurrent(previous, current)
        ) {
          occupied.add(previous.column)
        }
      }

      while (occupied.has(current.column)) current.column++
      columnCount = Math.max(columnCount, current.column + 1)
    }

    for (let index = batchStart; index < batchEnd; index++) {
      positionedEvents[index].columnCount = columnCount
    }

    batchStart = batchEnd
  }

  return positionedEvents
}

const areZeroDurationEventsConcurrent = (
  first: Pick<TimedCalendarEvent, 'startsAt' | 'endsAt'>,
  second: Pick<TimedCalendarEvent, 'startsAt' | 'endsAt'>
) => {
  const firstStart = first.startsAt.getTime()
  const secondStart = second.startsAt.getTime()

  return (
    firstStart === first.endsAt.getTime() &&
    secondStart === second.endsAt.getTime() &&
    firstStart === secondStart
  )
}

const getMinutesFromDayStart = (date: Date) => {
  return date.getHours() * 60 + date.getMinutes()
}

export const formatDayKey = (date: Date) => {
  return format(date, 'yyyy-MM-dd')
}

export const formatDateLabel = (date: Date) => {
  return format(date, 'dd/MM/yyyy')
}

export const formatTimeLabel = (date: Date) => {
  return TIME_FORMATTER.format(date)
}

export const formatEventRange = (startsAt: Date, endsAt: Date) => {
  if (startsAt.getTime() === endsAt.getTime()) {
    return `${formatDateLabel(startsAt)} ${formatTimeLabel(startsAt)}`
  }

  if (formatDayKey(startsAt) === formatDayKey(endsAt)) {
    return `${formatDateLabel(startsAt)} ${formatTimeLabel(startsAt)} - ${formatTimeLabel(endsAt)}`
  }

  return `${formatDateLabel(startsAt)} ${formatTimeLabel(startsAt)} - ${formatDateLabel(endsAt)} ${formatTimeLabel(endsAt)}`
}
