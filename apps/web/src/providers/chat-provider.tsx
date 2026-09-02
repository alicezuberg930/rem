import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  type ChatMessage,
  type ChatSocketEvent,
  type SendChatMessage,
} from '@/@types'
import { toast } from 'sonner'
import { getCookie } from '@/lib/cookies'
import { chatKeys } from '@/lib/queries/chat'
import { useAuth } from '@/providers/auth-provider'

export type ChatSocketStatus = 'connecting' | 'connected' | 'disconnected'

type ChatContextValue = {
  businessId?: string
  status: ChatSocketStatus
  sendMessage: (message: SendChatMessage) => boolean
}

const ChatContext = createContext<ChatContextValue | null>(null)

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const isChatMessage = (value: Record<string, unknown>): value is ChatMessage =>
  value.type === 'MESSAGE' &&
  typeof value.id === 'string' &&
  typeof value.senderId === 'string' &&
  (typeof value.recipientId === 'string' || typeof value.groupId === 'string') &&
  typeof value.content === 'string' &&
  typeof value.createdAt === 'string'

const parseSocketEvent = (payload: string): ChatSocketEvent => {
  const event: unknown = JSON.parse(payload)
  if (!isRecord(event)) throw new Error('Invalid chat event')
  if (isChatMessage(event)) return event
  if (event.type === 'ERROR' && typeof event.message === 'string') {
    return { type: 'ERROR', message: event.message }
  }
  throw new Error('Invalid chat event')
}

const getChatWebSocketUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL
  const url = new URL(apiUrl, window.location.origin)

  if (url.protocol === 'http:') url.protocol = 'ws:'
  else if (url.protocol === 'https:') url.protocol = 'wss:'
  else if (url.protocol !== 'ws:' && url.protocol !== 'wss:') {
    throw new Error('VITE_API_URL must use HTTP or HTTPS')
  }

  url.pathname = `${url.pathname.replace(/\/+$/, '')}/ws/chat`
  url.search = ''
  url.hash = ''
  return url.toString()
}

const mergeMessage = (messages: ChatMessage[], message: ChatMessage) => {
  const existingIndex = messages.findIndex(({ id }) => id === message.id)
  const nextMessages = [...messages]

  if (existingIndex === -1) nextMessages.push(message)
  else nextMessages[existingIndex] = message

  return nextMessages.sort((left, right) =>
    left.createdAt.localeCompare(right.createdAt)
  )
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const currentUserId = user?.id
  const [businessId, setBusinessId] = useState(() => getCookie('X-Business-Id'))
  const [status, setStatus] = useState<ChatSocketStatus>('connecting')
  const socketRef = useRef<WebSocket | null>(null)
  const enabled = Boolean(currentUserId && businessId)

  useEffect(() => {
    const handleBusinessChange = () => setBusinessId(getCookie('X-Business-Id'))

    window.addEventListener('business-id-change', handleBusinessChange)
    return () =>
      window.removeEventListener('business-id-change', handleBusinessChange)
  }, [])

  useEffect(() => {
    if (!currentUserId || !businessId) return

    let active = true
    let reconnectAttempt = 0
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined

    const handleMessage = (message: ChatMessage) => {
      if (message.groupId) {
        const queryKey = chatKeys.groupMessages(
          message.groupId,
          currentUserId,
          businessId
        )
        const cachedMessages = queryClient.getQueryData<ChatMessage[]>(queryKey)

        if (cachedMessages === undefined) {
          void queryClient.invalidateQueries({ queryKey })
          return
        }

        queryClient.setQueryData(
          queryKey,
          mergeMessage(cachedMessages, message)
        )
        return
      }

      if (!message.recipientId) return
      if (message.senderId !== currentUserId && message.recipientId !== currentUserId) {
        return
      }

      const otherUserId =
        message.senderId === currentUserId
          ? message.recipientId
          : message.senderId
      const queryKey = chatKeys.messages(otherUserId, currentUserId, businessId)
      const cachedMessages = queryClient.getQueryData<ChatMessage[]>(queryKey)

      if (cachedMessages === undefined) {
        void queryClient.invalidateQueries({ queryKey })
        return
      }

      queryClient.setQueryData(queryKey, mergeMessage(cachedMessages, message))
    }

    const connect = () => {
      if (!active) return

      let socket: WebSocket
      try {
        socket = new WebSocket(getChatWebSocketUrl())
      } catch (_error) {
        setStatus('disconnected')
        toast.error('Chat connection is not configured correctly')
        return
      }

      socketRef.current = socket

      socket.onopen = () => {
        if (!active || socketRef.current !== socket) return
        reconnectAttempt = 0
        setStatus('connected')
        void queryClient.invalidateQueries({
          queryKey: chatKeys.groups(currentUserId, businessId),
        })
        void queryClient.invalidateQueries({
          queryKey: chatKeys.allMessages(currentUserId, businessId),
        })
      }

      socket.onmessage = (event) => {
        if (!active) return
        try {
          const chatEvent = parseSocketEvent(String(event.data))
          if (chatEvent.type === 'ERROR') {
            void queryClient.invalidateQueries({
              queryKey: chatKeys.allMessages(currentUserId, businessId),
            })
            toast.error(chatEvent.message)
            return
          }
          handleMessage(chatEvent)
        } catch (_error) {
          toast.error('Received an invalid chat message')
        }
      }

      socket.onclose = () => {
        if (socketRef.current === socket) socketRef.current = null
        if (!active) return
        setStatus('disconnected')
        // set max connection relay
        const delay = Math.min(1_000 * 2 ** reconnectAttempt, 15_000)
        reconnectAttempt += 1
        reconnectTimer = setTimeout(() => {
          setStatus('connecting')
          connect()
        }, delay)
      }
    }

    queueMicrotask(() => {
      if (active) setStatus('connecting')
    })
    connect()

    return () => {
      active = false
      if (reconnectTimer) clearTimeout(reconnectTimer)
      const socket = socketRef.current
      socketRef.current = null
      if (socket && socket.readyState < WebSocket.CLOSING) socket.close(1000)
    }
  }, [businessId, currentUserId, queryClient])

  const sendMessage = useCallback(
    (message: SendChatMessage) => {
      const socket = socketRef.current
      if (!socket || socket.readyState !== WebSocket.OPEN) return false
      try {
        socket.send(JSON.stringify(message))
      } catch {
        return false
      }

      if (message.groupId && currentUserId && businessId) {
        const optimisticMessage: ChatMessage = {
          type: 'MESSAGE',
          id: `pending:${crypto.randomUUID()}`,
          senderId: currentUserId,
          groupId: message.groupId,
          content: message.content,
          createdAt: new Date().toISOString(),
        }
        const queryKey = chatKeys.groupMessages(
          message.groupId,
          currentUserId,
          businessId
        )
        queryClient.setQueryData<ChatMessage[]>(queryKey, (messages = []) =>
          mergeMessage(messages, optimisticMessage)
        )
      }

      return true
    },
    [businessId, currentUserId, queryClient]
  )

  const value = useMemo<ChatContextValue>(
    () => ({
      businessId,
      status: enabled ? status : 'disconnected',
      sendMessage,
    }),
    [businessId, enabled, sendMessage, status]
  )

  return <ChatContext value={value}>{children}</ChatContext>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useChat() {
  const context = useContext(ChatContext)
  if (!context) throw new Error('useChat must be used within a ChatProvider')
  return context
}
