import type { QueryPaginate } from '.'
import type { User } from './user'

export const TASK_PRIORITY = {
  LOWEST: 'Lowest',
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  HIGHEST: 'Highest',
} as const

export const TASK_STATUS = {
  IN_PROGRESS: 'In progress',
  TESTING: 'Testing',
  COMPLETED: 'Completed',
  PROCESSING: 'Processing',
  WAITING_FOR_APPROVAL: 'Waiting for approval',
  ON_HOLD: 'On hold',
} as const

export const TASK_HISTORY_TYPE = {
  STATUS: 'Status',
  DATE: 'Date',
  LABEL: 'Label',
  ATTACHMENT: 'Attachment',
  ASSIGNEE: 'Assignee',
  DESCRIPTION: 'Description',
} as const

export const TASK_HISTORY_ACTION = {
  UPDATE: 'Update',
  CREATE: 'Create',
  DELETE: 'Delete',
} as const

export type TaskPriority = keyof typeof TASK_PRIORITY
export type TaskStatus = keyof typeof TASK_STATUS
export type TaskHistoryType = keyof typeof TASK_HISTORY_TYPE
export type TaskHistoryAction = keyof typeof TASK_HISTORY_ACTION

export type QueryTask = QueryPaginate & {
  status?: TaskStatus
  priority?: TaskPriority
  filter?: string
}

export type TaskUser = Partial<User>

export type TaskReference = {
  id: string
  title: string | null
  status: TaskStatus | null
}

export type TaskLabel = {
  id: string
  title: string
  createdAt: string
  updatedAt: string
}

export type TaskAttachment = {
  id: string
  title: string | null
  url: string | null
  createdAt: string
  updatedAt: string
}

export type TaskCommentAttachment = {
  id: string
  title: string | null
  createdAt: string
  updatedAt: string
}

export type TaskComment = {
  id: string
  content: string | null
  user: TaskUser | null
  attachment: TaskCommentAttachment | null
  createdAt: string
  updatedAt: string
}

export type TaskHistory = {
  id: string
  title: string | null
  user: TaskUser | null
  fromDescription: string | null
  toDescription: string | null
  type: TaskHistoryType | null
  action: TaskHistoryAction | null
  createdAt: string
}

export type Task = {
  id: string
  businessId: string | null
  assignee: TaskUser | null
  subTask: TaskReference | null
  title: string | null
  priority: TaskPriority | null
  status: TaskStatus
  startDate: string | null
  dueDate: string | null
  description: string | null
  createdAt: string
  updatedAt: string
}

export type TaskDetail = Task & {
  comments: TaskComment[]
  histories: TaskHistory[]
  attachments: TaskAttachment[]
  labels: TaskLabel[]
}

export type TaskBoardItem = Pick<
  Task,
  'id' | 'title' | 'priority' | 'status' | 'dueDate' | 'assignee'
>
