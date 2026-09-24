export type Notification = {
  id: string
}

export type RealtimeNotification = {
  id: string
  businessId: string
  title: string
  content: string
  type: string
  time: string
  isRead: boolean
  toUserId: string
  uniqueKey: string | null
  createdAt: string
  updatedAt: string
}

export type NotificationSocketEvent = {
  type: 'NOTIFICATION'
  payload: RealtimeNotification
}
