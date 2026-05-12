import { useAuth } from '@/context/auth-provider'
import { Navigate, useLocation } from '@tanstack/react-router'

type AuthGuardProps = {
    children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
    const { isAuthenticated, role, isInitialized } = useAuth()
    const { pathname } = useLocation()

    const dashboardRoutes = ["/", "/apps", "/chats", "/users", "/campaigns", "/templates", "/bookings", "/attendances", "/settings", "/settings/account", "/settings/appearance", "/settings/notifications", "/settings/display"]

    const authenticatedRoutes = ['/business'].concat(dashboardRoutes)

    const authorizedRoutes: Record<string, string[]> = {
        "OWNER": dashboardRoutes,
        "MEMBER": dashboardRoutes
    }

    if (!isInitialized) {
        return <></>
    }

    if (!isAuthenticated) {
        if (authenticatedRoutes.includes(pathname)) {
            return <Navigate to='/sign-in' />
        }
    }

    if (role && !authorizedRoutes[role.name].includes(pathname)) {
        return <Navigate to={'/401'} />
    }

    return <> {children} </>
}
