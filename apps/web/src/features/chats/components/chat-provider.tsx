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
  type SendChatMessage,
  type ChatUserStatus
} from '@/@types'
import { toast } from '@/components/ui/toast'
import { parseChatSocketEvent } from '@/features/chats/lib/chat-events'
import { chatKeys } from '@/lib/queries/chat'
import { useAuth } from '@/providers/auth-provider'
import { useSelectedBusinessId } from '@/lib/business'

type ChatContextValue = {
  businessId?: string
  status: ChatUserStatus
  onlineUserIds: ReadonlySet<string>
  sendMessage: (message: SendChatMessage) => boolean
}

const ChatContext = createContext<ChatContextValue | null>(null)

const EMPTY_ONLINE_USER_IDS: ReadonlySet<string> = new Set()

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
  const businessId = useSelectedBusinessId()
  const [status, setStatus] = useState<ChatUserStatus>('disconnected')
  const [onlineUserIds, setOnlineUserIds] = useState<ReadonlySet<string>>(EMPTY_ONLINE_USER_IDS)
  const socketRef = useRef<WebSocket | null>(null)
  const enabled = Boolean(currentUserId && businessId)

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

      const otherUserId = message.senderId === currentUserId
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
        socket = new WebSocket(getChatWebSocketUrl(), `business-id.${businessId}`)
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
        if (!active || socketRef.current !== socket) return
        try {
          const chatEvent = parseChatSocketEvent(String(event.data))
          if (chatEvent.type === 'ERROR') {
            void queryClient.invalidateQueries({
              queryKey: chatKeys.allMessages(currentUserId, businessId),
            })
            toast.error(chatEvent.message)
            return
          }
          if (chatEvent.type === 'PRESENCE_SNAPSHOT') {
            setOnlineUserIds(new Set(chatEvent.onlineUserIds))
            return
          }
          if (chatEvent.type === 'PRESENCE_CHANGED') {
            setOnlineUserIds((currentOnlineUserIds) => {
              const nextOnlineUserIds = new Set(currentOnlineUserIds)
              if (chatEvent.online) nextOnlineUserIds.add(chatEvent.userId)
              else nextOnlineUserIds.delete(chatEvent.userId)
              return nextOnlineUserIds
            })
            return
          }
          handleMessage(chatEvent)
        } catch (_error) {
          toast.error('Received an invalid chat event')
        }
      }

      socket.onclose = () => {
        if (socketRef.current === socket) socketRef.current = null
        if (!active) return
        setStatus('disconnected')
        setOnlineUserIds(EMPTY_ONLINE_USER_IDS)
        // set max connection relay
        const delay = Math.min(1_000 * 2 ** reconnectAttempt, 15_000)
        reconnectAttempt += 1
        reconnectTimer = setTimeout(() => {
          setStatus('disconnected')
          connect()
        }, delay)
      }
    }

    queueMicrotask(() => {
      if (active) {
        setStatus('disconnected')
        setOnlineUserIds(EMPTY_ONLINE_USER_IDS)
      }
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
      onlineUserIds: enabled ? onlineUserIds : EMPTY_ONLINE_USER_IDS,
      sendMessage,
    }),
    [businessId, enabled, onlineUserIds, sendMessage, status]
  )

  return <ChatContext value={value}>{children}</ChatContext>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useChat() {
  const context = useContext(ChatContext)
  if (!context) throw new Error('useChat must be used within a ChatProvider')
  return context
}
