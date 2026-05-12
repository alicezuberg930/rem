import { useCampaigns } from './campaign-provider'
import { CampaignsActionDialog } from './campaigns-action-dialog'
import { CampaignsDeleteDialog } from './campaigns-delete-dialog'

export function CampaignsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCampaigns()
  return (
    <>
      <CampaignsActionDialog
        key='campaign-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
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
      )}
    </>
  )
}
