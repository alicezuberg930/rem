import { mutationOptions, queryOptions } from '@tanstack/react-query'
import type {
  ApiResponse,
  Contact,
  Customer,
  CustomerGroup,
  PaginatedApiResponse,
  QueryContact,
  QueryCustomer,
} from '@/@types'
import { queryClient } from '@/providers/query-provider'
import { httpClient } from '../repository/http-client'

export type CustomerInput = {
  contactId: string
  customerGroupId: string | null
  customerSince: string | null
}

const keys = {
  root: ['customers'] as const,
  all: (options: QueryCustomer) => ['customers', options],
  contacts: (options: QueryContact) => ['customers', 'contacts', options],
  customerGroups: ['customers', 'customer-groups'] as const,
  create: ['customers', 'create'] as const,
  update: ['customers', 'update'] as const,
  delete: ['customers', 'delete'] as const,
}

type PageResponse<T> = PaginatedApiResponse<T[]>['data']

export const customers = () => ({
  all: {
    queryOptions: (options: QueryCustomer = {}) =>
      queryOptions({
        queryKey: keys.all(options),
        queryFn: async () => {
          const { data } = await httpClient.get<
            ApiResponse<PageResponse<Customer>>
          >('/customers', options as Record<string, unknown>)
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

  customerGroups: {
    queryOptions: () =>
      queryOptions({
        queryKey: keys.customerGroups,
        queryFn: async () => {
          const { data } =
            await httpClient.get<ApiResponse<CustomerGroup[]>>(
              '/customer-groups'
            )
          return data
        },
      }),
  },

  create: {
    mutationOptions: () =>
      mutationOptions({
        mutationKey: keys.create,
        mutationFn: async (input: CustomerInput) =>
          httpClient.post<ApiResponse<Customer>>('/customers', input),
        onSuccess: () =>
          queryClient().invalidateQueries({ queryKey: keys.root }),
      }),
  },

  update: {
    mutationOptions: () =>
      mutationOptions({
        mutationKey: keys.update,
        mutationFn: async ({ id, ...input }: CustomerInput & { id: string }) =>
          httpClient.put<ApiResponse<Customer>>(`/customers/${id}`, input),
        onSuccess: () =>
          queryClient().invalidateQueries({ queryKey: keys.root }),
      }),
  },

  delete: {
    mutationOptions: () =>
      mutationOptions({
        mutationKey: keys.delete,
        mutationFn: async (id: string) =>
          httpClient.delete<ApiResponse<null>>(`/customers/${id}`),
        onSuccess: () =>
          queryClient().invalidateQueries({ queryKey: keys.root }),
      }),
  },
})
