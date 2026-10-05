import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { ClockInButton } from '@/layout/clock-in-button'
import { Header } from '@/layout/header'
import { Main } from '@/layout/main'
import { users } from '@/lib/queries/user'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { UsersDialogs } from './components/users-dialogs'
import { UsersPrimaryButtons } from './components/users-primary-buttons'
import { UsersProvider } from './components/users-provider'
import { UsersTable } from './components/users-table'

const route = getRouteApi('/_authenticated/users/')

export function Users() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const {
    data,
    isPending: usersLoading,
    isError: usersError,
  } = useQuery(users().all.queryOptions())
  const { data: roles = [] } = useQuery(users().roles.queryOptions())
  return (
    <UsersProvider>
      <Header fixed>
        <Search />
        <ClockInButton />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>User List</h2>
            <p className='text-muted-foreground'>
              Manage your users and their roles here.
            </p>
          </div>
          <UsersPrimaryButtons />
        </div>
        <UsersTable
          data={data ?? []}
          roles={roles}
          search={search}
          navigate={navigate}
          isLoading={usersLoading}
          isError={usersError}
        />
      </Main>

      <UsersDialogs />
    </UsersProvider>
  )
}
