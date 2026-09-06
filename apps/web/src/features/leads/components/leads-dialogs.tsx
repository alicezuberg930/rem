import { LeadsActionDialog } from './leads-action-dialog'
import { LeadsDeleteDialog } from './leads-delete-dialog'
import { useLeads } from './leads-provider'

export function LeadsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useLeads()

  const handleClose = (dialog: 'edit' | 'delete') => {
    setOpen(dialog)
    setTimeout(() => setCurrentRow(null), 500)
  }

  return (
    <>
      <LeadsActionDialog
        key='lead-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />
      {currentRow && (
        <>
          <LeadsActionDialog
            key={`lead-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => handleClose('edit')}
            currentRow={currentRow}
          />
          <LeadsDeleteDialog
            key={`lead-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => handleClose('delete')}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
