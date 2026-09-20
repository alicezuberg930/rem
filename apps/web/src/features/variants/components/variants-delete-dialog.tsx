import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Template } from '@/@types'
import { AlertTriangle } from 'lucide-react'
import { toast } from '@/components/ui/toast'
import { templates } from '@/lib/queries/template'
import { HttpError } from '@/lib/repository/http-error'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'

type VariantDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Template
}

export function VariantsDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: VariantDeleteDialogProps) {
  const [value, setValue] = useState<string>('')
  const _delete = useMutation(templates().delete.mutationOptions())

  const handleDelete = () => {
    if (value.trim() !== currentRow.name) return
    const submit = async () => {
      const res = await _delete.mutateAsync(currentRow.id)
      onOpenChange(false)
      return res
    }
    toast.promise(submit, {
      loading: 'Deleting variant',
      error: (err) =>
        err instanceof HttpError ? err.message : 'Internal server error',
      success: (res) => res?.message,
    })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.name}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          Delete variant
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to delete{' '}
            <span className='font-bold'>{currentRow.name}</span>?
            <br />
            This action will permanently remove the variant from the system.
            This cannot be undone.
          </p>

          <Label className='my-2'>
            Variant name:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='Enter variant name to confirm deletion.'
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be careful, this operation can not be rolled back.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText='Delete'
      destructive
    />
  )
}
