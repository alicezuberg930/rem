import { LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTemplates } from './templates-provider'

export function TemplatesPrimaryButtons() {
  const { setOpen } = useTemplates()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Add template</span>
        <LayoutDashboard size={18} />
      </Button>
    </div>
  )
}
