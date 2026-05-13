import { useNavigate } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { setCookie } from '@/lib/cookies'
import { useAuth } from '@/context/auth-provider'
import useDialogState from '@/hooks/use-dialog-state'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Typography } from '@/components/ui/typography'
import { LazyLoadImage } from '@/components/lazy-load-image'
import { NewBusinessDialog } from './components/new-business-dialog'

const roleColors: Record<string, string> = {
  Owner: 'bg-blue-100 text-blue-800',
  Member: 'bg-gray-100 text-gray-800',
  Developer: 'bg-purple-100 text-purple-800',
  Admin: 'bg-red-100 text-red-800',
}

export function Businesses() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [open, setOpen] = useDialogState<'add'>(null)

  const accessBusiness = async (businessId: string) => {
    setCookie('X-Business-Id', businessId)
    window.dispatchEvent(new Event('business-id-change'))
    navigate({ to: '/' })
  }

  return (
    <div className='p-4 md:p-8'>
      <Typography variant={'h5'}>Here is a list of your businesses</Typography>
      <div className='mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {user?.businesses?.map((business, index) => (
          <Card
            key={index}
            onClick={() => accessBusiness(business.id)}
            className='flex flex-col overflow-hidden pt-0 transition-shadow hover:shadow-md'
          >
            <div className='relative h-48 w-full bg-muted'>
              <LazyLoadImage
                src={business.logoUrl ?? '/assets/placeholder.webp'}
                alt={business.name}
                className='object-cover'
              />
            </div>
            <CardHeader>
              <div className='flex items-start justify-between gap-2'>
                <div className='flex-1'>
                  <CardTitle>{business.name}</CardTitle>
                </div>
                <Badge className={roleColors[business.role?.name!]}>
                  {business.role?.name}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className='flex-1'>
              <CardDescription className='line-clamp-3'>
                {business.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}

        <Card className='min-h-64 cursor-pointer bg-muted/50 p-0'>
          <Button
            onClick={() => setOpen('add')}
            variant='ghost'
            className='flex h-full w-full items-center justify-center'
          >
            <div className='flex flex-col items-center gap-3'>
              <Plus className='size-8' />
              <span>Create New Business</span>
            </div>
          </Button>
        </Card>
      </div>

      <NewBusinessDialog
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />
    </div>
  )
}
