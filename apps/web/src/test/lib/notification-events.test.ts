import { describe, expect, it } from 'vitest'
import { parseNotificationSocketEvent } from '@/lib/notification-events'

const notification = {
  id: 'notification-1',
  businessId: 'business-1',
  title: 'Task assigned',
  content: 'Review the task',
  type: '4',
  time: '2026-09-24T09:00:00',
  isRead: false,
  toUserId: 'user-1',
  uniqueKey: 'task-assigned',
  createdAt: '2026-09-24T09:00:00',
  updatedAt: '2026-09-24T09:00:00',
}

describe('notification WebSocket events', () => {
  it('parses a realtime notification payload', () => {
    expect(
      parseNotificationSocketEvent(
        JSON.stringify({ type: 'NOTIFICATION', payload: notification })
      )
    ).toEqual({ type: 'NOTIFICATION', payload: notification })
  })

  it('ignores non-notification events from the shared socket', () => {
    expect(
      parseNotificationSocketEvent(
        JSON.stringify({ type: 'PRESENCE_SNAPSHOT', onlineUserIds: [] })
      )
    ).toBeNull()
  })

  it('rejects malformed notification payloads', () => {
    expect(() =>
      parseNotificationSocketEvent(
        JSON.stringify({
          type: 'NOTIFICATION',
          payload: { ...notification, isRead: 'false' },
        })
      )
    ).toThrow('Invalid notification event')
  })
})
