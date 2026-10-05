import { mutationOptions, queryOptions } from '@tanstack/react-query'
import type { ApiResponse, Product, ProductRequest } from '@/@types'
import { getSelectedBusinessId } from '@/lib/business'
import { queryClient } from '@/providers/query-provider'
import { httpClient } from '../repository/http-client'

type UpdateProductRequest = ProductRequest & { id: string }

const keys = {
  root: ['products'] as const,
  all: () => ['products', getSelectedBusinessId(), 'list'] as const,
  one: (id: string) =>
    ['products', getSelectedBusinessId(), 'detail', id] as const,
  create: () => ['products', getSelectedBusinessId(), 'create'] as const,
  update: () => ['products', getSelectedBusinessId(), 'update'] as const,
  delete: () => ['products', getSelectedBusinessId(), 'delete'] as const,
}

export const products = () => ({
  all: {
    queryKey: keys.all,
    queryOptions: () =>
      queryOptions({
        queryKey: keys.all(),
        queryFn: async () => {
          const response =
            await httpClient.get<ApiResponse<Product[]>>('/products')
          return response.data
        },
      }),
  },

  one: {
    queryKey: keys.one,
    queryOptions: (id: string) =>
      queryOptions({
        queryKey: keys.one(id),
        queryFn: async () => {
          const response = await httpClient.get<ApiResponse<Product>>(
            `/products/${id}`
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
        mutationFn: (input: ProductRequest) =>
          httpClient.post<ApiResponse<Product>>('/products', input),
        onSuccess: () =>
          queryClient().invalidateQueries({ queryKey: keys.root }),
      }),
  },

  update: {
    mutationKey: keys.update,
    mutationOptions: () =>
      mutationOptions({
        mutationKey: keys.update(),
        mutationFn: ({ id, ...input }: UpdateProductRequest) =>
          httpClient.put<ApiResponse<Product>>(`/products/${id}`, input),
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
          httpClient.delete<ApiResponse<Product>>(`/products/${id}`),
        onSuccess: () =>
          queryClient().invalidateQueries({ queryKey: keys.root }),
      }),
  },
})
