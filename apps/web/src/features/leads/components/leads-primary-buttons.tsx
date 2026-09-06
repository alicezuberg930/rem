import { UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLeads } from './leads-provider'

export function LeadsPrimaryButtons() {
  const { setOpen } = useLeads()

  return (
    <Button className='space-x-1' onClick={() => setOpen('add')}>
      <span>Add lead</span>
      <UserPlus size={18} />
    </Button>
  )
}
