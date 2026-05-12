import {
  defaultShouldDehydrateQuery,
  QueryCache,
  QueryClient,
  QueryClientProvider as QCP,
} from '@tanstack/react-query'
import { router } from '@/main'
import { toast } from 'sonner'
import { handleServerError } from '@/lib/handle-server-error'
import { HttpError } from '@/lib/repository/http-error'

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => {
          // eslint-disable-next-line no-console
          if (import.meta.env.DEV) console.log({ failureCount, error })

          if (failureCount >= 0 && import.meta.env.DEV) return false
          if (failureCount > 3 && import.meta.env.PROD) return false

          return !(
            error instanceof HttpError && [401, 403].includes(error.status ?? 0)
          )
        },
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 60 * 1000, // 60 minutes
        gcTime: 1000 * 60 * 60 * 1, // 1 hours (must be >= maxAge for persister)
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        refetchOnWindowFocus: false, // Disable refetch on window focus
        refetchOnReconnect: true, // Refetch when internet reconnects
        refetchOnMount: true, // Refetch when component mounts if data is stale
      },
      mutations: {
        onError: (error) => {
          handleServerError(error)

          if (error instanceof HttpError) {
            if (error.status === 304) {
              toast.error('Content not modified!')
            }
          }
        },
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      },
      hydrate: {},
    },
    queryCache: new QueryCache({
      onError: (error) => {
        if (error instanceof HttpError) {
          if (error.status === 401) {
            toast.error('Session expired!')
            const redirect = `${router.history.location.href}`
            router.navigate({ to: '/sign-in', search: { redirect } })
          }
          if (error.status === 500) {
            toast.error('Internal Server Error!')
            // Only navigate to error page in production to avoid disrupting HMR in development
            if (import.meta.env.PROD) {
              router.navigate({ to: '/500' })
            }
          }
          if (error.status === 403) {
          }
        }
      },
    }),
  })

let clientQueryClientSingleton: QueryClient | undefined = undefined

export const queryClient = () => {
  // Server: always return a new query client
  if (typeof globalThis === 'undefined') return createQueryClient()
  // Browser: reuse singleton to avoid creating new clients on every request
  clientQueryClientSingleton ??= createQueryClient()
  return clientQueryClientSingleton
}

export const QueryClientProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return <QCP client={queryClient()}>{children}</QCP>
}
