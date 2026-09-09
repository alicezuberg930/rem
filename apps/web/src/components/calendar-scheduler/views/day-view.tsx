import { useMemo } from 'react'
import type { CalendarEvent, CalendarViewProps } from '../types'
import { TimeGridView } from './time-grid-view'

export const DayView = <TEvent extends CalendarEvent = CalendarEvent>(
  props: CalendarViewProps<TEvent>
) => {
  const days = useMemo(() => [props.date], [props.date])

  return <TimeGridView {...props} days={days} />
}
