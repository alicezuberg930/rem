import { useMemo, useState } from 'react'
import { format } from 'date-fns'
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
  UserRound,
} from 'lucide-react'
import { tasks } from '@/lib/queries/task'
import { getInitials } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import {
  CalendarScheduler,
  type CalendarEvent,
  type CalendarEventRenderProps,
} from '@/components/calendar-scheduler'
import { useTasks } from './tasks-provider'

const EMPTY_TASKS: TaskBoardItem[] = []

const TASK_STATUS_COLOR: Record<TaskStatus, string> = {
  IN_PROGRESS: '#2563eb',
  TESTING: '#7c3aed',
  COMPLETED: '#059669',
  PROCESSING: '#0891b2',
  WAITING_FOR_APPROVAL: '#d97706',
  ON_HOLD: '#e11d48',
}

type TaskCalendarEvent = CalendarEvent<TaskBoardItem>

const mapToCalendarEvents = (taskItems: TaskBoardItem[]): TaskCalendarEvent[] => taskItems.flatMap((task) => {
  if (!task.dueDate) return []

  return [
    {
      id: task.id,
      title: task.title?.trim() || 'Untitled task',
      start: task.startDate ?? task.dueDate,
      end: task.dueDate,
      color: TASK_STATUS_COLOR[task.status],
      data: task,
    },
  ]
})

export function TaskCalendar() {
  const { setCurrentRow, setOpen } = useTasks()
  const [search, setSearch] = useState('')
  const boardQuery = useQuery(tasks().board.queryOptions())
  const taskItems = boardQuery.data ?? EMPTY_TASKS
  const calendarEvents = useMemo(
    () => mapToCalendarEvents(taskItems),
    [taskItems]
  )
  const unscheduledTasks = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase()

    return taskItems.filter((task) => {
      if (task.dueDate) return false
      if (!normalizedSearch) return true

      return [task.title, task.assignee?.fullname]
        .filter(Boolean)
        .some((value) => value?.toLocaleLowerCase().includes(normalizedSearch))
    })
  }, [search, taskItems])
  const initialEventStart = calendarEvents[0]?.start
  const initialDate = initialEventStart ? initialEventStart instanceof Date ? initialEventStart : new Date(initialEventStart) : new Date()

  const openTaskDetails = (task: TaskBoardItem) => {
    setCurrentRow(task)
    setOpen('detail')
  }

  if (boardQuery.isLoading) return <TaskCalendarSkeleton />

  if (boardQuery.isError) {
    return (
      <div className='flex min-h-64 flex-col items-center justify-center gap-3 rounded-md border border-dashed text-center'>
        <CircleAlert
          className='size-5 text-muted-foreground'
          aria-hidden='true'
        />
        <p className='text-sm text-muted-foreground'>
          Unable to load the task calendar.
        </p>
        <Button variant='outline' onClick={() => boardQuery.refetch()}>
          <RotateCcw aria-hidden='true' />
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className='grid min-h-0 gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]'>
      <CalendarScheduler
        events={calendarEvents}
        initialDate={initialDate}
        initialView='month'
        className='h-[calc(100dvh-15rem)] min-h-[36rem] min-w-0'
        emptyMessage='No tasks with a due date.'
        renderEventTooltip={TaskEventTooltip}
        renderEventDialog={TaskEventDialog}
      />

      <Card className='h-[calc(100dvh-15rem)] min-h-[36rem] gap-0 overflow-hidden rounded-md py-0 shadow-none'>
        <CardHeader className='gap-3 border-b py-4'>
          <div className='flex items-center justify-between gap-3'>
            <CardTitle>Unscheduled work</CardTitle>
            <Badge variant='secondary'>{unscheduledTasks.length}</Badge>
          </div>
          <p className='text-sm text-muted-foreground'>
            Tasks without a due date
          </p>
          <div className='relative'>
            <Search
              className='pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground'
              aria-hidden='true'
            />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder='Search unscheduled tasks'
              aria-label='Search unscheduled tasks'
              className='pl-8'
            />
          </div>
        </CardHeader>

        <CardContent className='min-h-0 flex-1 p-0'>
          <ScrollArea className='h-full'>
            {unscheduledTasks.length ? (
              <div className='divide-y'>
                {unscheduledTasks.map((task) => (
                  <UnscheduledTaskRow
                    key={task.id}
                    task={task}
                    onClick={() => openTaskDetails(task)}
                  />
                ))}
              </div>
            ) : (
              <div className='flex min-h-48 flex-col items-center justify-center gap-2 px-6 text-center'>
                <CalendarDays
                  className='size-5 text-muted-foreground'
                  aria-hidden='true'
                />
                <p className='text-sm text-muted-foreground'>
                  {search.trim()
                    ? 'No unscheduled tasks match your search.'
                    : 'All tasks have a due date.'}
                </p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

function UnscheduledTaskRow({
  task,
  onClick,
}: {
  task: TaskBoardItem
  onClick: () => void
}) {
  const assigneeName = task.assignee?.fullname?.trim() || 'Unassigned'

  return (
    <button
      type='button'
      className='w-full border-l-4 px-4 py-3 text-left transition-colors outline-none hover:bg-muted/50 focus-visible:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset'
      style={{ borderLeftColor: TASK_STATUS_COLOR[task.status] }}
      onClick={onClick}
    >
      <span className='line-clamp-2 text-sm font-medium'>
        {task.title?.trim() || 'Untitled task'}
      </span>
      <span className='mt-2 flex min-w-0 items-center gap-2'>
        <Badge variant='outline' className='max-w-36 font-normal'>
          <span className='truncate'>{TASK_STATUS[task.status]}</span>
        </Badge>
        <Badge variant='secondary' className='font-normal'>
          {task.priority ? TASK_PRIORITY[task.priority] : 'No priority'}
        </Badge>
      </span>
      <span className='mt-2 flex min-w-0 items-center gap-2 text-xs text-muted-foreground'>
        {task.assignee ? (
          <Avatar size='sm'>
            {task.assignee.avatar && (
              <AvatarImage src={task.assignee.avatar} alt={assigneeName} />
            )}
            <AvatarFallback>{getInitials(assigneeName)}</AvatarFallback>
          </Avatar>
        ) : (
          <span className='flex size-6 shrink-0 items-center justify-center rounded-full bg-muted'>
            <UserRound className='size-3.5' aria-hidden='true' />
          </span>
        )}
        <span className='truncate'>{assigneeName}</span>
      </span>
    </button>
  )
}

function TaskEventTooltip({
  event,
  startsAt,
  endsAt,
}: CalendarEventRenderProps<TaskCalendarEvent>) {
  const task = event.data

  return (
    <div className='space-y-1.5'>
      <p className='font-medium'>{event.title}</p>
      <p className='text-muted-foreground'>
        {formatTaskRange(startsAt, endsAt)}
      </p>
      {task && (
        <div className='flex items-center gap-2'>
          <Badge variant='outline'>{TASK_STATUS[task.status]}</Badge>
          <span className='text-xs text-muted-foreground'>
            {task.assignee?.fullname?.trim() || 'Unassigned'}
          </span>
        </div>
      )}
    </div>
  )
}

function TaskEventDialog({
  event,
  startsAt,
  endsAt,
}: CalendarEventRenderProps<TaskCalendarEvent>) {
  const task = event.data

  return (
    <div className='space-y-5'>
      <DialogHeader>
        <DialogTitle>{event.title}</DialogTitle>
        <DialogDescription>
          {formatTaskRange(startsAt, endsAt)}
        </DialogDescription>
      </DialogHeader>

      {task && (
        <dl className='grid gap-3 text-sm'>
          <TaskEventDetail label='Status' value={TASK_STATUS[task.status]} />
          <TaskEventDetail
            label='Priority'
            value={task.priority ? TASK_PRIORITY[task.priority] : 'Not set'}
          />
          <TaskEventDetail
            label='Assignee'
            value={task.assignee?.fullname?.trim() || 'Unassigned'}
          />
          <TaskEventDetail
            label='Start date'
            value={format(startsAt, 'MMM d, yyyy')}
          />
          <TaskEventDetail
            label='Due date'
            value={format(endsAt, 'MMM d, yyyy')}
          />
        </dl>
      )}
    </div>
  )
}

function TaskEventDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className='grid grid-cols-[6rem_minmax(0,1fr)] gap-3'>
      <dt className='text-muted-foreground'>{label}</dt>
      <dd className='truncate font-medium'>{value}</dd>
    </div>
  )
}

function formatTaskRange(startsAt: Date, endsAt: Date) {
  const startsOn = format(startsAt, 'MMM d, yyyy')
  const endsOn = format(endsAt, 'MMM d, yyyy')

  return startsOn === endsOn ? endsOn : `${startsOn} - ${endsOn}`
}

function TaskCalendarSkeleton() {
  return (
    <div
      className='grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]'
      aria-label='Loading task calendar'
    >
      <Skeleton className='h-[calc(100dvh-15rem)] min-h-[36rem] rounded-md' />
      <Skeleton className='h-[calc(100dvh-15rem)] min-h-[36rem] rounded-md' />
    </div>
  )
}
