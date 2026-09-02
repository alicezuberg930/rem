import { UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCustomers } from './customer-provider'
import { CustomersExportButton } from './customers-export-button'

export function CustomersPrimaryButtons() {
  const { setOpen } = useCustomers()

  return (
    <div className='flex gap-2'>
      <CustomersExportButton />
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Add customer</span>
        <UserPlus size={18} />
      </Button>
    </div>
  )
}
