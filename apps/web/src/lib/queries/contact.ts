import { mutationOptions, queryOptions } from '@tanstack/react-query'
import type {
  ApiResponse,
  Contact,
  ContactTag,
  CustomerGroup,
  PaginatedApiResponse,
  QueryContact,
} from '@/@types'
import { queryClient } from '@/providers/query-provider'
import { httpClient } from '@/lib/repository/http-client'
import type { ContactForm } from '@/lib/validators/contact'

const keys = {
  root: ['contacts'] as const,
  all: (options: QueryContact) => ['contacts', options],
  tags: ['contacts', 'tags'] as const,
  customerGroups: ['contacts', 'customer-groups'] as const,
  create: ['contacts', 'create'] as const,
  update: ['contacts', 'update'] as const,
  delete: ['contacts', 'delete'] as const,
}

export const contacts = () => ({
  all: {
    queryOptions: (options: QueryContact = {}) =>
      queryOptions({
        queryKey: keys.all(options),
        queryFn: async () => {
          const { data } = await httpClient.get<PaginatedApiResponse<Contact[]>>('/contacts')
          return data
        },
      }),
  },
  tags: {
    queryOptions: () =>
      queryOptions({
        queryKey: keys.tags,
        queryFn: async () => {
          const { data } =
            await httpClient.get<ApiResponse<ContactTag[]>>('/tags/active')
          return data
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
        mutationFn: async (input: ContactForm) =>
          httpClient.post<ApiResponse<Contact>>('/contacts', input),
        onSuccess: () =>
          queryClient().invalidateQueries({ queryKey: keys.root }),
      }),
  },
  update: {
    mutationOptions: () =>
      mutationOptions({
        mutationKey: keys.update,
        mutationFn: async ({ id, ...input }: ContactForm & { id: string }) =>
          httpClient.put<ApiResponse<Contact>>(`/contacts/${id}`, input),
        onSuccess: () =>
          queryClient().invalidateQueries({ queryKey: keys.root }),
      }),
  },
  delete: {
    mutationOptions: () =>
      mutationOptions({
        mutationKey: keys.delete,
        mutationFn: async (id: string) =>
          httpClient.delete<ApiResponse<null>>(`/contacts/${id}`),
        onSuccess: () =>
          queryClient().invalidateQueries({ queryKey: keys.root }),
      }),
  },
})
