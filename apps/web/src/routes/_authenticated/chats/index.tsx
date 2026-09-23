import { createFileRoute } from '@tanstack/react-router'
import { Chats } from '@/features/chats'
import { ChatProvider } from '@/features/chats/components/chat-provider'

export const Route = createFileRoute('/_authenticated/chats/')({
  component: () => (
    <ChatProvider>
      <Chats />
    </ChatProvider>
  ),
})
