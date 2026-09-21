import { useNavigate } from '@tanstack/react-router'
import { ChevronsUpDown, Plus } from 'lucide-react'
import { useAuth } from '@/providers/auth-provider'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import { LazyLoadImage } from '../components/lazy-load-image'
import { useBusiness } from '@/hooks/use-business'

export function TeamSwitcher() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { isMobile } = useSidebar()
  const { businessId, selectBusiness } = useBusiness()
  const activeTeam = user?.businesses.find((business) => business.id === businessId)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size='lg'
                className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
              >
                <div className='relative aspect-square size-8 items-center justify-center overflow-hidden rounded-lg bg-sidebar-primary'>
                  <div className='relative h-48 w-full bg-gray-400'>
                    {activeTeam?.logoUrl && (
                      <LazyLoadImage
                        src={activeTeam?.logoUrl}
                        alt={activeTeam?.name}
                        className='object-cover'
                      />
                    )}
                  </div>
                </div>
                <div className='grid flex-1 text-start text-sm leading-tight'>
                  <span className='truncate font-semibold'>
                    {activeTeam?.name}
                  </span>
                  <span className='truncate text-xs'>
                    {activeTeam?.description}
                  </span>
                </div>
                <ChevronsUpDown className='ms-auto' />
              </SidebarMenuButton>
            }
          />
          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
            align='start'
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className='text-xs text-muted-foreground'>
                Teams
              </DropdownMenuLabel>
              {user?.businesses?.map((business, index) => (
                <DropdownMenuItem
                  key={business.name}
                  onClick={() => {
                    selectBusiness(business.id)
                    navigate({ to: '/' })
                  }}
                  className='gap-2 p-2'
                >
                  <div className='relative flex size-6 overflow-hidden rounded-sm border bg-gray-400'>
                    {business?.logoUrl && (
                      <LazyLoadImage
                        alt={business.name}
                        src={business.logoUrl}
                      />
                    )}
                  </div>
                  {business.name}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className='gap-2 p-2'>
                <div className='flex size-6 items-center justify-center rounded-md border bg-background'>
                  <Plus className='size-4' />
                </div>
                <div className='font-medium text-muted-foreground'>
                  Add team
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
