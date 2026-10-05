import React, { useState } from 'react'
import type { Product } from '@/@types'

type ProductsDialogType = 'add' | 'edit' | 'delete'

type ProductsContextType = {
  open: ProductsDialogType | null
  setOpen: (dialog: ProductsDialogType | null) => void
  currentRow: Product | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Product | null>>
}

const ProductsContext = React.createContext<ProductsContextType | null>(null)

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState<ProductsDialogType | null>(null)
  const [currentRow, setCurrentRow] = useState<Product | null>(null)

  return (
    <ProductsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </ProductsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProducts() {
  const productsContext = React.useContext(ProductsContext)

  if (!productsContext) {
    throw new Error('useProducts hook has to be used within <ProductsProvider>')
  }

  return productsContext
}
