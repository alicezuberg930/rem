import { ConfigDrawer } from '@/components/config-drawer'
import { ClockInButton } from '@/components/layout/clock-in-button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ContactsDialogs } from './components/contacts-dialogs'
import { ContactsPrimaryButtons } from './components/contacts-primary-buttons'
import { ContactsProvider } from './components/contacts-provider'
import { ContactsTable } from './components/contacts-table'

export function Contacts() {
  return (
    <ContactsProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>
              Contact Management
            </h2>
            <p className='text-muted-foreground'>
              Manage contacts for the current business.
            </p>
          </div>
          <ContactsPrimaryButtons />
        </div>
        <ContactsTable />
      </Main>
      <ContactsDialogs />
    </ContactsProvider>
  )
}
