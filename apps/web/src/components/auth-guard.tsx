import { Navigate, useLocation } from '@tanstack/react-router'
import { useAuth } from '@/providers/auth-provider'
import { useSelectedBusinessId } from '@/lib/business'
import { UnauthorisedError } from '@/features/errors/unauthorized-error'
import { Spinner } from './ui/spinner'

const unauthenticatedRoutes = [
  '/sign-in',
  '/sign-up',
  '/forgot-password'
]

const dashboardRoutes = [
  '/',
  '/apps',
  '/tasks',
  '/chats',
  '/users',
  '/campaigns',
  '/templates',
  '/bookings',
  '/shipment-order',
  '/attendances',
  '/payroll',
  '/settings',
  '/settings/account',
  '/settings/appearance',
  '/settings/notifications',
  '/settings/display',
]

const authenticatedRoutes = ['/businesses'].concat(dashboardRoutes)

const authorizedRoutes: Record<string, string[]> = {
  OWNER: dashboardRoutes,
  HR: dashboardRoutes,
  ACCOUNTANT: dashboardRoutes,
}

type AuthGuardProps = {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, role, isInitialized } = useAuth()
  const businessId = useSelectedBusinessId()
  const { pathname } = useLocation()
  const routePath = pathname.replace(/\/+$/, '') || '/'

  if (!isInitialized) {
    return (
      <div className='flex h-screen w-full items-center justify-center'>
        <Spinner className='size-20' />
      </div>
    )
  }

  if (!isAuthenticated && authenticatedRoutes.includes(routePath)) {
    return <Navigate to='/sign-in' />
  }

  if (isAuthenticated && unauthenticatedRoutes.includes(pathname)) {
    if (businessId) {
      return <Navigate to='/' />
    } else {
      return <Navigate to='/businesses' />
    }
  }

  if (isAuthenticated && dashboardRoutes.includes(routePath) && !businessId) {
    return <Navigate to='/businesses' />
  }

  if (role && dashboardRoutes.includes(routePath) && !authorizedRoutes[role.name]?.includes(routePath)) {
    return <UnauthorisedError />
  }

  return <> {children} </>
}