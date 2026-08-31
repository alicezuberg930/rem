export type ChatUser = {
  id: string
  fullname: string
  email: string
  avatar: string | null
}

export type ChatMessage = {
  type: 'MESSAGE'
  id: string
  senderId: string
  recipientId: string
  content: string
  createdAt: string
}

export type ChatSocketError = {
  type: 'ERROR'
  message: string
}

export type ChatSocketEvent = ChatMessage | ChatSocketError

export type SendChatMessage = {
  recipientId: string
  content: string
}
