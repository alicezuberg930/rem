import { TemplatesActionDialog } from './templates-action-dialog'
import { TemplatesDeleteDialog } from './templates-delete-dialog'
import { TemplatesPreviewDialog } from './templates-preview-dialog'
import { useTemplates } from './templates-provider'

export function TemplatesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useTemplates()
  return (
    <>
      <TemplatesActionDialog
        key='template-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <TemplatesActionDialog
            key={`template-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <TemplatesDeleteDialog
            key={`template-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <TemplatesPreviewDialog
            key={`template-preview-${currentRow.id}`}
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
