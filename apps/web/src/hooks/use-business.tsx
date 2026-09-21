import { useSyncExternalStore } from 'react'
import { businessEvent, businessIdStorageKey } from '@/lib/constants'

export const useBusiness = () => {
    const getSelectedBusinessId = (): string | undefined => {
        if (typeof window === 'undefined') return undefined
        return localStorage.getItem(businessIdStorageKey) || undefined
    }

    const selectBusiness = (businessId: string) => {
        localStorage.setItem(businessIdStorageKey, businessId)
        window.dispatchEvent(new Event(businessEvent))
    }

    const clearSelectedBusiness = () => {
        localStorage.removeItem(businessIdStorageKey)
        window.dispatchEvent(new Event(businessEvent))
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

    return {
        businessId: useSyncExternalStore(subscribeToBusinessChange, getSelectedBusinessId, () => undefined),
        selectBusiness,
        clearSelectedBusiness
    }
}