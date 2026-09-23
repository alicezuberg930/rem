import { ClockInButton } from '@/layout/clock-in-button'
import { Header } from '@/layout/header'
import { Main } from '@/layout/main'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { VariantsDialogs } from './components/variants-dialogs'
import { VariantsPrimaryButtons } from './components/variants-primary-buttons'
import { VariantsProvider } from './components/variants-provider'
import { VariantsTable } from './components/variants-table'

export function Variants() {
  return (
    <VariantsProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>Variants List</h2>
            <p className='text-muted-foreground'>
              Manage product variants and their option values.
            </p>
          </div>
          <VariantsPrimaryButtons />
        </div>
        <VariantsTable />
      </Main>

      <VariantsDialogs />
    </VariantsProvider>
  )
}
