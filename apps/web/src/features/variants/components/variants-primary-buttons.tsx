import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useVariants } from './variants-provider'

export function VariantsPrimaryButtons() {
  const { setOpen } = useVariants()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Add variant</span>
        <Plus size={18} />
      </Button>
    </div>
  )
}
