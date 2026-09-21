import { useSyncExternalStore } from 'react'
import { businessEvent, businessIdStorageKey } from './constants'

export const getSelectedBusinessId = (): string | undefined => {
    if (typeof window === 'undefined') return undefined
    return localStorage.getItem(businessIdStorageKey) || undefined
}

const notifyBusinessChange = () => {
    window.dispatchEvent(new Event(businessEvent))
}

export const selectBusiness = (businessId: string) => {
    localStorage.setItem(businessIdStorageKey, businessId)
    notifyBusinessChange()
}

export const clearSelectedBusiness = () => {
    localStorage.removeItem(businessIdStorageKey)
    notifyBusinessChange()
}

const subscribeToBusinessChange = (onChange: () => void) => {
    const onStorage = (event: StorageEvent) => {
        if (event.key === businessIdStorageKey || event.key === null) onChange()
    }

    window.addEventListener(businessEvent, onChange)
    window.addEventListener('storage', onStorage)
    return () => {
        window.removeEventListener(businessEvent, onChange)
        window.removeEventListener('storage', onStorage)
    }
}

export const useSelectedBusinessId = () => {
    return useSyncExternalStore(subscribeToBusinessChange, getSelectedBusinessId, () => undefined)
}