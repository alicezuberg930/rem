import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import type { Table } from '@tanstack/react-table'
import type { Variant } from '@/@types/variant'
import { AlertTriangle } from 'lucide-react'
import { variants } from '@/lib/queries/variant'
import { HttpError } from '@/lib/repository/http-error'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/toast'
import { ConfirmDialog } from '@/components/confirm-dialog'

type VariantMultiDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<Variant>
}

const CONFIRM_WORD = 'DELETE'

export function VariantsMultiDeleteDialog({
  open,
  onOpenChange,
  table,
}: VariantMultiDeleteDialogProps) {
  const [value, setValue] = useState('')
  const deleteVariant = useMutation(variants().delete.mutationOptions())
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleDelete = () => {
    if (value.trim() !== CONFIRM_WORD) return

    const submit = async () => {
      await Promise.all(
        selectedRows.map(({ original }) =>
          deleteVariant.mutateAsync(original.id)
        )
      )
      table.resetRowSelection()
      setValue('')
      onOpenChange(false)
      return `Deleted ${selectedRows.length} ${
        selectedRows.length === 1 ? 'variant' : 'variants'
      }`
    }

    toast.promise(submit, {
      loading: 'Deleting variants',
      error: (error) =>
        error instanceof HttpError ? error.message : 'Internal server error',
      success: (message) => message,
    })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== CONFIRM_WORD}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          Delete {selectedRows.length}{' '}
          {selectedRows.length === 1 ? 'variant' : 'variants'}
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p>This action permanently removes the selected variants.</p>
          <Label className='flex flex-col items-start gap-1.5'>
            Confirm by typing &quot;{CONFIRM_WORD}&quot;:
            <Input
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder={`Type "${CONFIRM_WORD}" to confirm`}
            />
          </Label>
          <Alert variant='destructive'>
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              This operation cannot be undone.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText='Delete'
      destructive
    />
  )
}
