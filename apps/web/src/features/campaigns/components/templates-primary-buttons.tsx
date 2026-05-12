import { LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCampaigns } from './campaign-provider'

export function TemplatesPrimaryButtons() {
  const { setOpen } = useCampaigns()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Add campaign</span>
        <LayoutDashboard size={18} />
      </Button>
    </div>
  )
}
