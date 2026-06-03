import { Navigate, useLocation } from '@tanstack/react-router'
import { useAuth } from '@/context/auth-provider'
import { UnauthorisedError } from '@/features/errors/unauthorized-error'
import { Spinner } from './ui/spinner'

type AuthGuardProps = {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, role, isInitialized } = useAuth()
  const { pathname } = useLocation()

  const unauthenticatedRoutes = ['/sign-in', '/sign-up', '/forgot-password']

  const dashboardRoutes = [
    '/',
    '/apps',
    '/tasks',
    '/chats',
    '/users',
    '/campaigns',
    '/templates',
    '/bookings',
    '/attendances',
    '/settings',
    '/settings/account',
    '/settings/appearance',
    '/settings/notifications',
    '/settings/display',
  ]

  const authenticatedRoutes = ['/businesses'].concat(dashboardRoutes)

  const authorizedRoutes: Record<string, string[]> = {
    OWNER: dashboardRoutes,
    MEMBER: dashboardRoutes,
  }

  if (unauthenticatedRoutes) return <> {children} </>

  if (!isInitialized) {
    return (
      <div className='flex h-screen w-full items-center justify-center'>
        <Spinner className='size-20' />
      </div>
    )
  }

  if (!isAuthenticated) {
    if (authenticatedRoutes.includes(pathname)) {
      return <Navigate to='/sign-in' />
    }
  }

  if (role && !authorizedRoutes[role.name].includes(pathname)) {
    return <UnauthorisedError />
  }

  return <> {children} </>
}
