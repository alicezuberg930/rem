import { useEffect, useMemo, useRef, useState } from 'react'
import {
  differenceInCalendarDays,
  eachDayOfInterval,
  endOfWeek,
  format,
  isAfter,
  isSameDay,
  isValid,
  isWeekend,
  startOfDay,
  startOfWeek,
} from 'date-fns'
import { useQuery } from '@tanstack/react-query'
import {
  TASK_PRIORITY,
  TASK_STATUS,
  type TaskBoardItem,
  type TaskStatus,
} from '@/@types'
import {
  CalendarDays,
  CircleAlert,
  RotateCcw,
  Search,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import { tasks } from '@/lib/queries/task'
import { alpha, cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useTasks } from './tasks-provider'

const EMPTY_TASKS: TaskBoardItem[] = []
const DAY_WIDTHS = [28, 40, 56] as const
const TASK_COLUMN_WIDTH = 224

const TASK_STATUS_COLOR: Record<TaskStatus, string> = {
  IN_PROGRESS: '#2563eb',
  TESTING: '#7c3aed',
  COMPLETED: '#059669',
  PROCESSING: '#0891b2',
  WAITING_FOR_APPROVAL: '#d97706',
  ON_HOLD: '#e11d48',
}

type GanttTask = {
  task: TaskBoardItem
  startsAt: Date | null
  endsAt: Date | null
}

type MonthSegment = {
  key: string
  label: string
  dayCount: number
}

export function TaskGantt() {
  const { setCurrentRow, setOpen } = useTasks()
  const [search, setSearch] = useState('')
  const [zoomIndex, setZoomIndex] = useState(1)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const boardQuery = useQuery(tasks().board.queryOptions())
  const taskItems = boardQuery.data ?? EMPTY_TASKS
  const dayWidth = DAY_WIDTHS[zoomIndex]
  const today = useMemo(() => startOfDay(new Date()), [])

  const ganttTasks = useMemo(
    () => taskItems.map(resolveGanttTask).sort(compareGanttTasks),
    [taskItems]
  )
  const visibleTasks = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()
    if (!normalizedSearch) return ganttTasks

    return ganttTasks.filter(({ task }) =>
      [
        task.title,
        task.assignee?.fullname,
        TASK_STATUS[task.status],
        task.priority ? TASK_PRIORITY[task.priority] : null,
      ]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(normalizedSearch))
    )
  }, [ganttTasks, search])
  const timeline = useMemo(
    () => createTimeline(ganttTasks, today),
    [ganttTasks, today]
  )
  const timelineWidth = timeline.days.length * dayWidth
  const todayIndex = timeline.days.findIndex((day) => isSameDay(day, today))

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container || todayIndex < 0) return

    const availableWidth = container.clientWidth - TASK_COLUMN_WIDTH
    const target = todayIndex * dayWidth - availableWidth / 2 + dayWidth / 2
    container.scrollLeft = Math.max(0, target)
  }, [dayWidth, todayIndex])

  const openTaskDetails = (task: TaskBoardItem) => {
    setCurrentRow(task)
    setOpen('detail')
  }

  if (boardQuery.isLoading) return <TaskGanttSkeleton />

  if (boardQuery.isError) {
    return (
      <div className='flex min-h-64 flex-col items-center justify-center gap-3 rounded-md border border-dashed text-center'>
        <CircleAlert
          className='size-5 text-muted-foreground'
          aria-hidden='true'
        />
        <p className='text-sm text-muted-foreground'>
          Unable to load the task timeline.
        </p>
        <Button variant='outline' onClick={() => boardQuery.refetch()}>
          <RotateCcw aria-hidden='true' />
          Retry
        </Button>
      </div>
    )
  }

  return (
    <TooltipProvider delay={150}>
      <Card className='gap-0 overflow-hidden rounded-md py-0 shadow-none'>
        <div className='flex flex-col gap-3 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between'>
          <div className='min-w-0'>
            <h3 className='font-medium'>Task timeline</h3>
            <p className='truncate text-xs text-muted-foreground'>
              {format(timeline.rangeStart, 'MMM d, yyyy')} -{' '}
              {format(timeline.rangeEnd, 'MMM d, yyyy')}
            </p>
          </div>

          <div className='flex min-w-0 items-center gap-2'>
            <div className='relative min-w-0 flex-1 sm:w-64 sm:flex-none'>
              <Search
                className='pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground'
                aria-hidden='true'
              />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder='Search tasks'
                aria-label='Search tasks'
                className='pl-8'
              />
            </div>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant='outline'
                    size='icon'
                    aria-label='Zoom out'
                    disabled={zoomIndex === 0}
                    onClick={() =>
                      setZoomIndex((current) => Math.max(0, current - 1))
                    }
                  >
                    <ZoomOut aria-hidden='true' />
                  </Button>
                }
              />
              <TooltipContent>Zoom out</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant='outline'
                    size='icon'
                    aria-label='Zoom in'
                    disabled={zoomIndex === DAY_WIDTHS.length - 1}
                    onClick={() =>
                      setZoomIndex((current) =>
                        Math.min(DAY_WIDTHS.length - 1, current + 1)
                      )
                    }
                  >
                    <ZoomIn aria-hidden='true' />
                  </Button>
                }
              />
              <TooltipContent>Zoom in</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {visibleTasks.length ? (
          <div
            ref={scrollContainerRef}
            className='h-[calc(100dvh-18rem)] min-h-[32rem] overflow-auto'
          >
            <div
              role='table'
              aria-label='Task Gantt chart'
              className='min-w-max'
              style={{ width: TASK_COLUMN_WIDTH + timelineWidth }}
            >
              <GanttHeader
                days={timeline.days}
                months={timeline.months}
                dayWidth={dayWidth}
                timelineWidth={timelineWidth}
                taskCount={visibleTasks.length}
                today={today}
              />

              <div role='rowgroup'>
                {visibleTasks.map((item) => (
                  <GanttRow
                    key={item.task.id}
                    item={item}
                    days={timeline.days}
                    rangeStart={timeline.rangeStart}
                    dayWidth={dayWidth}
                    timelineWidth={timelineWidth}
                    today={today}
                    onOpenDetails={() => openTaskDetails(item.task)}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className='flex min-h-64 flex-col items-center justify-center gap-2 px-6 text-center'>
            <CalendarDays
              className='size-5 text-muted-foreground'
              aria-hidden='true'
            />
            <p className='text-sm text-muted-foreground'>
              {search.trim()
                ? 'No tasks match your search.'
                : 'No tasks are available.'}
            </p>
          </div>
        )}
      </Card>
    </TooltipProvider>
  )
}

function GanttHeader({
  days,
  months,
  dayWidth,
  timelineWidth,
  taskCount,
  today,
}: {
  days: Date[]
  months: MonthSegment[]
  dayWidth: number
  timelineWidth: number
  taskCount: number
  today: Date
}) {
  return (
    <div role='rowgroup' className='sticky top-0 z-30 bg-card shadow-xs'>
      <div role='row' className='flex h-9 border-b'>
        <div
          role='columnheader'
          className='sticky left-0 z-40 flex shrink-0 items-center border-r bg-card px-4 text-xs font-medium'
          style={{ width: TASK_COLUMN_WIDTH }}
        >
          Task
        </div>
        <div className='flex' style={{ width: timelineWidth }}>
          {months.map((month) => (
            <div
              key={month.key}
              role='columnheader'
              className='flex shrink-0 items-center border-r px-3 text-xs font-medium last:border-r-0'
              style={{ width: month.dayCount * dayWidth }}
            >
              {month.label}
            </div>
          ))}
        </div>
      </div>

      <div role='row' className='flex h-11 border-b'>
        <div
          role='columnheader'
          className='sticky left-0 z-40 flex shrink-0 items-center border-r bg-card px-4 text-xs text-muted-foreground'
          style={{ width: TASK_COLUMN_WIDTH }}
        >
          {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
        </div>
        <div className='flex' style={{ width: timelineWidth }}>
          {days.map((day) => {
            const isToday = isSameDay(day, today)

            return (
              <div
                key={day.toISOString()}
                role='columnheader'
                aria-label={format(day, 'MMMM d, yyyy')}
                className={cn(
                  'flex shrink-0 flex-col items-center justify-center border-r text-[10px] text-muted-foreground last:border-r-0',
                  isWeekend(day) && 'bg-muted/40',
                  isToday && 'bg-primary/10 text-primary'
                )}
                style={{ width: dayWidth }}
              >
                <span>{format(day, 'EEEEE')}</span>
                <span className='text-xs font-medium text-foreground'>
                  {format(day, 'd')}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function GanttRow({
  item,
  days,
  rangeStart,
  dayWidth,
  timelineWidth,
  today,
  onOpenDetails,
}: {
  item: GanttTask
  days: Date[]
  rangeStart: Date
  dayWidth: number
  timelineWidth: number
  today: Date
  onOpenDetails: () => void
}) {
  const { task, startsAt, endsAt } = item
  const color = TASK_STATUS_COLOR[task.status]
  const assignee = task.assignee?.fullname?.trim() || 'Unassigned'
  const title = task.title?.trim() || 'Untitled task'
  const startOffset = startsAt
    ? differenceInCalendarDays(startsAt, rangeStart)
    : 0
  const duration =
    startsAt && endsAt ? differenceInCalendarDays(endsAt, startsAt) + 1 : 0

  return (
    <div role='row' className='group/row flex h-16 border-b last:border-b-0'>
      <div
        role='cell'
        className='sticky left-0 z-20 shrink-0 border-r bg-card transition-colors group-hover/row:bg-muted/40'
        style={{ width: TASK_COLUMN_WIDTH }}
      >
        <button
          type='button'
          className='flex size-full min-w-0 flex-col justify-center gap-1 px-4 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset'
          onClick={onOpenDetails}
        >
          <span className='truncate text-sm font-medium'>{title}</span>
          <span className='flex min-w-0 items-center gap-2'>
            <Badge variant='outline' className='max-w-36 font-normal'>
              <span className='truncate'>{TASK_STATUS[task.status]}</span>
            </Badge>
            <span className='min-w-0 truncate text-xs text-muted-foreground'>
              {task.priority ? TASK_PRIORITY[task.priority] : 'No priority'} -{' '}
              {assignee}
            </span>
          </span>
        </button>
      </div>

      <div
        role='cell'
        className='relative shrink-0'
        style={{ width: timelineWidth }}
      >
        <div className='pointer-events-none absolute inset-0 flex'>
          {days.map((day) => (
            <span
              key={day.toISOString()}
              className={cn(
                'h-full shrink-0 border-r last:border-r-0',
                isWeekend(day) && 'bg-muted/30',
                isSameDay(day, today) && 'bg-primary/5'
              )}
              style={{ width: dayWidth }}
            />
          ))}
        </div>

        {startsAt && endsAt ? (
          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  type='button'
                  aria-label={`${title}, ${formatTaskRange(startsAt, endsAt)}`}
                  className='absolute top-1/2 z-10 flex h-9 -translate-y-1/2 items-center overflow-hidden rounded-md border border-l-4 px-2 text-left text-xs shadow-xs transition outline-none hover:brightness-95 focus-visible:ring-2 focus-visible:ring-ring/50'
                  style={{
                    left: startOffset * dayWidth + 4,
                    width: Math.max(duration * dayWidth - 8, 16),
                    backgroundColor: alpha(color, 0.16),
                    borderColor: alpha(color, 0.35),
                    borderLeftColor: color,
                  }}
                  onClick={onOpenDetails}
                >
                  <span className='truncate font-medium'>{title}</span>
                </button>
              }
            />
            <TooltipContent align='start' className='block space-y-1.5'>
              <p className='font-medium'>{title}</p>
              <p className='text-background/75'>
                {formatTaskRange(startsAt, endsAt)}
              </p>
              <p className='text-background/75'>
                {TASK_STATUS[task.status]} - {assignee}
              </p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <Badge
            variant='outline'
            className='absolute top-1/2 left-3 -translate-y-1/2 font-normal text-muted-foreground'
          >
            No dates
          </Badge>
        )}
      </div>
    </div>
  )
}

function resolveGanttTask(task: TaskBoardItem): GanttTask {
  const startDate = toValidDay(task.startDate)
  const dueDate = toValidDay(task.dueDate)

  if (startDate && dueDate && isAfter(startDate, dueDate)) {
    return { task, startsAt: dueDate, endsAt: startDate }
  }

  return {
    task,
    startsAt: startDate ?? dueDate,
    endsAt: dueDate ?? startDate,
  }
}

function compareGanttTasks(left: GanttTask, right: GanttTask) {
  if (!left.startsAt && !right.startsAt) {
    return getTaskTitle(left.task).localeCompare(getTaskTitle(right.task))
  }
  if (!left.startsAt) return 1
  if (!right.startsAt) return -1

  return (
    left.startsAt.getTime() - right.startsAt.getTime() ||
    getTaskTitle(left.task).localeCompare(getTaskTitle(right.task))
  )
}

function createTimeline(items: GanttTask[], today: Date) {
  const dates = items.flatMap(({ startsAt, endsAt }) =>
    [startsAt, endsAt].filter((date): date is Date => date !== null)
  )
  const earliest = dates.reduce(
    (current, date) => (date < current ? date : current),
    dates[0] ?? today
  )
  const latest = dates.reduce(
    (current, date) => (date > current ? date : current),
    dates[0] ?? today
  )
  const rangeStart = startOfWeek(earliest, { weekStartsOn: 1 })
  const rangeEnd = endOfWeek(latest, { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start: rangeStart, end: rangeEnd })

  return {
    rangeStart,
    rangeEnd,
    days,
    months: groupMonths(days),
  }
}

function groupMonths(days: Date[]): MonthSegment[] {
  return days.reduce<MonthSegment[]>((segments, day) => {
    const key = format(day, 'yyyy-MM')
    const current = segments[segments.length - 1]

    if (current?.key === key) {
      current.dayCount++
      return segments
    }

    segments.push({
      key,
      label: format(day, 'MMMM yyyy'),
      dayCount: 1,
    })
    return segments
  }, [])
}

function toValidDay(value: string | null) {
  if (!value) return null

  const date = startOfDay(new Date(value))
  return isValid(date) ? date : null
}

function getTaskTitle(task: TaskBoardItem) {
  return task.title?.trim() || 'Untitled task'
}

function formatTaskRange(startsAt: Date, endsAt: Date) {
  const startsOn = format(startsAt, 'MMM d, yyyy')
  const endsOn = format(endsAt, 'MMM d, yyyy')

  return startsOn === endsOn ? endsOn : `${startsOn} - ${endsOn}`
}

function TaskGanttSkeleton() {
  return (
    <div
      className='overflow-hidden rounded-md border'
      aria-label='Loading task timeline'
    >
      <div className='flex items-center justify-between border-b p-4'>
        <div className='space-y-2'>
          <Skeleton className='h-4 w-28' />
          <Skeleton className='h-3 w-44' />
        </div>
        <Skeleton className='h-9 w-64' />
      </div>
      <div className='flex h-20 border-b'>
        <Skeleton className='h-full w-56 rounded-none' />
        <Skeleton className='h-full flex-1 rounded-none' />
      </div>
      {Array.from({ length: 7 }, (_, index) => (
        <div key={index} className='flex h-16 border-b last:border-b-0'>
          <div className='w-56 space-y-2 border-r px-4 py-3'>
            <Skeleton className='h-4 w-40' />
            <Skeleton className='h-5 w-28' />
          </div>
          <div className='flex flex-1 items-center px-4'>
            <Skeleton className='h-9 w-1/3' />
          </div>
        </div>
      ))}
    </div>
  )
}
