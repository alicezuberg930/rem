import { ClockInButton } from '@/layout/clock-in-button'
import { Header } from '@/layout/header'
import { Main } from '@/layout/main'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProductsDialogs } from './components/products-dialogs'
import { ProductsPrimaryButtons } from './components/products-primary-buttons'
import { ProductsProvider } from './components/products-provider'
import { ProductsTable } from './components/products-table'

export function Products() {
  return (
    <ProductsProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>Products List</h2>
            <p className='text-muted-foreground'>
              Manage products, pricing, and variants.
            </p>
          </div>
          <ProductsPrimaryButtons />
        </div>
        <ProductsTable />
      </Main>

      <ProductsDialogs />
    </ProductsProvider>
  )
}
