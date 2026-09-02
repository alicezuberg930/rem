import { useCustomers } from './customer-provider'
import { CustomersActionDialog } from './customers-action-dialog'
import { CustomersDeleteDialog } from './customers-delete-dialog'

export function CustomersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCustomers()

  const handleClose = (dialog: 'add' | 'edit' | 'delete') => {
    setOpen(dialog)
    setTimeout(() => setCurrentRow(null), 500)
  }

  return (
    <>
      <CustomersActionDialog
        key='customer-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />
      {currentRow && (
        <>
          <CustomersActionDialog
            key={`customer-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => handleClose('edit')}
            currentRow={currentRow}
          />
          <CustomersDeleteDialog
            key={`customer-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => handleClose('delete')}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
