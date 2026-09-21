const vapidKey = import.meta.env.VITE_WEB_PUSH_PUBLIC_KEY

const pushNotificationKey = 'web-push-notification-key'

const notificationOptions = {
    url: "/notification-sw.js",
    options: { scope: "/", updateViaCache: "none" } as RegistrationOptions
}

const businessIdStorageKey = 'businessId'

const businessEvent = 'business-id-event'

const businessHeaderKey = 'X-Business-Id'

export { vapidKey, pushNotificationKey, notificationOptions, businessIdStorageKey, businessEvent, businessHeaderKey }