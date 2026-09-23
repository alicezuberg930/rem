import type { Variant } from '@/@types/variant'
import { Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type VariantPreviewDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Variant
}

export function VariantsPreviewDialog({
  open,
  onOpenChange,
  currentRow,
}: VariantPreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader className='text-start'>
          <DialogTitle className='flex items-center gap-2'>
            <Eye />
            {currentRow.name}
          </DialogTitle>
          <DialogDescription>
            Values available for this variant.
          </DialogDescription>
        </DialogHeader>

        <div className='flex flex-wrap gap-2 py-2'>
          {currentRow.options.map((option) => (
            <Badge key={option.id} variant='secondary'>
              {option.value}
            </Badge>
          ))}
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant='outline' />}>Close</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
