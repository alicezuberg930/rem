import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import type { Product } from '@/@types'
import { AlertTriangle } from 'lucide-react'
import { products } from '@/lib/queries/product'
import { HttpError } from '@/lib/repository/http-error'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/toast'
import { ConfirmDialog } from '@/components/confirm-dialog'

type ProductsDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Product
}

export function ProductsDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: ProductsDeleteDialogProps) {
  const [value, setValue] = useState('')
  const deleteProduct = useMutation(products().delete.mutationOptions())

  const handleDelete = async () => {
    if (value.trim() !== currentRow.name) return

    const submit = async () => {
      const response = await deleteProduct.mutateAsync(currentRow.id)
      setValue('')
      onOpenChange(false)
      return response
    }

    await toast
      .promise(submit, {
        loading: 'Deleting product',
        error: (error) =>
          error instanceof HttpError ? error.message : 'Internal server error',
        success: (response) => response.message,
      })
      .catch(() => undefined)
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={(state) => {
        if (!state) setValue('')
        onOpenChange(state)
      }}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.name || deleteProduct.isPending}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          Delete product
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to delete{' '}
            <span className='font-bold'>{currentRow.name}</span>?
            <br />
            This action will permanently remove the product from the system and
            cannot be undone.
          </p>

          <Label className='my-2'>
            Product name:
            <Input
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder='Enter the product name to confirm deletion.'
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              The product's variation combinations will also be removed. The
              variation definition will remain available.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText='Delete'
      destructive
    />
  )
}
