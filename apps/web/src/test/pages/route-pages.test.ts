import { describe, expect, it, vi } from 'vitest'

const queryClient = vi.hoisted(() => ({
  invalidateQueries: vi.fn(),
}))

vi.mock('@/providers/query-provider', () => ({
  queryClient: () => queryClient,
  QueryClientProvider: ({ children }: { children: unknown }) => children,
}))

vi.mock('@/components/ck-editor', () => ({
  CKEditor: () => null,
}))

type RouteModule = {
  Route: {
    options: {
      component?: unknown
    }
  }
}

const pageModules = import.meta.glob<RouteModule>(
  [
    '../../routes/**/*.tsx',
    '!../../routes/__root.tsx',
    '!../../routes/**/route.tsx',
  ],
  { eager: false }
)

const pageEntries = Object.entries(pageModules).sort(([left], [right]) =>
  left.localeCompare(right)
)

describe('application page routes', () => {
  it('discovers the existing page route modules', () => {
    expect(pageEntries.length).toBeGreaterThan(30)
  })

  it.each(pageEntries)(
    '%s loads with a React page component',
    async (_, loadRoute) => {
      const routeModule = await loadRoute()

      expect(routeModule.Route).toBeDefined()
      expect(routeModule.Route.options.component).toEqual(expect.any(Function))
    }
  )
})
