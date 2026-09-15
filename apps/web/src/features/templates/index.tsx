import { useState } from 'react'
import { ClockInButton } from '@/layout/clock-in-button'
import { Header } from '@/layout/header'
import { Main } from '@/layout/main'
import { CKEditor } from '@/components/ck-editor'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { TemplatesDialogs } from './components/templates-dialogs'
import { TemplatesPrimaryButtons } from './components/templates-primary-buttons'
import { TemplatesProvider } from './components/templates-provider'

export function Templates() {
  const [d, setD] = useState('')
  console.log(d)
  return (
    <TemplatesProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>Template List</h2>
            <p className='text-muted-foreground'>
              Manage your marketing templates here.
            </p>
          </div>
          <TemplatesPrimaryButtons />
        </div>
        <CKEditor
          initialData={''}
          onChange={(e: any) => {
            setD(e)
          }}
        />
        {/* <TemplatesTable /> */}
      </Main>

      <TemplatesDialogs />
    </TemplatesProvider>
  )
}
