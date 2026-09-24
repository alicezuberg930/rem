import { type QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { AuthProvider } from '@/providers/auth-provider'
import { NotificationProvider } from '@/providers/notification-provider'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Toaster } from '@/components/ui/toast'
import { AuthGuard } from '@/components/auth-guard'
import { NavigationProgress } from '@/components/navigation-progress'
import { GeneralError } from '@/features/errors/general-error'
import { NotFoundError } from '@/features/errors/not-found-error'
import { ChatProvider } from '@/features/chats/components/chat-provider'

export type RootRouteContext = {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RootRouteContext>()({
  component: () => {
    return (
      <AuthProvider>
        <ChatProvider>
          <NotificationProvider>
            <AuthGuard>
              <NavigationProgress />
              <Outlet />
              <Toaster timeout={5000} />
              {import.meta.env.MODE === 'development' && (
                <>
                  <ReactQueryDevtools buttonPosition='bottom-left' />
                  <TanStackRouterDevtools position='bottom-right' />
                </>
              )}
            </AuthGuard>
          </NotificationProvider>
        </ChatProvider>
      </AuthProvider>
    )
  },
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
})
