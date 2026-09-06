import { ContactsActionDialog } from './contacts-action-dialog'
import { ContactsDeleteDialog } from './contacts-delete-dialog'
import { useContacts } from './contacts-provider'

export function ContactsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useContacts()

  const handleClose = (dialog: 'edit' | 'delete') => {
    setOpen(dialog)
    setTimeout(() => setCurrentRow(null), 500)
  }

  return (
    <>
      <ContactsActionDialog
        key='contact-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />
      {currentRow && (
        <>
          <ContactsActionDialog
            key={`contact-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => handleClose('edit')}
            currentRow={currentRow}
          />
          <ContactsDeleteDialog
            key={`contact-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => handleClose('delete')}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
