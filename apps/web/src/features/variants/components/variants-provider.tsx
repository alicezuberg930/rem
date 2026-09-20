import React, { useState } from 'react'
import { Template } from '@/@types'
import useDialogState from '@/hooks/use-dialog-state'

type VariantsDialogType = 'preview' | 'add' | 'edit' | 'delete'

type VariantsContextType = {
  open: VariantsDialogType | null
  setOpen: (str: VariantsDialogType | null) => void
  currentRow: Template | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Template | null>>
}

const VariantsContext = React.createContext<VariantsContextType | null>(null)

export function VariantsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<VariantsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Template | null>(null)

  return (
    <VariantsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </VariantsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useVariants = () => {
  const variantsContext = React.useContext(VariantsContext)

  if (!variantsContext) {
    throw new Error(
      'useVariants hook has to be used within <VariantsContext>'
    )
  }

  return variantsContext
}
