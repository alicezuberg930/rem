import type { ApiResponse } from "@/@types"
import { notificationOptions, pushNotificationKey, vapidKey } from "./constants"
import { httpClient } from "./repository/http-client"

let isServiceWorkerReadyMessageSent = false

const isSwAvailable = () => {
    return typeof navigator !== "undefined" && "serviceWorker" in navigator
}

const checkPermissionNotification = () => {
    if (typeof window !== "undefined" && "Notification" in window) return Notification.permission
    return "unsupported"
}

const getWebPushNotificationKey = () => {
    if (typeof localStorage === "undefined") return null
    return localStorage.getItem(pushNotificationKey)
}

const urlBase64ToUint8Array = (base64String: string) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
    const rawData = atob(base64)
    return Uint8Array.from(rawData, (char) => char.charCodeAt(0))
}

const arrayBufferToBase64Url = (buffer: ArrayBuffer) => {
    const bytes = new Uint8Array(buffer || [])
    let binary = ""
    for (const byte of bytes)
        binary += String.fromCharCode(byte)
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

const notifyActiveServiceWorker = () => {
    if (!isSwAvailable() || isServiceWorkerReadyMessageSent) return
    isServiceWorkerReadyMessageSent = true
    navigator.serviceWorker.ready
        .then((registration) => {
            registration?.active?.postMessage?.({ type: "push-client-ready" })
        })
        .catch(() => {
            isServiceWorkerReadyMessageSent = false
        })
}

const onMessageForeground = (callback: (data: any) => void) => {
    if (!isSwAvailable()) return () => { }
    notifyActiveServiceWorker()
    if (typeof callback !== "function") return () => { }
    const handler = (event: MessageEvent) => {
        if (event.data?.type === "push-notification") {
            const data = {
                ...event.data.payload.data,
                data: {
                    refID: event.data.payload.refID,
                    metaData: event.data.payload.metaData,
                    time: event.data.payload.time,
                    uniqueKey: event.data.payload.uniqueKey,
                    title: event.data.payload.title || "",
                    body: event.data.payload.body || "",
                    icon: event.data.payload.icon || "/web-app-manifest-192x192.png",
                    link: event.data.payload.url || event.data.payload.link || "/",
                    type: String(event.data.payload.type),
                },
            }
            callback(data)
        }
    }
    navigator.serviceWorker.addEventListener("message", handler)
    return () => navigator.serviceWorker.removeEventListener("message", handler)
}

const requestNotificationPermission = async () => {
    const permission = checkPermissionNotification()
    if (permission === "unsupported") return "unsupported"
    return permission === "granted" ? permission : Notification.requestPermission()
}

const registerNotificationServiceWorker = async () => {
    if (!isSwAvailable()) return null
    const registration = await navigator.serviceWorker.register(notificationOptions.url, notificationOptions.options)
    return registration.active ? registration : await navigator.serviceWorker.ready
}

const getNotificationServiceWorkerRegistration = async () => {
    if (!isSwAvailable()) return null
    return (
        await navigator.serviceWorker.getRegistration(notificationOptions.options.scope) ||
        await navigator.serviceWorker.getRegistration(notificationOptions.url)
    )
}

const isSameVapidSubscription = (subscription: PushSubscription) => {
    if (!subscription?.options?.applicationServerKey) return false
    return arrayBufferToBase64Url(subscription.options.applicationServerKey) === vapidKey
}

const getOrCreatePushSubscription = async (registration: ServiceWorkerRegistration): Promise<PushSubscription> => {
    let subscription = await registration.pushManager.getSubscription()
    if (subscription && !isSameVapidSubscription(subscription)) {
        await subscription.unsubscribe()
        subscription = null
    }
    return subscription || registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
    })
}

const registerPushNotification = async () => {
    const permission = await requestNotificationPermission()
    if (permission !== "granted") return false
    const registration = await registerNotificationServiceWorker()
    if (!registration?.pushManager) return false
    const subscription = await getOrCreatePushSubscription(registration)
    try {
        const response = await httpClient.post<ApiResponse<string>>("/notifications/push-notification/subscribe", subscription)
        if (!response?.data) return false
        localStorage.setItem(pushNotificationKey, response.data)
        notifyActiveServiceWorker()
        return true
    } catch (err) {
        return false
    }
}

const unRegisterPushNotification = async () => {
    if (!isSwAvailable()) return true
    const id = getWebPushNotificationKey()
    localStorage.removeItem(pushNotificationKey)
    if (id) await httpClient.delete(`/notifications/push-notification/unsubscribe/${id}`)
    try {
        const registration = await getNotificationServiceWorkerRegistration()
        const subscription = await registration?.pushManager?.getSubscription()
        await subscription?.unsubscribe()
    } catch { }
    return true
}

export {
    onMessageForeground,
    checkPermissionNotification,
    isSwAvailable,
    getWebPushNotificationKey,
    registerPushNotification,
    unRegisterPushNotification,
}
