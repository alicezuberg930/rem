import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import type { Lead } from '@/@types'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { leads } from '@/lib/queries/lead'
import { HttpError } from '@/lib/repository/http-error'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'

type LeadsDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Lead
}

export function LeadsDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: LeadsDeleteDialogProps) {
  const [value, setValue] = useState('')
  const remove = useMutation(leads().delete.mutationOptions())
  const email = currentRow.contact.email

  const handleDelete = () => {
    if (value.trim() !== email) return
    const submit = async () => {
      const response = await remove.mutateAsync(currentRow.id)
      setValue('')
      onOpenChange(false)
      return response
    }
    toast.promise(submit, {
      loading: 'Deleting lead',
      error: (error) =>
        error instanceof HttpError ? error.message : 'Internal server error',
      success: (response) => response.message,
    })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== email || remove.isPending}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          Delete lead
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Delete lead for{' '}
            <span className='font-bold'>
              {currentRow.contact.firstName} {currentRow.contact.lastName}
            </span>
            ? This action cannot be undone.
          </p>
          <Label className='my-2'>
            Contact email:
            <Input
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder='Enter contact email to confirm deletion.'
            />
          </Label>
          <Alert variant='destructive'>
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              This operation permanently removes the lead.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText='Delete'
      destructive
    />
  )
}
