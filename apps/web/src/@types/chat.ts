export type ChatUser = {
  id: string
  fullname: string
  email: string
  avatar: string | null
}

export type ChatGroup = {
  id: string
  name: string
  avatar: string | null
  members: ChatUser[]
}

export type ChatMessage = {
  type: 'MESSAGE'
  id: string
  senderId: string
  recipientId?: string | null
  groupId?: string | null
  content: string
  createdAt: string
}

export type ChatSocketError = {
  type: 'ERROR'
  message: string
}

export type ChatPresenceSnapshot = {
  type: 'PRESENCE_SNAPSHOT'
  onlineUserIds: string[]
}

export type ChatPresenceChanged = {
  type: 'PRESENCE_CHANGED'
  userId: string
  online: boolean
}

export type ChatSocketEvent =
  | ChatMessage
  | ChatSocketError
  | ChatPresenceSnapshot
  | ChatPresenceChanged

export type SendChatMessage = {
  recipientId: string
  groupId?: never
  content: string
} | {
  recipientId?: never
  groupId: string
  content: string
}

export type ChatUserStatus = 'connected' | 'disconnected'
