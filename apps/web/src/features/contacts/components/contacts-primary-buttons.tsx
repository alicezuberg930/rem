import { UserPlus } from 'lucide-react'
import { contacts } from '@/lib/queries/contact'
import { Button } from '@/components/ui/button'
import { ExportExcelButton } from '@/components/export-excel-button'
import { useContacts } from './contacts-provider'

export function ContactsPrimaryButtons() {
  const { setOpen } = useContacts()

  return (
    <div className='flex gap-2'>
      <ExportExcelButton
        filename='contacts.xlsx'
        download={() => contacts().export.download()}
      />
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Add contact</span>
        <UserPlus size={18} />
      </Button>
    </div>
  )
}
