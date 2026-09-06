import { mutationOptions } from '@tanstack/react-query'
import type { ApiResponse } from '@/@types'
import { getCookie } from '../cookies'
import { httpClient } from '../repository/http-client'

export type UploadFileInput = {
  file: File
  subFolder?: string
}

export type UploadFilesInput = {
  files: File[]
  subFolder?: string
}

const keys = {
  upload: ['files', 'upload'] as const,
  uploadMany: ['files', 'upload-many'] as const,
}

const appendSubFolder = (formData: FormData, subFolder?: string) => {
  if (subFolder)
    formData.append('subFolder', `/${getCookie('X-Business-Id')}${subFolder}`)
}

export const files = () => ({
  upload: {
    mutationOptions: () =>
      mutationOptions({
        mutationKey: keys.upload,
        mutationFn: async ({ file, subFolder }: UploadFileInput) => {
          const formData = new FormData()
          appendSubFolder(formData, subFolder)
          formData.append('file', file, file.name)
          return await httpClient.post<ApiResponse<string>>(
            '/upload/single',
            formData
          )
        },
      }),
  },

  uploadMany: {
    mutationOptions: () =>
      mutationOptions({
        mutationKey: keys.uploadMany,
        mutationFn: async ({ files, subFolder }: UploadFilesInput) => {
          const formData = new FormData()
          appendSubFolder(formData, subFolder)
          files.forEach((file) => formData.append('files[]', file, file.name))
          return await httpClient.post<ApiResponse<string[]>>(
            '/upload/multiple',
            formData
          )
        },
      }),
  },
})
