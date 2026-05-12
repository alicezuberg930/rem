import React, { useState } from 'react'
import { Template } from '@/@types'
import useDialogState from '@/hooks/use-dialog-state'

type TemplatesDialogType = 'preview' | 'add' | 'edit' | 'delete'

type TemplatesContextType = {
  open: TemplatesDialogType | null
  setOpen: (str: TemplatesDialogType | null) => void
  currentRow: Template | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Template | null>>
}

const TemplatesContext = React.createContext<TemplatesContextType | null>(null)

export function TemplatesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<TemplatesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Template | null>(null)

  return (
    <TemplatesContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </TemplatesContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTemplates = () => {
  const templatesContext = React.useContext(TemplatesContext)

  if (!templatesContext) {
    throw new Error(
      'useTemplates hook has to be used within <TemplatesContext>'
    )
  }

  return templatesContext
}
