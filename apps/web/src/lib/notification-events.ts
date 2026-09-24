import type { NotificationSocketEvent, RealtimeNotification } from '@/@types'

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null

const isRealtimeNotification = (value: unknown): value is RealtimeNotification => isRecord(value) &&
  typeof value.id === 'string' &&
  typeof value.businessId === 'string' &&
  typeof value.title === 'string' &&
  typeof value.content === 'string' &&
  typeof value.type === 'string' &&
  typeof value.time === 'string' &&
  typeof value.isRead === 'boolean' &&
  typeof value.toUserId === 'string' &&
  typeof value.uniqueKey === 'string' &&
  typeof value.createdAt === 'string' &&
  typeof value.updatedAt === 'string'

export const parseNotificationSocketEvent = (message: string): NotificationSocketEvent | null => {
  const event: unknown = JSON.parse(message)
  if (!isRecord(event) || event.type !== 'NOTIFICATION') return null
  if (!isRealtimeNotification(event.payload)) throw new Error('Invalid notification event')
  return { type: 'NOTIFICATION', payload: event.payload }
}