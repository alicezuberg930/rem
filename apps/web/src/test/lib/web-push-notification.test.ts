import { beforeEach, describe, expect, it, vi } from 'vitest'
import { registerPushNotification } from '@/lib/web-push-notification'

const repositoryMocks = vi.hoisted(() => ({
  post: vi.fn(),
  delete: vi.fn(),
}))

vi.mock('@/lib/constants', () => ({
  notificationOptions: {
    url: '/notification-sw.js',
    options: { scope: '/', updateViaCache: 'none' },
  },
  pushNotificationKey: 'web-push-notification-key',
  vapidKey: 'AQIDBA',
}))

vi.mock('@/lib/repository/http-client', () => ({
  httpClient: repositoryMocks,
}))

describe('web push registration', () => {
  beforeEach(() => {
    repositoryMocks.post.mockReset()
    repositoryMocks.delete.mockReset()
  })

  it('replaces the browser subscription and removes the stale server row', async () => {
    const oldSubscription = {
      options: {
        applicationServerKey: new Uint8Array([9, 8, 7, 6]).buffer,
      },
      unsubscribe: vi.fn().mockResolvedValue(true),
    }
    const newSubscription = {
      options: {
        applicationServerKey: new Uint8Array([1, 2, 3, 4]).buffer,
      },
      unsubscribe: vi.fn().mockResolvedValue(true),
    }
    const pushManager = {
      getSubscription: vi.fn().mockResolvedValue(oldSubscription),
      subscribe: vi.fn().mockResolvedValue(newSubscription),
    }
    const registration = {
      active: { postMessage: vi.fn() },
      pushManager,
    }

    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: {
        register: vi.fn().mockResolvedValue(registration),
        ready: Promise.resolve(registration),
      },
    })
    vi.stubGlobal('Notification', {
      permission: 'granted',
      requestPermission: vi.fn().mockResolvedValue('granted'),
    })
    localStorage.setItem('web-push-notification-key', 'stale-id')
    repositoryMocks.delete.mockResolvedValue({ data: null })
    repositoryMocks.post.mockResolvedValue({ data: 'current-id' })

    const result = await registerPushNotification()

    expect(result).toBe(true)
    expect(repositoryMocks.delete).toHaveBeenCalledWith(
      '/notifications/push-notification/unsubscribe/stale-id'
    )
    expect(oldSubscription.unsubscribe).toHaveBeenCalledOnce()
    expect(pushManager.subscribe).toHaveBeenCalledWith({
      userVisibleOnly: true,
      applicationServerKey: new Uint8Array([1, 2, 3, 4]),
    })
    expect(repositoryMocks.post).toHaveBeenCalledWith(
      '/notifications/push-notification/subscribe',
      newSubscription
    )
    expect(localStorage.getItem('web-push-notification-key')).toBe('current-id')
    expect(repositoryMocks.delete.mock.invocationCallOrder[0]).toBeLessThan(
      oldSubscription.unsubscribe.mock.invocationCallOrder[0]
    )
  })
})
