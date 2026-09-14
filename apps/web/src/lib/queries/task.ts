import { mutationOptions, queryOptions } from '@tanstack/react-query'
import type {
  ApiResponse,
  PaginatedApiResponse,
  QueryTask,
  Task,
  TaskBoardItem,
  TaskDetail,
  TaskStatus,
} from '@/@types'
import { queryClient } from '@/providers/query-provider'
import { httpClient } from '../repository/http-client'

const keys = {
  root: ['tasks'] as const,
  all: (options: QueryTask) => ['tasks', options],
  board: ['tasks', 'board'] as const,
  detail: (id: string) => ['tasks', 'detail', id] as const,
  updateStatus: ['tasks', 'update-status'] as const,
}

type UpdateTaskStatusInput = {
  id: string
  status: TaskStatus
}

export const tasks = () => ({
  all: {
    queryOptions: (options: QueryTask = {}) =>
      queryOptions({
        queryKey: keys.all(options),
        queryFn: async () => {
          const { data } = await httpClient.get<PaginatedApiResponse<Task[]>>(
            '/tasks',
            options as Record<string, unknown>
          )
          return data
        },
      }),
  },
  board: {
    queryOptions: () =>
      queryOptions({
        queryKey: keys.board,
        queryFn: async () => {
          const { data } =
            await httpClient.get<ApiResponse<TaskBoardItem[]>>('/tasks/board')
          return data
        },
      }),
  },
  detail: {
    queryOptions: (id: string) =>
      queryOptions({
        queryKey: keys.detail(id),
        queryFn: async () => {
          const { data } = await httpClient.get<ApiResponse<TaskDetail>>(
            `/tasks/${id}`
          )
          return data
        },
      }),
  },
  updateStatus: {
    mutationOptions: () =>
      mutationOptions({
        mutationKey: keys.updateStatus,
        mutationFn: async ({ id, status }: UpdateTaskStatusInput) =>
          httpClient.patch<ApiResponse<Task>>(`/tasks/${id}`, { status }),
        onSuccess: () =>
          queryClient().invalidateQueries({ queryKey: keys.root }),
      }),
  },
})
