import { describe, expect, it } from 'vitest'
import { parseChatSocketEvent } from '@/features/chats/lib/chat-events'

describe('chat WebSocket events', () => {
  it('parses the initial online user snapshot', () => {
    expect(
      parseChatSocketEvent(
        JSON.stringify({
          type: 'PRESENCE_SNAPSHOT',
          onlineUserIds: ['user-1', 'user-2'],
        })
      )
    ).toEqual({
      type: 'PRESENCE_SNAPSHOT',
      onlineUserIds: ['user-1', 'user-2'],
    })
  })

  it('parses live presence changes', () => {
    expect(
      parseChatSocketEvent(
        JSON.stringify({
          type: 'PRESENCE_CHANGED',
          userId: 'user-1',
          online: false,
        })
      )
    ).toEqual({
      type: 'PRESENCE_CHANGED',
      userId: 'user-1',
      online: false,
    })
  })

  it('rejects malformed presence events', () => {
    expect(() =>
      parseChatSocketEvent(
        JSON.stringify({
          type: 'PRESENCE_SNAPSHOT',
          onlineUserIds: ['user-1', 2],
        })
      )
    ).toThrow('Invalid chat event')
  })
})
