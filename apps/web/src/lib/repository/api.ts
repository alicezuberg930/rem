import type { ApiResponse } from '@/@types'
import { getCookie } from '../cookies'
import { httpClient } from './http-client'

// file handling
export const uploadFile = async (
  file: File,
  subFolder?: string
): Promise<ApiResponse<string>> => {
  const formData = new FormData()
  if (subFolder)
    formData.append('subFolder', `/${getCookie('X-Business-Id')}${subFolder}`)
  formData.append('file', file, file.name)
  return await httpClient.post<ApiResponse<string>>('/upload/single', formData)
}

export const uploadFiles = async (
  files: File[],
  subFolder?: string
): Promise<ApiResponse<string[]>> => {
  const formData = new FormData()
  if (subFolder)
    formData.append('subFolder', `/${getCookie('X-Business-Id')}${subFolder}`)
  files.forEach((file) => formData.append('files[]', file, file.name))
  return await httpClient.post<ApiResponse<string[]>>(
    '/upload/multiple',
    formData
  )
}
