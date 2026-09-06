import { UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCustomers } from './customer-provider'

export function CustomersPrimaryButtons() {
  const { setOpen } = useCustomers()

  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Add customer</span>
        <UserPlus size={18} />
      </Button>
    </div>
  )
}
