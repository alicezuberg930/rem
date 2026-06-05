import { ConfigDrawer } from '@/components/config-drawer'
import { ClockInButton } from '@/components/layout/clock-in-button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { AttendancesProvider } from './components/attendances-provider'
import { AttendancesTable } from './components/attendances-table'

export function Attendances() {
  return (
    <AttendancesProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>Attendance List</h2>
            <p className='text-muted-foreground'>
              Manage your attendances here.
            </p>
          </div>
        </div>
        <AttendancesTable />
      </Main>

    </AttendancesProvider>
  )
}
