import { useEffect, useRef } from 'react'
import {
  checkPermissionNotification,
  onMessageForeground,
  registerPushNotification,
} from '@/lib/web-push-notification'
import { toast } from '@/components/ui/toast'
import { useAuth } from './auth-provider'

const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isInitialized } = useAuth()
  const isRegisteringRef = useRef(false)

  useEffect(() => {
    const unsubscribeForegroundMessage = onMessageForeground((payload) => {
      const title = payload?.data?.title || payload?.title || 'Notification'
      const body = payload?.data?.body || payload?.body
      toast.message(title, { description: body })
    })
    return unsubscribeForegroundMessage
  }, [])

  useEffect(() => {
    if (!isInitialized || !isAuthenticated) {
      isRegisteringRef.current = false
      return
    }
    if (isRegisteringRef.current) return
    if (checkPermissionNotification() === 'denied') return
    isRegisteringRef.current = true
    registerPushNotification()
      .catch(() => {
        toast.error('Push notification registration failed.')
      })
      .finally(() => {
        isRegisteringRef.current = false
      })
  }, [isAuthenticated, isInitialized])

  return children
}

export { NotificationProvider }
