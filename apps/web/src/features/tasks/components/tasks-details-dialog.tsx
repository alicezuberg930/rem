import { format } from 'date-fns'
import { useQuery } from '@tanstack/react-query'
import {
    TASK_HISTORY_ACTION,
    TASK_PRIORITY,
    TASK_STATUS,
    type TaskComment,
    type TaskDetail,
    type TaskHistory,
} from '@/@types'
import { ArrowRight, CalendarDays, Clock3, ExternalLink, FileText, GitBranch, History, Paperclip, RotateCcw, Tag, UserRound } from 'lucide-react'
import { tasks } from '@/lib/queries/task'
import { getInitials } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type TaskDetailsDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: { id: string }
}

function DetailRow({ icon: Icon, label, children }: {
    icon: typeof UserRound
    label: string
    children: React.ReactNode
}) {
    return (
        <div className='grid grid-cols-[7rem_minmax(0,1fr)] items-start gap-3 py-2.5 px-4'>
            <dt className='flex items-center gap-2 text-muted-foreground'>
                <Icon className='size-4 shrink-0' aria-hidden='true' />
                {label}
            </dt>
            <dd className='min-w-0'>{children}</dd>
        </div>
    )
}

function Assignee({ task }: { task: TaskDetail }) {
    const name = task.assignee?.fullname?.trim() || 'Unassigned'

    return (
        <div className='flex min-w-0 items-center gap-2'>
            {task.assignee ? (
                <Avatar size='sm'>
                    {task.assignee.avatar && (
                        <AvatarImage src={task.assignee.avatar} alt={name} />
                    )}
                    <AvatarFallback>{getInitials(name)}</AvatarFallback>
                </Avatar>
            ) : (
                <span className='flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground'>
                    <UserRound className='size-3.5' aria-hidden='true' />
                </span>
            )}
            <span className='truncate'>{name}</span>
        </div>
    )
}

function CommentItem({ comment }: { comment: TaskComment }) {
    const author = comment.user?.fullname?.trim() || 'Unknown user'

    return (
        <article className='flex gap-3 border-b py-4 last:border-b-0'>
            <Avatar size='sm'>
                {comment.user?.avatar && (
                    <AvatarImage src={comment.user.avatar} alt={author} />
                )}
                <AvatarFallback>{getInitials(author)}</AvatarFallback>
            </Avatar>
            <div className='min-w-0 flex-1'>
                <div className='flex flex-wrap items-baseline gap-x-2 gap-y-1'>
                    <span className='font-medium'>{author}</span>
                    <time className='text-xs text-muted-foreground'>
                        {format(comment.createdAt, 'MMM d, yyyy, h:mm a')}
                    </time>
                </div>
                <p className='mt-1 whitespace-pre-wrap text-foreground/90'>
                    {comment.content || 'No comment text'}
                </p>
                {comment.attachment?.title && (
                    <Badge variant='outline' className='mt-2 max-w-full font-normal'>
                        <Paperclip aria-hidden='true' />
                        <span className='truncate'>{comment.attachment.title}</span>
                    </Badge>
                )}
            </div>
        </article>
    )
}

function HistoryItem({ item }: { item: TaskHistory }) {
    const author = item.user?.fullname?.trim() || 'Unknown user'

    return (
        <article className='flex gap-3 border-b py-4 last:border-b-0'>
            <span className='mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground'>
                <History className='size-3.5' aria-hidden='true' />
            </span>
            <div className='min-w-0 flex-1'>
                <div className='flex flex-wrap items-baseline gap-x-2 gap-y-1'>
                    <span className='font-medium'>{author}</span>
                    <span>
                        {item.title || TASK_HISTORY_ACTION[item.action ?? 'UPDATE']}
                    </span>
                    <time className='text-xs text-muted-foreground'>
                        {format(item.createdAt, 'MMM d, yyyy, h:mm a')}
                    </time>
                </div>
                {(item.fromDescription || item.toDescription) && (
                    <div className='mt-2 flex min-w-0 items-center gap-2 text-xs text-muted-foreground'>
                        <span className='max-w-[45%] truncate rounded-sm bg-muted px-2 py-1'>
                            {item.fromDescription || 'None'}
                        </span>
                        <ArrowRight className='size-3.5 shrink-0' aria-hidden='true' />
                        <span className='max-w-[45%] truncate rounded-sm bg-muted px-2 py-1'>
                            {item.toDescription || 'None'}
                        </span>
                    </div>
                )}
            </div>
        </article>
    )
}

function DetailsPanel({ task }: { task: TaskDetail }) {
    return (
        <aside className='border-t bg-muted/20 p-4 lg:border-t-0 lg:border-l lg:p-5'>
            <section className='rounded-md border bg-background'>
                <div className='flex h-11 items-center border-b px-4'>
                    <h2 className='font-medium'>Details</h2>
                </div>
                <dl className='divide-y'>
                    <DetailRow icon={FileText} label='Status'>
                        <Badge variant='outline' className='font-normal'>
                            {TASK_STATUS[task.status]}
                        </Badge>
                    </DetailRow>
                    <DetailRow icon={UserRound} label='Assignee'>
                        <Assignee task={task} />
                    </DetailRow>
                    <DetailRow icon={GitBranch} label='Linked task'>
                        {task.subTask ? (
                            <div className='min-w-0'>
                                <p className='truncate font-medium'>
                                    {task.subTask.title || 'Untitled task'}
                                </p>
                                {task.subTask.status && (
                                    <p className='text-xs text-muted-foreground'>
                                        {TASK_STATUS[task.subTask.status]}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <span className='text-muted-foreground'>None</span>
                        )}
                    </DetailRow>
                    <DetailRow icon={ArrowRight} label='Priority'>
                        {task.priority ? TASK_PRIORITY[task.priority] : 'Not set'}
                    </DetailRow>
                    <DetailRow icon={Tag} label='Labels'>
                        {task.labels.length ? (
                            <div className='flex flex-wrap gap-1.5'>
                                {task.labels.map((label) => (
                                    <Badge
                                        key={label.id}
                                        variant='secondary'
                                        className='max-w-full font-normal'
                                    >
                                        <span className='truncate'>{label.title}</span>
                                    </Badge>
                                ))}
                            </div>
                        ) : (
                            <span className='text-muted-foreground'>None</span>
                        )}
                    </DetailRow>
                    <DetailRow icon={CalendarDays} label='Start date'>
                        {task.startDate ? format(task.startDate, 'MMM d, yyyy') : '-'}
                    </DetailRow>
                    <DetailRow icon={CalendarDays} label='Due date'>
                        {task.dueDate ? format(task.dueDate, 'MMM d, yyyy') : '-'}
                    </DetailRow>
                    <DetailRow icon={Clock3} label='Created'>
                        {format(task.createdAt, 'MMM d, yyyy, h:mm a')}
                    </DetailRow>
                    <DetailRow icon={Clock3} label='Updated'>
                        {format(task.updatedAt, 'MMM d, yyyy, h:mm a')}
                    </DetailRow>
                </dl>
            </section>
        </aside>
    )
}

function TaskDetails({ task }: { task: TaskDetail }) {
    return (
        <div className='grid min-h-full lg:grid-cols-[minmax(0,1fr)_22rem]'>
            <main className='min-w-0 px-5 py-6 sm:px-7'>
                <section aria-labelledby='task-description-heading'>
                    <h2 id='task-description-heading' className='font-medium'>
                        Description
                    </h2>
                    <p className='mt-2 whitespace-pre-wrap text-muted-foreground'>
                        {task.description || 'No description'}
                    </p>
                </section>

                <Separator className='my-6' />

                <section aria-labelledby='task-attachments-heading'>
                    <div className='flex items-center gap-2'>
                        <h2 id='task-attachments-heading' className='font-medium'>
                            Attachments
                        </h2>
                        <Badge variant='secondary'>{task.attachments.length}</Badge>
                    </div>
                    {task.attachments.length ? (
                        <div className='mt-3 grid gap-2 sm:grid-cols-2'>
                            {task.attachments.map((attachment) => {
                                const title = attachment.title || 'Untitled attachment'
                                return attachment.url ? (
                                    <a
                                        key={attachment.id}
                                        href={attachment.url}
                                        target='_blank'
                                        rel='noreferrer'
                                        className='flex min-w-0 items-center gap-2 rounded-md border px-3 py-2.5 hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none'
                                    >
                                        <Paperclip className='size-4 shrink-0' aria-hidden='true' />
                                        <span className='truncate'>{title}</span>
                                        <ExternalLink
                                            className='ms-auto size-3.5 shrink-0 text-muted-foreground'
                                            aria-hidden='true'
                                        />
                                    </a>
                                ) : (
                                    <div
                                        key={attachment.id}
                                        className='flex min-w-0 items-center gap-2 rounded-md border px-3 py-2.5 text-muted-foreground'
                                    >
                                        <Paperclip className='size-4 shrink-0' aria-hidden='true' />
                                        <span className='truncate'>{title}</span>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <p className='mt-2 text-sm text-muted-foreground'>No attachments</p>
                    )}
                </section>

                <Separator className='my-6' />

                <section aria-labelledby='task-activity-heading'>
                    <h2 id='task-activity-heading' className='mb-3 font-medium'>
                        Activity
                    </h2>
                    <Tabs defaultValue='comments' className='w-full flex-col'>
                        <TabsList variant='line'>
                            <TabsTrigger value='comments'>
                                Comments
                                <Badge variant='secondary'>{task.comments.length}</Badge>
                            </TabsTrigger>
                            <TabsTrigger value='history'>
                                History
                                <Badge variant='secondary'>{task.histories.length}</Badge>
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value='comments'>
                            {task.comments.length ? (
                                task.comments.map((comment) => (
                                    <CommentItem key={comment.id} comment={comment} />
                                ))
                            ) : (
                                <p className='py-8 text-center text-sm text-muted-foreground'>
                                    No comments yet
                                </p>
                            )}
                        </TabsContent>
                        <TabsContent value='history'>
                            {task.histories.length ? (
                                task.histories.map((item) => (
                                    <HistoryItem key={item.id} item={item} />
                                ))
                            ) : (
                                <p className='py-8 text-center text-sm text-muted-foreground'>
                                    No history yet
                                </p>
                            )}
                        </TabsContent>
                    </Tabs>
                </section>
            </main>

            <DetailsPanel task={task} />
        </div>
    )
}

function DetailsSkeleton() {
    return (
        <div className='grid min-h-full gap-8 p-7 lg:grid-cols-[minmax(0,1fr)_22rem]'>
            <div className='space-y-6'>
                <Skeleton className='h-5 w-28' />
                <Skeleton className='h-24 w-full' />
                <Skeleton className='h-5 w-24' />
                <Skeleton className='h-20 w-full' />
                <Skeleton className='h-52 w-full' />
            </div>
            <Skeleton className='h-[30rem] w-full' />
        </div>
    )
}

export function TasksDetailsDialog({
    open,
    onOpenChange,
    currentRow,
}: TaskDetailsDialogProps) {
    const { data: task, isLoading, isError, refetch } = useQuery({
        ...tasks().detail.queryOptions(currentRow.id),
        enabled: open,
    })

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='flex h-[90dvh] max-h-[90dvh] flex-col gap-0 overflow-hidden p-0 sm:max-w-[min(75rem,calc(100vw-2rem))]'>
                <DialogHeader className='shrink-0 gap-2 border-b px-5 py-4 pr-14 sm:px-7'>
                    <div className='flex min-w-0 items-center gap-2 text-xs text-muted-foreground'>
                        <Badge variant='outline' className='font-normal'>
                            Task
                        </Badge>
                        <span className='truncate font-mono'>{currentRow.id}</span>
                        {task && (
                            <Badge variant='secondary' className='ms-auto font-normal'>
                                {TASK_STATUS[task.status]}
                            </Badge>
                        )}
                    </div>
                    <DialogTitle className='truncate text-xl'>
                        {task?.title?.trim() || (isLoading ? 'Loading task...' : 'Untitled task')}
                    </DialogTitle>
                    <DialogDescription className='sr-only'>
                        Task details, attachments, comments, and history.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className='min-h-0 flex-1'>
                    {isLoading ? (
                        <DetailsSkeleton />
                    ) : isError ? (
                        <div className='flex min-h-80 flex-col items-center justify-center gap-3 text-center'>
                            <p className='text-sm text-muted-foreground'>
                                Unable to load task details.
                            </p>
                            <Button variant='outline' onClick={() => refetch()}>
                                <RotateCcw aria-hidden='true' />
                                Retry
                            </Button>
                        </div>
                    ) : task ? (
                        <TaskDetails task={task} />
                    ) : null}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
