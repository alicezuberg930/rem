import { BitMatrix } from '@zxing/library'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  alpha,
  bitMatrixToCanvas,
  canvasToBlob,
  cn,
  encodeHtml,
  fileToCanvas,
  formatDuration,
  getCurrentLocation,
  getInitials,
  getPageNumbers,
  getWebsocketURL,
  playNotificationSound,
  sleep,
  slugify,
} from '@/lib/utils'

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.unstubAllEnvs()
})

describe('general utilities', () => {
  it('merges conditional and conflicting Tailwind classes', () => {
    expect(cn('px-2', undefined, 'px-4')).toBe('px-4')
  })

  it('resolves sleep after the requested delay', async () => {
    vi.useFakeTimers()
    const result = sleep(250)

    await vi.advanceTimersByTimeAsync(250)

    await expect(result).resolves.toBeUndefined()
  })

  it('encodes HTML-significant characters in code snippets', () => {
    expect(encodeHtml(`<button title="Tom & Jerry's">Save</button>`)).toBe(
      '&lt;button title=&quot;Tom &amp; Jerry&#39;s&quot;&gt;Save&lt;/button&gt;'
    )
  })

  it('preserves whitespace and characters that do not need encoding', () => {
    expect(encodeHtml('const answer = 42\n  return answer')).toBe(
      'const answer = 42\n  return answer'
    )
  })

  it.each([
    [1, 4, [1, 2, 3, 4]],
    [2, 10, [1, 2, 3, 4, '...', 10]],
    [5, 10, [1, '...', 4, 5, 6, '...', 10]],
    [9, 10, [1, '...', 7, 8, 9, 10]],
  ])('builds pagination for page %s of %s', (current, total, expected) => {
    expect(getPageNumbers(current, total)).toEqual(expected)
  })

  it('creates URL-friendly slugs and removes accents', () => {
    expect(slugify('  Café   au--lait!  ')).toBe('Cafe-au-lait')
    expect(slugify('')).toBe('')
  })

  it('adds alpha to hex and rgb colors with a safe fallback', () => {
    expect(alpha('#336699', 0.5)).toBe('rgba(51, 102, 153, 0.5)')
    expect(alpha('rgb(1, 2, 3)', 0.25)).toBe('rgba(1, 2, 3, 0.25)')
    expect(alpha('not-a-color', 1)).toBe('rgba(0, 0, 0, 1)')
  })

  it('returns at most two uppercase initials', () => {
    expect(getInitials('  Ada Lovelace Byron ')).toBe('AL')
    expect(getInitials('')).toBe('')
  })

  it.each([
    [0, '00:00'],
    [65, '01:05'],
    [3661, '1:01:01'],
  ])('formats %s seconds as %s', (duration, expected) => {
    expect(formatDuration(duration)).toBe(expected)
  })

  it('converts an HTTPS API URL to its WebSocket endpoint', () => {
    vi.stubEnv('VITE_API_URL', 'https://api.example.com/v1/')

    expect(getWebsocketURL()).toBe('wss://api.example.com/v1/ws/chat')
  })
})

describe('browser utilities', () => {
  it('resolves the current coordinates', async () => {
    const getCurrentPosition = vi.fn((success: PositionCallback) =>
      success({
        coords: { latitude: 10.5, longitude: 106.7 },
      } as GeolocationPosition)
    )
    Object.defineProperty(navigator, 'geolocation', {
      configurable: true,
      value: { getCurrentPosition },
    })

    await expect(getCurrentLocation()).resolves.toEqual({
      latitude: 10.5,
      longitude: 106.7,
    })
  })

  it('rejects when geolocation is unavailable', async () => {
    Object.defineProperty(navigator, 'geolocation', {
      configurable: true,
      value: undefined,
    })

    await expect(getCurrentLocation()).rejects.toThrow(
      'Geolocation is not supported'
    )
  })

  it('renders a bit matrix to a scaled canvas', () => {
    const fillRect = vi.fn()
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      fillRect,
      fillStyle: '',
    } as unknown as CanvasRenderingContext2D)
    const matrix = new BitMatrix(2, 2)
    matrix.set(1, 0)

    const canvas = bitMatrixToCanvas(matrix, 3)

    expect(canvas).toHaveProperty('width', 6)
    expect(canvas).toHaveProperty('height', 6)
    expect(fillRect).toHaveBeenCalledWith(3, 0, 3, 3)
  })

  it('converts a canvas to a PNG blob', async () => {
    const canvas = document.createElement('canvas')
    const blob = new Blob(['image'], { type: 'image/png' })
    vi.spyOn(canvas, 'toBlob').mockImplementation((callback, type) => {
      expect(type).toBe('image/png')
      callback(blob)
    })

    await expect(canvasToBlob(canvas)).resolves.toBe(blob)
  })

  it('draws a file image onto a canvas', async () => {
    const drawImage = vi.fn()
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      drawImage,
    } as unknown as CanvasRenderingContext2D)

    class ImageMock {
      naturalWidth = 320
      naturalHeight = 180
      onload: null | (() => void) = null
      onerror: null | (() => void) = null

      set src(_value: string) {
        queueMicrotask(() => this.onload?.())
      }
    }
    vi.stubGlobal('Image', ImageMock)

    const canvas = await fileToCanvas(new File(['image'], 'photo.png'))

    expect(canvas.width).toBe(320)
    expect(canvas.height).toBe(180)
    expect(drawImage).toHaveBeenCalledOnce()
  })

  it('reuses the notification audio element', async () => {
    const play = vi.fn().mockResolvedValue(undefined)
    const AudioMock = vi.fn(function (this: { currentTime: number }) {
      this.currentTime = 0
      return { currentTime: 0, play }
    })
    vi.stubGlobal('Audio', AudioMock)
    vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    vi.spyOn(console, 'log').mockImplementation(() => undefined)

    playNotificationSound()
    playNotificationSound()
    await Promise.resolve()

    expect(AudioMock).toHaveBeenCalledOnce()
    expect(play).toHaveBeenCalledTimes(2)
  })
})
