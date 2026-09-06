import { UserPlus } from 'lucide-react'
import { customers } from '@/lib/queries/customer'
import { Button } from '@/components/ui/button'
import { ExportExcelButton } from '@/components/export-excel-button'
import { useCustomers } from './customer-provider'

export function CustomersPrimaryButtons() {
  const { setOpen } = useCustomers()

  return (
    <div className='flex gap-2'>
      <ExportExcelButton
        filename='customers.xlsx'
        download={() => customers().export.download()}
      />
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Add customer</span>
        <UserPlus size={18} />
      </Button>
    </div>
  )
}
