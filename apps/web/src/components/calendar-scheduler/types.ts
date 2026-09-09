import type { ReactNode } from 'react'

export type View = 'day' | 'week' | 'month' | 'list'

export type CalendarDateRange = {
  from: Date
  to: Date
}

export type DatePickerValue = Date | CalendarDateRange

export type CalendarEvent<TData = unknown> = {
  id: string
  title: string
  start: Date | string
  end: Date | string
  color?: string
  description?: ReactNode
  data?: TData
}

export type ResolvedCalendarEvent<
  TEvent extends CalendarEvent = CalendarEvent,
> = {
  event: TEvent
  startsAt: Date
  endsAt: Date
}

export type IndexedCalendarEvent<TEvent extends CalendarEvent = CalendarEvent> =
  ResolvedCalendarEvent<TEvent> & {
    inputIndex: number
  }

export type TimedCalendarEvent<TEvent extends CalendarEvent = CalendarEvent> =
  ResolvedCalendarEvent<TEvent> & {
    top: number
    height: number
    column: number
    columnCount: number
  }

export type SpanningCalendarEvent<
  TEvent extends CalendarEvent = CalendarEvent,
> = ResolvedCalendarEvent<TEvent> & {
  startColumn: number
  endColumn: number
  lane: number
  continuesBefore: boolean
  continuesAfter: boolean
}

export type CalendarEventRenderProps<
  TEvent extends CalendarEvent = CalendarEvent,
> = ResolvedCalendarEvent<TEvent> & {
  view: View
}

export type CalendarEventRenderer<
  TEvent extends CalendarEvent = CalendarEvent,
> = (props: CalendarEventRenderProps<TEvent>) => ReactNode

export type CalendarSchedulerProps<
  TEvent extends CalendarEvent = CalendarEvent,
> = {
  events?: TEvent[]
  initialDate?: Date
  initialView?: View
  className?: string
  emptyMessage?: string
  onEventClick?: (event: TEvent) => void
  renderEventTooltip?: CalendarEventRenderer<TEvent>
  renderEventDialog?: CalendarEventRenderer<TEvent>
}

export type CalendarViewProps<TEvent extends CalendarEvent = CalendarEvent> = {
  date: Date
  events: TEvent[]
  view: View
  emptyMessage?: string
  onEventClick: (event: TEvent) => void
  onSelectDate: (date: Date, view?: View) => void
  renderEventTooltip?: CalendarEventRenderer<TEvent>
}

export const options: Record<View, string> = {
  day: 'Day',
  week: 'Week',
  month: 'Month',
  list: 'List',
}

export type CalendarContextType = {
  reloadKey: Record<View, number>
  triggerReload: (view: View) => void
}
