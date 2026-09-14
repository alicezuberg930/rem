import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import {
  TASK_PRIORITY,
  TASK_STATUS,
  type TaskPriority,
  type TaskStatus,
} from '@/@types'
import { Tasks } from '@/features/tasks'

const taskStatuses = Object.keys(TASK_STATUS) as [TaskStatus, ...TaskStatus[]]
const taskPriorities = Object.keys(TASK_PRIORITY) as [
  TaskPriority,
  ...TaskPriority[],
]

const taskSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  status: z.array(z.enum(taskStatuses)).optional().catch([]),
  priority: z.array(z.enum(taskPriorities)).optional().catch([]),
  filter: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/tasks/')({
  validateSearch: taskSearchSchema,
  component: Tasks,
})
