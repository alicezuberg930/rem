import { ProductsActionDialog } from './products-action-dialog'
import { ProductsDeleteDialog } from './products-delete-dialog'
import { useProducts } from './products-provider'

export function ProductsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useProducts()

  return (
    <>
      <ProductsActionDialog
        key='product-add'
        open={open === 'add'}
        onOpenChange={(state) => setOpen(state ? 'add' : null)}
      />

      {currentRow && (
        <>
          <ProductsActionDialog
            key={`product-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={(state) => {
              setOpen(state ? 'edit' : null)
              if (!state) setCurrentRow(null)
            }}
            currentRow={currentRow}
          />

          <ProductsDeleteDialog
            key={`product-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={(state) => {
              setOpen(state ? 'delete' : null)
              if (!state) setCurrentRow(null)
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
