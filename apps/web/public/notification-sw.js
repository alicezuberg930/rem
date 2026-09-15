const safeJsonParse = (value, fallback = {}) => {
    if (!value) return fallback
    if (typeof value === "object") return value
    try {
        return JSON.parse(value)
    } catch {
        return fallback
    }
}

const normalizePayload = (rawPayload) => {
    const raw = safeJsonParse(rawPayload)
    const data = safeJsonParse(raw.data)
    const type = raw.type !== undefined && raw.type !== null ? String(raw.type) : ""
    const icon = raw.icon ?? "/web-app-manifest-192x192.png"

    return {
        refID: data.refID,
        metaData: data.metaData,
        time: data.time,
        uniqueKey: data.uniqueKey,
        title: raw.title ?? "Thông báo",
        body: raw.body ?? "",
        icon: new URL(icon, self.location.origin).href,
        badge: new URL(raw.badge ?? icon, self.location.origin).href,
        link: raw.link ?? "/",
        type,
        data,
    }
}

const ROUTE_TYPE = {
    3: ({ refID, type }) => `/calendar?id=${refID ?? ""}&type=${type}`,
    4: ({ refID }) => `/tasks/pendingIssuance?id=${refID ?? ""}`,
    5: ({ refID, metaData }) => `/media/share-folder?typeShare=2&type=${metaData ?? ""}&parentId=${refID ?? ""}`,
    6: ({ refID, type }) => `/ratings/rankings?id=${refID ?? ""}&type=${type}`,
    8: ({ refID }) => `/monument-profile/view/${refID ?? ""}`,
    9: ({ refID, type }) => `/special-calendar?id=${refID ?? ""}&type=${type}`,
    10: ({ refID }) => `/chats?id=${refID ?? ""}`,
    11: ({ refID }) => `/templates/wordprocessing?id=${refID ?? ""}`,
}

const targetUrlForNotification = (payload) => {
    const type = Number(payload.type)
    let targetUrl = payload.link ?? "/"
    const routeBuilder = ROUTE_TYPE[type]
    if (routeBuilder) {
        targetUrl = routeBuilder(payload)
    } else if (type === 7 && payload.uniqueKey === "Staff") {
        targetUrl = "/documents/documentsPages"
    }
    return new URL(targetUrl, self.location.origin).href
}

self.addEventListener("push", (event) => {
    const rawPayload = event.data ? event.data.text() : "{}"
    const payload = normalizePayload(rawPayload)

    event.waitUntil((async () => {
        const clientsList = await clients.matchAll({
            type: "window",
            includeUncontrolled: true,
        })
        clientsList.forEach((client) => {
            client.postMessage({
                type: "push-notification",
                payload,
            })
        })
        await self.registration.showNotification(payload.title, {
            body: payload.body,
            icon: payload.icon,
            badge: payload.badge,
            data: {
                ...payload,
                link: targetUrlForNotification(payload),
            },
        })
    })())
})

self.addEventListener("notificationclick", (event) => {
    const targetUrl = event.notification.data?.link ?? "/"
    event.notification.close()
    event.waitUntil(
        clients
            .matchAll({
                type: "window",
                includeUncontrolled: true,
            })
            .then((clientList) => {
                for (const client of clientList) {
                    if (client.url === targetUrl && "focus" in client) {
                        return client.focus()
                    }
                }
                return clients.openWindow(targetUrl)
            }),
    )
})
