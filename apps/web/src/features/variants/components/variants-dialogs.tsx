import { VariantsActionDialog } from './variants-action-dialog'
import { VariantsDeleteDialog } from './variants-delete-dialog'
import { VariantsPreviewDialog } from './variants-preview-dialog'
import { useVariants } from './variants-provider'

export function VariantsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useVariants()
  return (
    <>
      <VariantsActionDialog
        key='variant-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <VariantsActionDialog
            key={`variant-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <VariantsDeleteDialog
            key={`variant-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <VariantsPreviewDialog
            key={`variant-preview-${currentRow.id}`}
            open={open === 'preview'}
            onOpenChange={() => {
              setOpen('preview')
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
