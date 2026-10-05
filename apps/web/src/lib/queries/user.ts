import { mutationOptions, queryOptions } from '@tanstack/react-query'
import type { ApiResponse, User } from '@/@types'
import { queryClient } from '@/providers/query-provider'
import { httpClient } from '../repository/http-client'

export type CreateUserInput = {
  fullname: string
  email: string
  phone: string
  birthday: string | null
  password: string
  confirmPassword: string
  roleId: string
  isActive: boolean
  isVerified: boolean
  salary: number
  dependants: number
  bankOwner: string | null
  bankAccount: string | null
  bankName: string | null
  bankCode: string | null
  bankBranch: string | null
}

export type UpdateUserInput = Omit<
  CreateUserInput,
  'password' | 'confirmPassword'
> & {
  id: string
  password: string | null
  confirmPassword: string | null
}

export type UserRole = {
  id: string
  name: string
  description: string | null
}

const keys = {
  root: ['users'] as const,
  all: ['users', 'list'] as const,
  roles: ['users', 'roles'] as const,
  create: ['users', 'create'] as const,
  update: ['users', 'update'] as const,
}

export const users = () => ({
  all: {
    queryOptions: () =>
      queryOptions({
        queryKey: keys.all,
        queryFn: async () => {
          const { data } =
            await httpClient.get<ApiResponse<User[]>>('/users/get')
          return data
        },
      }),
  },

  roles: {
    queryOptions: () =>
      queryOptions({
        queryKey: keys.roles,
        queryFn: async () => {
          const { data } =
            await httpClient.get<ApiResponse<UserRole[]>>('/users/roles')
          return data
        },
      }),
  },

  create: {
    mutationOptions: () =>
      mutationOptions({
        mutationKey: keys.create,
        mutationFn: async (input: CreateUserInput) =>
          httpClient.post<ApiResponse<User>>('/users', input),
        onSuccess: () =>
          queryClient().invalidateQueries({ queryKey: keys.root }),
      }),
  },

  update: {
    mutationOptions: () =>
      mutationOptions({
        mutationKey: keys.update,
        mutationFn: async ({ id, ...input }: UpdateUserInput) =>
          httpClient.put<ApiResponse<User>>(`/users/${id}`, input),
        onSuccess: () =>
          queryClient().invalidateQueries({ queryKey: keys.root }),
      }),
  },
})
