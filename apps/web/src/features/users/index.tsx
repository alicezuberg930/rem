import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { ClockInButton } from '@/components/layout/clock-in-button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { UsersDialogs } from './components/users-dialogs'
import { UsersPrimaryButtons } from './components/users-primary-buttons'
import { UsersProvider } from './components/users-provider'
import { UsersTable } from './components/users-table'
import { users, type UserListResponse } from '@/lib/queries/user'
import { type User } from './data/schema'

const route = getRouteApi('/_authenticated/users/')

const toTableUser = (user: UserListResponse): User => {
  const nameParts = user.fullname.trim().split(/\s+/)
  const firstName = nameParts.shift() ?? user.fullname
  const lastName = nameParts.join(' ')
  const status = !user.isActive
    ? 'inactive'
    : user.membershipVerified
      ? 'active'
      : 'invited'

  return {
    id: user.id,
    firstName,
    lastName,
    username: user.email.split('@')[0],
    email: user.email,
    phoneNumber: user.phone,
    status,
    role: user.roleName.toLowerCase(),
    fullname: user.fullname,
    phone: user.phone,
    birthday: user.birthday,
    roleId: user.roleId,
    salary: user.salary,
    dependants: user.dependants,
    bankOwner: user.bankOwner,
    bankAccount: user.bankAccount,
    bankName: user.bankName,
    bankCode: user.bankCode,
    bankBranch: user.bankBranch,
    isActive: user.isActive,
    isVerified: user.isVerified,
  }
}

export function Users() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const {
    data: userResponses = [],
    isPending: usersLoading,
    isError: usersError,
  } = useQuery(users().all.queryOptions())
  const { data: roles = [] } = useQuery(users().roles.queryOptions())
  const tableUsers = userResponses.map(toTableUser)

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
          data={tableUsers}
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
