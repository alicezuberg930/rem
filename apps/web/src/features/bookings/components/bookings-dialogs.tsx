import { BookingsActionDialog } from './bookings-action-dialog'
import { useBookings } from './bookings-provider'

export function BookingsDialogs() {
  const { open, setOpen } = useBookings()
  return (
    <>
      <BookingsActionDialog
        key='campaign-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {/* {currentRow && (
        <>
          <CampaignsActionDialog
            key={`campaign-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <CampaignsDeleteDialog
            key={`campaign-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />
        </>
      )} */}
    </>
  )
}
