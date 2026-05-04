import { HttpError } from './httpError'
import { InterceptorManager } from './interceptor'
import { ApiResponse } from '@/@types'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080/api/v1'

export class HttpClient {
    interceptors = {
        request: new InterceptorManager<RequestInit>(),
        response: new InterceptorManager<Error | HttpError>(),
    }

    private async fetchJson<T>(url: string, options: RequestInit = {}): Promise<T> {
        let config: RequestInit = {
            ...options,
            headers: {
                ...(options.body instanceof FormData ?
                    {} :
                    { 'Content-Type': 'application/json' }
                )
            }
        }
        for (const { onFulfilled } of this.interceptors.request.getHandlers()) {
            if (onFulfilled) config = await onFulfilled(config)
        }
        try {
            const response = await fetch(url, config)
            if (!response.ok) {
                const text = await response.text()
                let data: ApiResponse<null> | string
                try {
                    data = text ? JSON.parse(text) : null
                } catch {
                    data = text
                }
                const error = new HttpError(response.status, data instanceof Object ? data.message : data, data)
                // if error is due to authentication, handle it here (e.g., redirect to login)
                for (const { onRejected } of this.interceptors.response.getHandlers()) {
                    if (onRejected) onRejected(error)
                }
                throw error
            }
            let data = await response.json()
            for (const { onFulfilled } of this.interceptors.response.getHandlers()) {
                if (onFulfilled) data = await onFulfilled(data)
            }
            return data as T
        } catch (error: unknown) {
            for (const { onRejected } of this.interceptors.response.getHandlers()) {
                if (onRejected) onRejected(error)
            }
            if (!(error instanceof HttpError)) throw new HttpError(500, 'Internal Server Error')
            throw error
        }
    }

    get<T>(endpoint: string, params: Record<string, unknown> = {}, options?: RequestInit) {
        const queryParams = new URLSearchParams()
        for (const key in params) {
            const value = params[key]
            if (value !== undefined && value !== null) {
                if (Array.isArray(value)) {
                    queryParams.append(key, JSON.stringify(value))
                } else {
                    queryParams.append(key, String(value))
                }
            }
        }
        return this.fetchJson<T>(`${BASE_URL}${endpoint}?${queryParams.toString()}`, {
            method: 'GET',
            credentials: 'include',
            ...options,
        })
    }

    post<T>(endpoint: string, body?: unknown, options?: RequestInit) {
        return this.fetchJson<T>(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            credentials: 'include',
            body: body ? body instanceof FormData ? body : JSON.stringify(body) : undefined,
            ...options,
        })
    }

    put<T>(endpoint: string, body?: unknown, options?: RequestInit) {
        return this.fetchJson<T>(`${BASE_URL}${endpoint}`, {
            method: 'PUT',
            credentials: 'include',
            body: body ? body instanceof FormData ? body : JSON.stringify(body) : undefined,
            ...options,
        })
    }

    patch<T>(endpoint: string, body?: unknown, options?: RequestInit) {
        return this.fetchJson<T>(`${BASE_URL}${endpoint}`, {
            method: 'PATCH',
            credentials: 'include',
            body: body ? body instanceof FormData ? body : JSON.stringify(body) : undefined,
            ...options,
        })
    }

    delete<T>(endpoint: string, options?: RequestInit) {
        return this.fetchJson<T>(`${BASE_URL}${endpoint}`, {
            method: 'DELETE',
            credentials: 'include',
            ...options,
        })
    }
}

export const httpClient = new HttpClient()