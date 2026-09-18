import { mutationOptions } from '@tanstack/react-query'
import type { ApiResponse, Media, Template } from '@/@types'
import { httpClient } from '../repository/http-client'

const keys = {
  upload: () => ['media', 'upload'] as const,
  delete: () => ['media', 'delete'] as const,
}

export const medias = () => ({
  upload: {
    mutationKey: keys.upload,
    mutationOptions: () =>
      mutationOptions({
        mutationKey: keys.upload(),
        mutationFn: async (data: FormData) => {
          return await httpClient.post<ApiResponse<Media>>(
            `/medias/upload`,
            data
          )
        },
        onSuccess: () => {
          // queryClient().invalidateQueries({ queryKey: keys.all({}) })
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
            `/templates/${id}`
          )
        },
        onSuccess: () => {
          // queryClient().invalidateQueries({ queryKey: keys.all({}) })
        },
      }),
  },
})
