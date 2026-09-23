import type { ChatMessage, ChatSocketEvent } from '@/@types'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const isChatMessage = (value: Record<string, unknown>): value is ChatMessage =>
  value.type === 'MESSAGE' &&
  typeof value.id === 'string' &&
  typeof value.senderId === 'string' &&
  (typeof value.recipientId === 'string' ||
    typeof value.groupId === 'string') &&
  typeof value.content === 'string' &&
  typeof value.createdAt === 'string'

export const parseChatSocketEvent = (payload: string): ChatSocketEvent => {
  const event: unknown = JSON.parse(payload)
  if (!isRecord(event)) throw new Error('Invalid chat event')
  if (isChatMessage(event)) return event
  if (event.type === 'ERROR' && typeof event.message === 'string') {
    return { type: 'ERROR', message: event.message }
  }
  if (
    event.type === 'PRESENCE_SNAPSHOT' &&
    Array.isArray(event.onlineUserIds) &&
    event.onlineUserIds.every((userId) => typeof userId === 'string')
  ) {
    return {
      type: 'PRESENCE_SNAPSHOT',
      onlineUserIds: event.onlineUserIds,
    }
  }
  if (
    event.type === 'PRESENCE_CHANGED' &&
    typeof event.userId === 'string' &&
    typeof event.online === 'boolean'
  ) {
    return {
      type: 'PRESENCE_CHANGED',
      userId: event.userId,
      online: event.online,
    }
  }
  throw new Error('Invalid chat event')
}
