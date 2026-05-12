import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { CampaignsProvider } from './components/campaign-provider'
import { CampaignsDialogs } from './components/campaigns-dialogs'
import { CampaignsTable } from './components/campaigns-table'
import { TemplatesPrimaryButtons } from './components/templates-primary-buttons'

export function Campaigns() {
  return (
    <CampaignsProvider>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Campaign List</h2>
            <p className='text-muted-foreground'>
              Manage your marketing campaigns here.
            </p>
          </div>
          <TemplatesPrimaryButtons />
        </div>
        <CampaignsTable />
      </Main>

      <CampaignsDialogs />
    </CampaignsProvider>
  )
}
