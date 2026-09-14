import { useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import { format } from 'date-fns'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  TASK_PRIORITY,
  TASK_STATUS,
  type TaskBoardItem,
  type TaskStatus,
} from '@/@types'
import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CalendarDays, GripVertical, RotateCcw, UserRound } from 'lucide-react'
import { tasks } from '@/lib/queries/task'
import { cn, getInitials } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const BOARD_COLUMNS: ReadonlyArray<{
  status: TaskStatus
  accentClassName: string
}> = [
  { status: 'PROCESSING', accentClassName: 'bg-sky-500' },
  { status: 'IN_PROGRESS', accentClassName: 'bg-blue-500' },
  { status: 'TESTING', accentClassName: 'bg-violet-500' },
  {
    status: 'WAITING_FOR_APPROVAL',
    accentClassName: 'bg-amber-500',
  },
  { status: 'COMPLETED', accentClassName: 'bg-emerald-500' },
  { status: 'ON_HOLD', accentClassName: 'bg-rose-500' },
]
const EMPTY_BOARD_TASKS: TaskBoardItem[] = []

const taskDragId = (id: string) => `task:${id}`
const columnDropId = (status: TaskStatus) => `column:${status}`

type TaskCardProps = {
  task: TaskBoardItem
  disabled?: boolean
}

function TaskCardContent({
  task,
  dragHandle,
  overlay = false,
}: {
  task: TaskBoardItem
  dragHandle?: ReactNode
  overlay?: boolean
}) {
  const assigneeName = task.assignee?.fullname?.trim() || 'Unassigned'

  return (
    <Card
      size='sm'
      className={cn(
        'gap-3 rounded-md py-3 shadow-none ring-border',
        overlay && 'w-72 rotate-1 shadow-lg ring-primary/30'
      )}
    >
      <CardHeader className='grid-cols-[minmax(0,1fr)_auto] gap-2 px-3'>
        <CardTitle className='line-clamp-2 leading-5'>
          {task.title?.trim() || 'Untitled task'}
        </CardTitle>
        {dragHandle}
      </CardHeader>

      <CardContent className='space-y-3 px-3'>
        <Badge variant='outline' className='font-normal'>
          {task.priority ? TASK_PRIORITY[task.priority] : 'No priority'}
        </Badge>

        <div className='flex items-center justify-between gap-3 text-xs text-muted-foreground'>
          <div className='flex min-w-0 items-center gap-2'>
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
          </div>

          {task.dueDate && (
            <span className='flex shrink-0 items-center gap-1'>
              <CalendarDays className='size-3.5' aria-hidden='true' />
              {format(new Date(task.dueDate), 'MMM d')}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function TaskCard({ task, disabled = false }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: taskDragId(task.id),
    data: { type: 'task', taskId: task.id, status: task.status },
    disabled,
  })
  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(isDragging && 'opacity-30', disabled && 'opacity-70')}
    >
      <TaskCardContent
        task={task}
        dragHandle={
          <Tooltip>
            <TooltipTrigger
              ref={setActivatorNodeRef}
              render={
                <Button
                  variant='ghost'
                  size='icon-xs'
                  aria-label={`Move ${task.title?.trim() || 'untitled task'}`}
                  disabled={disabled}
                />
              }
              {...attributes}
              {...listeners}
            >
              <GripVertical aria-hidden='true' />
            </TooltipTrigger>
            <TooltipContent>Drag to change status</TooltipContent>
          </Tooltip>
        }
      />
    </div>
  )
}

type BoardColumnProps = {
  status: TaskStatus
  accentClassName: string
  items: TaskBoardItem[]
  pendingTaskIds: ReadonlySet<string>
}

function BoardColumn({
  status,
  accentClassName,
  items,
  pendingTaskIds,
}: BoardColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: columnDropId(status),
    data: { type: 'column', status },
  })

  return (
    <section
      ref={setNodeRef}
      aria-label={`${TASK_STATUS[status]} tasks`}
      className={cn(
        'flex h-[calc(100dvh-15rem)] min-h-[30rem] w-72 shrink-0 flex-col overflow-hidden rounded-md border bg-muted/30 transition-colors',
        isOver && 'border-primary bg-primary/5'
      )}
    >
      <div className='flex h-11 shrink-0 items-center gap-2 border-b px-3'>
        <span
          className={cn('size-2 rounded-full', accentClassName)}
          aria-hidden='true'
        />
        <h3 className='truncate text-sm font-medium'>{TASK_STATUS[status]}</h3>
        <Badge variant='secondary' className='ms-auto min-w-6 px-1.5'>
          {items.length}
        </Badge>
      </div>

      <ScrollArea className='min-h-0 flex-1'>
        <SortableContext
          items={items.map((task) => taskDragId(task.id))}
          strategy={verticalListSortingStrategy}
        >
          <div className='flex min-h-[calc(100dvh-18rem)] flex-col gap-2 p-2'>
            {items.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                disabled={pendingTaskIds.has(task.id)}
              />
            ))}
            {items.length === 0 && (
              <div className='flex min-h-24 items-center justify-center rounded-md border border-dashed px-4 text-center text-xs text-muted-foreground'>
                Drop tasks here
              </div>
            )}
          </div>
        </SortableContext>
      </ScrollArea>
    </section>
  )
}

function BoardSkeleton() {
  return (
    <div className='flex gap-3 overflow-hidden' aria-label='Loading task board'>
      {BOARD_COLUMNS.map(({ status }) => (
        <div
          key={status}
          className='h-[30rem] w-72 shrink-0 rounded-md border bg-muted/30 p-3'
        >
          <Skeleton className='mb-5 h-5 w-32' />
          <div className='space-y-2'>
            <Skeleton className='h-32 w-full' />
            <Skeleton className='h-32 w-full' />
            <Skeleton className='h-32 w-full' />
          </div>
        </div>
      ))}
    </div>
  )
}

export function TaskKanbanBoard() {
  const queryClient = useQueryClient()
  const boardQueryOptions = tasks().board.queryOptions()
  const boardQuery = useQuery(boardQueryOptions)
  const updateStatus = useMutation(tasks().updateStatus.mutationOptions())
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)
  const [pendingTaskIds, setPendingTaskIds] = useState<Set<string>>(new Set())
  const [statusMessage, setStatusMessage] = useState('')
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const boardTasks = boardQuery.data ?? EMPTY_BOARD_TASKS

  const groupedTasks = useMemo(() => {
    const groups = new Map<TaskStatus, TaskBoardItem[]>(
      BOARD_COLUMNS.map(({ status }) => [status, []])
    )
    for (const task of boardTasks) groups.get(task.status)?.push(task)
    return groups
  }, [boardTasks])

  const activeTask = activeTaskId
    ? boardTasks.find((task) => task.id === activeTaskId)
    : undefined

  const handleDragStart = ({ active }: DragStartEvent) => {
    const taskId = active.data.current?.taskId
    if (typeof taskId === 'string') setActiveTaskId(taskId)
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveTaskId(null)
    const taskId = active.data.current?.taskId
    const nextStatus = over?.data.current?.status

    if (typeof taskId !== 'string' || typeof nextStatus !== 'string') return

    const task = boardTasks.find((item) => item.id === taskId)
    if (!task || task.status === nextStatus) return

    const previousStatus = task.status
    const status = nextStatus as TaskStatus
    queryClient.setQueryData<TaskBoardItem[]>(
      boardQueryOptions.queryKey,
      (current = []) =>
        current.map((item) => (item.id === taskId ? { ...item, status } : item))
    )
    setPendingTaskIds((current) => new Set(current).add(taskId))
    setStatusMessage(
      `${task.title?.trim() || 'Task'} moved to ${TASK_STATUS[status]}.`
    )

    updateStatus.mutate(
      { id: taskId, status },
      {
        onError: () => {
          queryClient.setQueryData<TaskBoardItem[]>(
            boardQueryOptions.queryKey,
            (current = []) =>
              current.map((item) =>
                item.id === taskId && item.status === status
                  ? { ...item, status: previousStatus }
                  : item
              )
          )
          setStatusMessage(
            `Could not move ${task.title?.trim() || 'task'}. Its previous status was restored.`
          )
        },
        onSettled: () => {
          setPendingTaskIds((current) => {
            const next = new Set(current)
            next.delete(taskId)
            return next
          })
        },
      }
    )
  }

  if (boardQuery.isLoading) return <BoardSkeleton />

  if (boardQuery.isError) {
    return (
      <div className='flex min-h-64 flex-col items-center justify-center gap-3 rounded-md border border-dashed text-center'>
        <p className='text-sm text-muted-foreground'>
          Unable to load the task board.
        </p>
        <Button variant='outline' onClick={() => boardQuery.refetch()}>
          <RotateCcw aria-hidden='true' />
          Retry
        </Button>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragCancel={() => setActiveTaskId(null)}
        onDragEnd={handleDragEnd}
      >
        <div className='w-full overflow-x-auto pb-2'>
          <div className='flex min-w-max gap-3'>
            {BOARD_COLUMNS.map(({ status, accentClassName }) => (
              <BoardColumn
                key={status}
                status={status}
                accentClassName={accentClassName}
                items={groupedTasks.get(status) ?? []}
                pendingTaskIds={pendingTaskIds}
              />
            ))}
          </div>
        </div>

        <DragOverlay dropAnimation={null}>
          {activeTask ? <TaskCardContent task={activeTask} overlay /> : null}
        </DragOverlay>
        <p className='sr-only' aria-live='polite'>
          {statusMessage}
        </p>
      </DndContext>
    </TooltipProvider>
  )
}
