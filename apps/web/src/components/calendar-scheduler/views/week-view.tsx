import { useMemo } from 'react'
import type { CalendarEvent, CalendarViewProps } from '../types'
import { getWeekDays } from '../utils'
import { TimeGridView } from './time-grid-view'

export const WeekView = <TEvent extends CalendarEvent = CalendarEvent>(
  props: CalendarViewProps<TEvent>
) => {
  const days = useMemo(() => getWeekDays(props.date), [props.date])

  return <TimeGridView {...props} days={days} />
}
