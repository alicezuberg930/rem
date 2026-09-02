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

export type ChatSocketEvent = ChatMessage | ChatSocketError

export type SendChatMessage =
  | {
      recipientId: string
      groupId?: never
      content: string
    }
  | {
      recipientId?: never
      groupId: string
      content: string
    }
