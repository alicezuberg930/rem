import { useEffect, useRef } from 'react'
import { useSelectedBusinessId } from '@/lib/business'
import { parseNotificationSocketEvent } from '@/lib/notification-events'
import { getWebsocketURL } from '@/lib/utils'
import {
  checkPermissionNotification,
  onMessageForeground,
  registerPushNotification,
} from '@/lib/web-push-notification'
import { toast } from '@/components/ui/toast'
import { useAuth } from './auth-provider'

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isInitialized } = useAuth()
  const businessId = useSelectedBusinessId()
  const isRegisteringRef = useRef(false)

  useEffect(() => {
    const unsubscribeForegroundMessage = onMessageForeground((payload) => {
      toast.message(payload.data.title)
    })
    return unsubscribeForegroundMessage
  }, [])

  useEffect(() => {
    if (!isInitialized || !isAuthenticated) {
      isRegisteringRef.current = false
      return
    }
    if (isRegisteringRef.current) return
    if (checkPermissionNotification() === 'granted') return
    isRegisteringRef.current = true
    registerPushNotification()
      .catch(() => {
        toast.error('Push notification registration failed.')
      })
      .finally(() => {
        isRegisteringRef.current = false
      })
  }, [isAuthenticated, isInitialized])

  useEffect(() => {
    if (!isInitialized || !isAuthenticated || !businessId) return

    let active = true
    let reconnectAttempt = 0
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined
    let socket: WebSocket | undefined

    const connect = () => {
      if (!active) return
      try {
        socket = new WebSocket(getWebsocketURL(), `business-id.${businessId}`)
      } catch (_error) {
        toast.error('Chat connection is not configured correctly')
        return
      }

      socket.onopen = () => { reconnectAttempt = 0 }

      socket.onmessage = (event) => {
        if (!active) return
        try {
          const notificationEvent = parseNotificationSocketEvent(String(event.data))
          if (!notificationEvent) return
          // console.log(
          //   'Realtime notification received:',
          //   notificationEvent.payload
          // )
        } catch {
          // Ignore chat and malformed frames on the shared endpoint.
        }
      }

      socket.onclose = () => {
        if (!active) return
        const delay = Math.min(1_000 * 2 ** reconnectAttempt, 15_000)
        reconnectAttempt += 1
        reconnectTimer = setTimeout(connect, delay)
      }
    }

    connect()

    return () => {
      active = false
      if (reconnectTimer) clearTimeout(reconnectTimer)
      if (socket && socket.readyState < WebSocket.CLOSING) socket.close(1000)
    }
  }, [businessId, isAuthenticated, isInitialized])

  return children
}
