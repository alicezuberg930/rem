import { describe, expect, it, vi } from 'vitest'
import {
  clearSelectedBusiness,
  getSelectedBusinessId,
  selectBusiness,
} from '@/lib/business'
import { parseChatSocketEvent } from '@/lib/chat-events'
import { businessEvent, businessIdStorageKey } from '@/lib/constants'
import { getCookie, removeCookie } from '@/lib/cookies'
import {
  bgBlur,
  bgGradient,
  filterStyles,
  hideScrollbarX,
  hideScrollbarY,
  textGradient,
} from '@/lib/css-styles'
import {
  fCurrency,
  fData,
  fNumber,
  fPercent,
  fShortenNumber,
} from '@/lib/format-number'
import { HttpError } from '@/lib/repository/http-error'
import { InterceptorManager } from '@/lib/repository/interceptor'

describe('number formatting', () => {
  it('formats numbers, currency, percentages, compact values, and data sizes', () => {
    expect(fNumber(1234567)).toBe('1,234,567')
    expect(fCurrency(1234)).toBe('1.234đ')
    expect(fPercent(12.5)).toBe('12.5%')
    expect(fShortenNumber(1_500_000)).toBe('1.50m')
    expect(fData(1536)).toBe('1.5 KB')
  })

  it.each([fNumber, fCurrency, fPercent, fShortenNumber, fData])(
    'returns an empty string for a missing value',
    (formatter) => {
      expect(formatter(null)).toBe('')
    }
  )

  it('preserves zero as a valid value', () => {
    expect(fNumber(0)).toBe('0')
    expect(fPercent(0)).toBe('0%')
    expect(fData(0)).toBe('0 B')
  })
})

describe('CSS helpers', () => {
  it('creates backdrop blur styles with and without an image', () => {
    expect(bgBlur({ color: '#336699', opacity: 0.5, blur: 10 })).toEqual({
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      backgroundColor: 'rgba(51, 102, 153, 0.5)',
    })
    expect(bgBlur({ imgUrl: '/cover.jpg' })).toMatchObject({
      position: 'relative',
      backgroundImage: 'url(/cover.jpg)',
    })
  })

  it('creates gradient, text, filter, and scrollbar styles', () => {
    expect(
      bgGradient({ direction: 'to right', startColor: 'red', endColor: 'blue' })
    ).toEqual({ background: 'linear-gradient(to right, red, blue)' })
    expect(textGradient('red, blue')).toHaveProperty(
      'background',
      '-webkit-linear-gradient(red, blue)'
    )
    expect(filterStyles('blur(2px)')).toEqual({
      filter: 'blur(2px)',
      WebkitFilter: 'blur(2px)',
      MozFilter: 'blur(2px)',
    })
    expect(hideScrollbarX.overflowX).toBe('scroll')
    expect(hideScrollbarY.overflowY).toBe('scroll')
  })
})

describe('browser storage helpers', () => {
  it('reads and removes cookies', () => {
    document.cookie = 'session=abc123; path=/'
    expect(getCookie('session')).toBe('abc123')

    removeCookie('session')

    expect(getCookie('session')).toBeUndefined()
  })

  it('selects and clears a business while notifying subscribers', () => {
    const listener = vi.fn()
    window.addEventListener(businessEvent, listener)

    selectBusiness('business-1')
    expect(localStorage.getItem(businessIdStorageKey)).toBe('business-1')
    expect(getSelectedBusinessId()).toBe('business-1')

    clearSelectedBusiness()
    expect(getSelectedBusinessId()).toBeUndefined()
    expect(listener).toHaveBeenCalledTimes(2)

    window.removeEventListener(businessEvent, listener)
  })
})

describe('chat event parsing', () => {
  it('parses messages and presence events', () => {
    expect(
      parseChatSocketEvent(
        JSON.stringify({
          type: 'MESSAGE',
          id: 'message-1',
          senderId: 'user-1',
          recipientId: 'user-2',
          content: 'Hello',
          createdAt: '2026-01-01T00:00:00Z',
        })
      )
    ).toMatchObject({ type: 'MESSAGE', content: 'Hello' })
    expect(
      parseChatSocketEvent(
        JSON.stringify({
          type: 'PRESENCE_CHANGED',
          userId: 'user-1',
          online: true,
        })
      )
    ).toEqual({ type: 'PRESENCE_CHANGED', userId: 'user-1', online: true })
  })

  it('rejects malformed events', () => {
    expect(() => parseChatSocketEvent('{"type":"MESSAGE"}')).toThrow(
      'Invalid chat event'
    )
    expect(() => parseChatSocketEvent('not-json')).toThrow()
  })
})

describe('repository primitives', () => {
  it('preserves HTTP error details', () => {
    const error = new HttpError(422, 'Invalid input', { field: 'name' })

    expect(error).toBeInstanceOf(Error)
    expect(error.name).toBe('HttpError')
    expect(error.status).toBe(422)
    expect(error.data).toEqual({ field: 'name' })
  })

  it('registers interceptors in insertion order', () => {
    const manager = new InterceptorManager<string>()
    const first = vi.fn((value: string) => `${value}-first`)
    const second = vi.fn((value: string) => `${value}-second`)

    expect(manager.use(first)).toBe(0)
    expect(manager.use(second)).toBe(1)
    expect(manager.getHandlers()).toEqual([
      { onFulfilled: first, onRejected: undefined },
      { onFulfilled: second, onRejected: undefined },
    ])
  })
})
