import type { User } from '@/@types'

export type StorageOwner = Partial<User>

type StorageBaseItem = {
  id: string
  name: string
  updatedAt: string
  owner: StorageOwner
  starred?: boolean
  shared?: boolean
}

export type StorageFile = StorageBaseItem & {
  type: 'file'
  fileType: 'document' | 'spreadsheet' | 'image' | 'video' | 'archive' | 'pdf'
  size: number
}

export type StorageFolder = StorageBaseItem & {
  type: 'folder'
  children: StorageItem[]
}

export type StorageItem = StorageFile | StorageFolder
