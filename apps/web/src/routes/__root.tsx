import { type QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Toaster } from '@/components/ui/sonner'
import { NavigationProgress } from '@/components/navigation-progress'
import { GeneralError } from '@/features/errors/general-error'
import { NotFoundError } from '@/features/errors/not-found-error'
import { AuthProvider } from '@/context/auth-provider'
import { AuthGuard } from '@/components/auth-guard'

export type RootRouteContext = {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RootRouteContext>()(
  {
    component: () => {
      return (
        <AuthProvider>
          <AuthGuard>
            <NavigationProgress />
            <Outlet />
            <Toaster duration={5000} />
            {import.meta.env.MODE === 'development' && (
              <>
                <ReactQueryDevtools buttonPosition='bottom-left' />
                <TanStackRouterDevtools position='bottom-right' />
              </>
            )}
          </AuthGuard>
        </AuthProvider>
      )
    },
    notFoundComponent: NotFoundError,
    errorComponent: GeneralError,
  }
)