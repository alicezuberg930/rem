import { beforeEach, describe, expect, it, vi } from 'vitest'
import { businessHeaderKey, businessIdStorageKey } from '@/lib/constants'
import { HttpClient } from '@/lib/repository/http-client'
import type { HttpError } from '@/lib/repository/http-error'

describe('HttpClient', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('serializes GET parameters and adds the selected business header', async () => {
    localStorage.setItem(businessIdStorageKey, 'business-1')
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(
        new Response(JSON.stringify({ data: ['one'] }), { status: 200 })
      )
    const client = new HttpClient()

    await expect(
      client.get('https://api.example.com/items', {
        page: 2,
        tags: ['active', 'new'],
        ignored: null,
      })
    ).resolves.toEqual({ data: ['one'] })

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.com/items?page=2&tags=%5B%22active%22%2C%22new%22%5D',
      expect.objectContaining({
        method: 'GET',
        credentials: 'include',
        headers: expect.objectContaining({
          [businessHeaderKey]: 'business-1',
          'Content-Type': 'application/json',
        }),
      })
    )
  })

  it('serializes JSON request bodies', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(JSON.stringify({ ok: true })))
    const client = new HttpClient()

    await client.post('https://api.example.com/items', { name: 'New item' })

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.com/items',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ name: 'New item' }),
      })
    )
  })

  it('runs request and response interceptors', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        headers: { 'x-request-id': 'request-1' },
      })
    )
    const client = new HttpClient()
    const responseInterceptor = vi.fn()
    client.interceptors.request.use((config) => ({
      ...config,
      headers: { ...config.headers, Authorization: 'Bearer token' },
    }))
    client.interceptors.response.use(responseInterceptor)

    await client.get('https://api.example.com/items')

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer token' }),
      })
    )
    expect(responseInterceptor).toHaveBeenCalledWith(
      expect.objectContaining({ data: { ok: true } })
    )
  })

  it('throws an HttpError and notifies rejection interceptors once', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ message: 'Invalid request' }), {
        status: 422,
      })
    )
    const client = new HttpClient()
    const onRejected = vi.fn()
    client.interceptors.response.use(undefined, onRejected)

    const request = client.get('https://api.example.com/items')

    await expect(request).rejects.toMatchObject<HttpError>({
      name: 'HttpError',
      status: 422,
      message: 'Invalid request',
    })
    expect(onRejected).toHaveBeenCalledOnce()
  })

  it('normalizes network failures to an internal server error', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('offline'))
    const client = new HttpClient()

    await expect(
      client.get('https://api.example.com/items')
    ).rejects.toMatchObject({ status: 500, message: 'Internal Server Error' })
  })
})
