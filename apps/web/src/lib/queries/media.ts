import { infiniteQueryOptions, mutationOptions } from '@tanstack/react-query'
import type {
  ApiResponse,
  Media,
  PaginatedApiResponse,
  MediaQuery,
  MediaUploadRequest,
  Template,
} from '@/@types'
import { queryClient } from '@/providers/query-provider'
import { httpClient } from '../repository/http-client'

const keys = {
  root: ['media'] as const,
  all: (options: MediaQuery) => [...keys.root, 'all', options] as const,
  upload: () => ['media', 'upload'] as const,
  delete: () => ['media', 'delete'] as const,
  download: () => ['media', 'download'] as const,
  preview: () => ['media', 'preview'] as const
}

export const medias = () => ({
  all: {
    infiniteQueryOptions: (options: MediaQuery = {}) =>
      infiniteQueryOptions({
        queryKey: keys.all(options),
        initialPageParam: 0,
        queryFn: async ({ pageParam }) => {
          const { data } = await httpClient.get<PaginatedApiResponse<Media[]>>(
            '/medias',
            {
              ...options,
              page: pageParam,
            }
          )

          return data
        },
        getNextPageParam: (data) => data.nextPage ?? undefined,
      }),
  },

  upload: {
    mutationKey: keys.upload,
    mutationOptions: () =>
      mutationOptions({
        mutationKey: keys.upload(),
        mutationFn: async ({ items, parentId }: MediaUploadRequest) => {
          const formData = new FormData()
          items.forEach(({ file, relativePath }) => {
            formData.append('files', file, file.name)
            formData.append('paths', relativePath)
          })
          if (parentId) formData.append('parentId', parentId)
          return await httpClient.post<ApiResponse<Media[]>>(
            `/medias/upload`,
            formData
          )
        },
        onSuccess: () => queryClient().invalidateQueries({ queryKey: keys.root }),
      }),
  },

  download: {
    mutationKey: keys.download,
    mutationOptions: () =>
      mutationOptions({
        mutationKey: keys.download(),
        mutationFn: async (id: string) => {
          return await httpClient.get<ApiResponse<string[]>>(
            `/medias/download/${id}`
          )
        },
        onSuccess(data) {
          console.log(data.data)
        },
      }),
  },

  preview: {
    mutationKey: keys.preview,
    mutationOptions: () =>
      mutationOptions({
        mutationKey: keys.preview(),
        mutationFn: async (id: string) => {
          return await httpClient.get<ApiResponse<{ previewUrl: string }>>(
            `/medias/preview/${id}`
          )
        },
        onSuccess(data) {
          console.log(data.data.previewUrl)
        },
      }),
  },

  delete: {
    mutationKey: keys.delete,
    mutationOptions: () =>
      mutationOptions({
        mutationKey: keys.delete(),
        mutationFn: async (id: string) => {
          return await httpClient.delete<ApiResponse<Template[]>>(
            `/medias/${id}`
          )
        },
        onSuccess: () => {
          // queryClient().invalidateQueries({ queryKey: keys.all({}) })
        },
      }),
  },
})
