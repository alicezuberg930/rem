import { queryOptions } from '@tanstack/react-query'
import { type ApiResponse } from '@/@types'
import {
  type ChatMessage,
  type ChatUser,
} from '@/@types'
import { httpClient } from '../repository/http-client'

export const CHAT_MESSAGE_LIMIT = 100

export const chatKeys = {
  users: (currentUserId?: string, businessId?: string) => ['chats', currentUserId ?? null, businessId ?? null, 'users'],
  messages: (
    otherUserId: string,
    currentUserId?: string,
    businessId?: string
  ) => ['chats', currentUserId ?? null, businessId ?? null, 'messages', otherUserId],
} as const

export const chatQueries = {
  users: (currentUserId?: string, businessId?: string) => queryOptions({
    queryKey: chatKeys.users(currentUserId, businessId),
    queryFn: async () => {
      const { data } = await httpClient.get<ApiResponse<ChatUser[]>>('/chats/users')
      return data
    },
  }),

  messages: (otherUserId: string, currentUserId?: string, businessId?: string) => queryOptions({
    queryKey: chatKeys.messages(otherUserId, currentUserId, businessId),
    staleTime: 0,
    queryFn: async () => {
      const { data } = await httpClient.get<ApiResponse<ChatMessage[]>>(
        `/chats/${encodeURIComponent(otherUserId)}/messages`,
        { limit: CHAT_MESSAGE_LIMIT }
      )
      return data
    },
  }),
}