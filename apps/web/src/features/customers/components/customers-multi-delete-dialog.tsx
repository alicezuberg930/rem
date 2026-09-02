import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import type { Table } from '@tanstack/react-table'
import type { Contact } from '@/@types'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { contacts } from '@/lib/queries/contact'
import { HttpError } from '@/lib/repository/http-error'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'

type CustomersMultiDeleteDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}

const CONFIRM_WORD = 'DELETE'

export function CustomersMultiDeleteDialog<TData>({
  open,
  onOpenChange,
  table,
}: CustomersMultiDeleteDialogProps<TData>) {
  const [value, setValue] = useState('')
  const remove = useMutation(contacts().delete.mutationOptions())
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleDelete = () => {
    if (value.trim() !== CONFIRM_WORD) return
    const submit = async () => {
      await Promise.all(
        selectedRows.map((row) =>
          remove.mutateAsync((row.original as Contact).id)
        )
      )
      setValue('')
      table.resetRowSelection()
      onOpenChange(false)
      return selectedRows.length
    }
    toast.promise(submit, {
      loading: 'Deleting customers',
      error: (error) =>
        error instanceof HttpError ? error.message : 'Internal server error',
      success: (count) => `Deleted ${count} customer${count === 1 ? '' : 's'}`,
    })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== CONFIRM_WORD || remove.isPending}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          Delete {selectedRows.length} customer
          {selectedRows.length === 1 ? '' : 's'}
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Delete the selected customers? This action cannot be undone.
          </p>
          <Label className='my-4 flex flex-col items-start gap-1.5'>
            <span>Confirm by typing &quot;{CONFIRM_WORD}&quot;:</span>
            <Input
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder={`Type "${CONFIRM_WORD}" to confirm.`}
            />
          </Label>
          <Alert variant='destructive'>
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              This operation permanently removes the selected customers.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText='Delete'
      destructive
    />
  )
}
