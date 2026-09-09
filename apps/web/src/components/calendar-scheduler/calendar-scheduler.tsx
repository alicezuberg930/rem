import { useEffect, useRef, useState } from 'react'
import {
    addDays,
    addMonths,
    addWeeks,
    format,
    isSameDay,
    isSameMonth,
    isSameYear,
} from 'date-fns'
import { CalendarCheck, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { TooltipProvider } from '@/components/ui/tooltip'
import { CalendarDatePicker } from './calendar-date-picker'
import {
    options,
    type CalendarDateRange,
    type CalendarEvent,
    type CalendarSchedulerProps,
    type DatePickerValue,
    type ResolvedCalendarEvent,
    type View,
} from './types'
import { formatEventRange, getEventRange, getWeekRange } from './utils'
import { DayView } from './views/day-view'
import { ListView } from './views/list-view'
import { MonthView } from './views/month-view'
import { WeekView } from './views/week-view'

export const CalendarScheduler = <
    TEvent extends CalendarEvent = CalendarEvent,
>({
    events = [],
    initialDate = new Date(),
    initialView = 'month',
    className,
    emptyMessage,
    onEventClick,
    renderEventTooltip,
    renderEventDialog,
}: CalendarSchedulerProps<TEvent>) => {
    const [view, setView] = useState<View>(initialView)
    const [selectedDate, setSelectedDate] = useState(initialDate)
    const [selectedEvent, setSelectedEvent] = useState<TEvent | null>(null)
    const [isNarrow, setIsNarrow] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const weekRange = getWeekRange(selectedDate)
    const today = new Date()
    const isTodaySelected =
        view === 'week'
            ? today >= weekRange.from && today <= weekRange.to
            : isSameDay(today, selectedDate)

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const updateSize = (width: number) => {
            const nextIsNarrow = width < 700
            setIsNarrow(nextIsNarrow)
            if (nextIsNarrow) {
                setView((current) => (current === 'list' ? current : 'day'))
            }
        }

        updateSize(container.clientWidth)
        const resizeObserver = new ResizeObserver(([entry]) => {
            updateSize(entry.contentRect.width)
        })
        resizeObserver.observe(container)

        return () => resizeObserver.disconnect()
    }, [])

    const navigate = (amount: -1 | 1) => {
        setSelectedDate((current) => {
            if (view === 'day') return addDays(current, amount)
            if (view === 'week') return addWeeks(current, amount)
            return addMonths(current, amount)
        })
    }

    const handleDateChange = (value: DatePickerValue) => {
        setSelectedDate(value instanceof Date ? value : value.from)
    }

    const handleEventClick = (event: TEvent) => {
        onEventClick?.(event)
        setSelectedEvent(event)
    }

    const handleSelectDate = (date: Date, nextView?: View) => {
        setSelectedDate(date)
        if (nextView) setView(nextView)
    }

    const viewProps = {
        date: selectedDate,
        events,
        view,
        emptyMessage,
        onEventClick: handleEventClick,
        onSelectDate: handleSelectDate,
        renderEventTooltip,
    }
    const selectedEventDetails = selectedEvent
        ? { event: selectedEvent, ...getEventRange(selectedEvent) }
        : null
    const rangeHeading = getRangeHeading(view, selectedDate, weekRange)

    return (
        <TooltipProvider delay={100}>
            <div
                ref={containerRef}
                className={cn('flex min-h-0 flex-col gap-4', className)}
            >
                <div className='flex flex-col gap-3 rounded-md border bg-background p-3 shadow-xs lg:flex-row lg:items-center lg:justify-between'>
                    <div className='flex flex-wrap items-center gap-2'>
                        {!isNarrow && (
                            <Button
                                variant='outline'
                                className={cn(
                                    'gap-2',
                                    isTodaySelected && 'border-primary text-primary'
                                )}
                                onClick={() => setSelectedDate(new Date())}
                            >
                                <CalendarCheck className='size-4' />
                                Today
                            </Button>
                        )}
                        {!isNarrow && view !== 'list' && (
                            <div className='flex items-center gap-1'>
                                <Button
                                    variant='ghost'
                                    size='icon'
                                    aria-label='Previous'
                                    onClick={() => navigate(-1)}
                                >
                                    <ChevronLeft className='size-4' />
                                </Button>
                                <Button
                                    variant='ghost'
                                    size='icon'
                                    aria-label='Next'
                                    onClick={() => navigate(1)}
                                >
                                    <ChevronRight className='size-4' />
                                </Button>
                            </div>
                        )}
                        {view !== 'list' && (
                            <h2 className='max-w-52 truncate text-xl font-medium'>
                                {rangeHeading}
                            </h2>
                        )}
                    </div>
                    <div className='flex flex-wrap items-center gap-2'>
                        <Select
                            value={view}
                            onValueChange={(value) => setView(value as View)}
                        >
                            <SelectTrigger className='w-28'>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent align='start'>
                                {Object.entries(options)
                                    .filter(
                                        ([value]) =>
                                            !isNarrow || value === 'day' || value === 'list'
                                    )
                                    .map(([value, label]) => (
                                        <SelectItem key={value} value={value}>
                                            {label}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                        <div className='w-56'>
                            <CalendarDatePicker
                                mode={view}
                                value={selectedDate}
                                onChange={handleDateChange}
                            />
                        </div>
                    </div>
                </div>

                <div className='min-h-0 flex-1 overflow-auto'>
                    {view === 'day' && <DayView {...viewProps} />}
                    {view === 'week' && <WeekView {...viewProps} />}
                    {view === 'month' && <MonthView {...viewProps} />}
                    {view === 'list' && <ListView {...viewProps} />}
                </div>

                <Dialog
                    open={!!selectedEvent}
                    onOpenChange={(open) => {
                        if (!open) setSelectedEvent(null)
                    }}
                >
                    <DialogContent className='sm:max-w-lg'>
                        {selectedEventDetails ? (
                            renderEventDialog ? (
                                renderEventDialog({
                                    ...selectedEventDetails,
                                    view,
                                })
                            ) : (
                                <DefaultEventDialog {...selectedEventDetails} />
                            )
                        ) : null}
                    </DialogContent>
                </Dialog>
            </div>
        </TooltipProvider>
    )
}

const getRangeHeading = (
    view: View,
    selectedDate: Date,
    weekRange: CalendarDateRange
) => {
    if (view !== 'week') return format(selectedDate, 'MMMM yyyy')

    if (isSameMonth(weekRange.from, weekRange.to)) {
        return format(weekRange.from, 'MMMM yyyy')
    }

    if (isSameYear(weekRange.from, weekRange.to)) {
        return `${format(weekRange.from, 'MMMM')} – ${format(weekRange.to, 'MMMM yyyy')}`
    }

    return `${format(weekRange.from, 'MMMM yyyy')} – ${format(weekRange.to, 'MMMM yyyy')}`
}

const DefaultEventDialog = ({ event, startsAt, endsAt }: ResolvedCalendarEvent) => {
    return (
        <>
            <DialogHeader>
                <DialogTitle>{event.title}</DialogTitle>
                <DialogDescription>
                    {formatEventRange(startsAt, endsAt)}
                </DialogDescription>
            </DialogHeader>
            {event.description && (
                <div className='text-sm text-muted-foreground'>{event.description}</div>
            )}
        </>
    )
}
