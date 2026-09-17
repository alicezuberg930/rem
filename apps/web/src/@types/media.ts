import type { Business } from './business'
import type { User } from './user'

export type MediaType = 'FILE' | 'FOLDER'

export type MediaStatus = 'ACTIVE' | 'TRASHED'

export type MediaPermissionType = 'VIEWER' | 'EDITOR'

export type Media = {
  id: string
  createdAt: string | null
  updatedAt: string | null
  business: Business
  owner: User
  storageKey: string
  name: string
  type: MediaType
  parent: Media | null
  size: number | null
  mimeType: string
  extension: string
  status: MediaStatus
  deletedAt: string | null
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
