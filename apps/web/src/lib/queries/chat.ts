import { queryOptions } from '@tanstack/react-query'
import {
  type ApiResponse,
  type ChatGroup,
  type ChatMessage,
  type ChatUser,
} from '@/@types'
import { httpClient } from '../repository/http-client'

export const CHAT_MESSAGE_LIMIT = 100

export const chatKeys = {
  users: (currentUserId?: string, businessId?: string) => [
    'chats',
    currentUserId ?? null,
    businessId ?? null,
    'users',
  ],
  groups: (currentUserId?: string, businessId?: string) => [
    'chats',
    currentUserId ?? null,
    businessId ?? null,
    'groups',
  ],
  allMessages: (currentUserId?: string, businessId?: string) => [
    'chats',
    currentUserId ?? null,
    businessId ?? null,
    'messages',
  ],
  messages: (
    otherUserId: string,
    currentUserId?: string,
    businessId?: string
  ) => [
    ...chatKeys.allMessages(currentUserId, businessId),
    'direct',
    otherUserId,
  ],
  groupMessages: (
    groupId: string,
    currentUserId?: string,
    businessId?: string
  ) => [...chatKeys.allMessages(currentUserId, businessId), 'group', groupId],
} as const

export const chatQueries = {
  users: (currentUserId?: string, businessId?: string) =>
    queryOptions({
      queryKey: chatKeys.users(currentUserId, businessId),
      queryFn: async () => {
        const { data } = await httpClient.get<ApiResponse<ChatUser[]>>(
          '/users/get',
          { isChat: true }
        )
        return data
      },
    }),

  groups: (currentUserId?: string, businessId?: string) =>
    queryOptions({
      queryKey: chatKeys.groups(currentUserId, businessId),
      queryFn: async () => {
        const { data } =
          await httpClient.get<ApiResponse<ChatGroup[]>>('/group')
        return data
      },
    }),

  messages: (
    otherUserId: string,
    currentUserId?: string,
    businessId?: string
  ) =>
    queryOptions({
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

  groupMessages: (
    groupId: string,
    currentUserId?: string,
    businessId?: string
  ) =>
    queryOptions({
      queryKey: chatKeys.groupMessages(groupId, currentUserId, businessId),
      staleTime: 0,
      queryFn: async () => {
        const { data } = await httpClient.get<ApiResponse<ChatMessage[]>>(
          `/chats/group/${encodeURIComponent(groupId)}/messages`,
          { limit: CHAT_MESSAGE_LIMIT }
        )
        return data
      },
    }),
}
