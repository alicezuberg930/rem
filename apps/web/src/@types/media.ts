import type { QueryPaginate } from '.'
import type { User } from './user'

export type MediaType = 'FILE' | 'FOLDER'

export type MediaStatus = 'ACTIVE' | 'TRASHED'

export type MediaPermissionType = 'VIEWER' | 'EDITOR'

export type Media = {
  id: string
  createdAt: string | null
  updatedAt: string | null
  deletedAt: string | null
  storageKey: string
  name: string
  type: MediaType
  parentId: string | null
  ownerId: string | null
  size: number | null
  mimeType: string
  extension: string
  status: MediaStatus
  owner: Partial<User>
}

export type MediaPermission = {
  id: string
  createdAt: string | null
  updatedAt: string | null
  media: Media
  user: User
  permission: MediaPermissionType
}

export type MediaShareLink = {
  id: string
  createdAt: string | null
  updatedAt: string | null
  media: Media
  createdByUser: User
  token: string
  permission: MediaPermissionType
  expiresAt: string | null
}

export type MediaQuery = QueryPaginate & {
  name?: string
  status?: MediaStatus
}

export type MediaUploadItem = {
  file: File
  relativePath: string
}

export type MediaUploadRequest = {
  items: MediaUploadItem[]
  parentId?: string | null
}
