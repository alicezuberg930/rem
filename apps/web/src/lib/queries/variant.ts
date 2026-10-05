import { mutationOptions, queryOptions } from '@tanstack/react-query'
import type {
  ApiResponse,
  PaginatedApiResponse,
  QueryVariant,
  Variant,
} from '@/@types'
import { getSelectedBusinessId } from '@/lib/business'
import { queryClient } from '@/providers/query-provider'
import type { VariantForm } from '@/lib/validators/variant'
import { httpClient } from '../repository/http-client'

type VariantPayload = Omit<VariantForm, 'isEdit'>
type UpdateVariantPayload = VariantPayload & { id: string }

const keys = {
  root: ['variants'] as const,
  all: (options: QueryVariant) =>
    ['variants', getSelectedBusinessId(), 'list', options] as const,
  selection: () =>
    ['variants', getSelectedBusinessId(), 'selection'] as const,
  one: (id: string) =>
    ['variants', getSelectedBusinessId(), 'detail', id] as const,
  create: () => ['variants', getSelectedBusinessId(), 'create'] as const,
  update: () => ['variants', getSelectedBusinessId(), 'update'] as const,
  delete: () => ['variants', getSelectedBusinessId(), 'delete'] as const,
}

export const variants = () => ({
  all: {
    queryKey: keys.all,
    queryOptions: (options: QueryVariant = {}) =>
      queryOptions({
        queryKey: keys.all(options),
        queryFn: async () => {
          const response = await httpClient.get<
            PaginatedApiResponse<Variant[]>
          >('/variants', options as Record<string, unknown>)
          return response.data
        },
      }),
  },

  selection: {
    queryKey: keys.selection,
    queryOptions: () =>
      queryOptions({
        queryKey: keys.selection(),
        queryFn: async () => {
          const fetchPage = async (page: number) => {
            const response = await httpClient.get<
              PaginatedApiResponse<Variant[]>
            >('/variants', { page, pageSize: 10 })
            return response.data
          }

          const firstPage = await fetchPage(0)
          const remainingPages = await Promise.all(
            Array.from(
              { length: Math.max(firstPage.totalPages - 1, 0) },
              (_, index) => fetchPage(index + 1)
            )
          )

          const variantsById = new Map<string, Variant>()
          ;[firstPage, ...remainingPages].forEach((page) => {
            page.content.forEach((variant) => {
              variantsById.set(variant.id, variant)
            })
          })
          return Array.from(variantsById.values())
        },
      }),
  },

  one: {
    queryKey: keys.one,
    queryOptions: (id: string) =>
      queryOptions({
        queryKey: keys.one(id),
        queryFn: async () => {
          const response = await httpClient.get<ApiResponse<Variant>>(
            `/variants/${id}`
          )
          return response.data
        },
      }),
  },

  create: {
    mutationKey: keys.create,
    mutationOptions: () =>
      mutationOptions({
        mutationKey: keys.create(),
        mutationFn: (input: VariantPayload) =>
          httpClient.post<ApiResponse<Variant>>('/variants', input),
        onSuccess: () =>
          queryClient().invalidateQueries({ queryKey: keys.root }),
      }),
  },

  update: {
    mutationKey: keys.update,
    mutationOptions: () =>
      mutationOptions({
        mutationKey: keys.update(),
        mutationFn: ({ id, ...input }: UpdateVariantPayload) =>
          httpClient.put<ApiResponse<Variant>>(`/variants/${id}`, input),
        onSuccess: () =>
          queryClient().invalidateQueries({ queryKey: keys.root }),
      }),
  },

  delete: {
    mutationKey: keys.delete,
    mutationOptions: () =>
      mutationOptions({
        mutationKey: keys.delete(),
        mutationFn: (id: string) =>
          httpClient.delete<ApiResponse<Variant>>(`/variants/${id}`),
        onSuccess: () =>
          queryClient().invalidateQueries({ queryKey: keys.root }),
      }),
  },
})
