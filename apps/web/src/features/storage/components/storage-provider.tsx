import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import type { StorageItem } from './storage-types'

type StorageDialogType = 'add' | 'edit' | 'delete' | 'move' | 'share'

type StorageContextType = {
  open: StorageDialogType | null
  setOpen: (dialog: StorageDialogType | null) => void
  currentRow: StorageItem | null
  setCurrentRow: React.Dispatch<React.SetStateAction<StorageItem | null>>
}

const StorageContext = React.createContext<StorageContextType | null>(null)

export function StorageProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<StorageDialogType>(null)
  const [currentRow, setCurrentRow] = useState<StorageItem | null>(null)

  return (
    <StorageContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </StorageContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useStorage = () => {
  const context = React.useContext(StorageContext)
  if (!context) {
    throw new Error('useStorage must be used within <StorageProvider>')
  }
  return context
}
