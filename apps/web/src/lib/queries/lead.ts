import { mutationOptions, queryOptions } from '@tanstack/react-query'
import type {
  ApiResponse,
  Contact,
  Customer,
  Lead,
  LeadSource,
  LeadStatus,
  PaginatedApiResponse,
  QueryContact,
  QueryLead,
} from '@/@types'
import { queryClient } from '@/providers/query-provider'
import { httpClient } from '../repository/http-client'

export type LeadInput = {
  contactId: string
  source: LeadSource
  status: LeadStatus
}

const keys = {
  root: ['leads'] as const,
  all: (options: QueryLead) => ['leads', options],
  contacts: (options: QueryContact) => ['leads', 'contacts', options],
  create: ['leads', 'create'] as const,
  update: ['leads', 'update'] as const,
  delete: ['leads', 'delete'] as const,
  convert: ['leads', 'convert'] as const,
  export: (options: QueryLead) => ['leads', 'export', options],
}

type PageResponse<T> = PaginatedApiResponse<T[]>['data']

export const leads = () => ({
  all: {
    queryOptions: (options: QueryLead = {}) =>
      queryOptions({
        queryKey: keys.all(options),
        queryFn: async () => {
          const { data } = await httpClient.get<
            ApiResponse<PageResponse<Lead>>
          >('/leads', options as Record<string, unknown>)
          return data
        },
      }),
  },

  contacts: {
    queryOptions: (options: QueryContact = { pageSize: 1_000 }) =>
      queryOptions({
        queryKey: keys.contacts(options),
        queryFn: async () => {
          const { data } = await httpClient.get<
            ApiResponse<PageResponse<Contact>>
          >('/contacts', options as Record<string, unknown>)
          return data.content
        },
      }),
  },

  create: {
    mutationOptions: () =>
      mutationOptions({
        mutationKey: keys.create,
        mutationFn: async (input: LeadInput) =>
          httpClient.post<ApiResponse<Lead>>('/leads', input),
        onSuccess: () =>
          queryClient().invalidateQueries({ queryKey: keys.root }),
      }),
  },

  update: {
    mutationOptions: () =>
      mutationOptions({
        mutationKey: keys.update,
        mutationFn: async ({ id, ...input }: LeadInput & { id: string }) =>
          httpClient.put<ApiResponse<Lead>>(`/leads/${id}`, input),
        onSuccess: () =>
          queryClient().invalidateQueries({ queryKey: keys.root }),
      }),
  },

  delete: {
    mutationOptions: () =>
      mutationOptions({
        mutationKey: keys.delete,
        mutationFn: async (id: string) =>
          httpClient.delete<ApiResponse<null>>(`/leads/${id}`),
        onSuccess: () =>
          queryClient().invalidateQueries({ queryKey: keys.root }),
      }),
  },

  convert: {
    mutationOptions: () =>
      mutationOptions({
        mutationKey: keys.convert,
        mutationFn: async (leadIds: string[]) =>
          httpClient.put<ApiResponse<Customer[]>>('/leads/convert', {
            leadIds,
          }),
        onSuccess: () => {
          queryClient().invalidateQueries({ queryKey: keys.root })
          queryClient().invalidateQueries({ queryKey: ['customers'] })
        },
      }),
  },

  export: {
    queryKey: keys.export,
    download: (options: QueryLead = {}) =>
      httpClient.download('/leads/export', options as Record<string, unknown>),
  },
})
