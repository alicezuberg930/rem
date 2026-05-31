import { Template } from '@/@types'
import { Eye } from 'lucide-react'
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

type UserInviteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Template
}

export function TemplatesPreviewDialog({
  open,
  onOpenChange,
  currentRow,
}: UserInviteDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        onOpenChange(state)
      }}
    >
      <DialogContent className='flex max-h-[90vh] flex-col sm:max-w-3xl'>
        <DialogHeader className='text-start'>
          <DialogTitle className='flex items-center gap-2'>
            <Eye />
            Preview Email Template
          </DialogTitle>
          <DialogDescription>
            Invite new user to join your team by sending them an email
            invitation. Assign a role to define their access level.
          </DialogDescription>
        </DialogHeader>
        <div className='min-h-0 flex-1 overflow-scroll wrap-break-word'>
          <div dangerouslySetInnerHTML={{ __html: currentRow.header }}></div>
          <div dangerouslySetInnerHTML={{ __html: currentRow.body }}></div>
          <div dangerouslySetInnerHTML={{ __html: currentRow.footer }}></div>
        </div>
        <DialogFooter className='gap-y-2'>
          <DialogClose>
            <Button variant='outline'>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
