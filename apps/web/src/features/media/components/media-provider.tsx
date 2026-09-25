import React, { useState } from 'react'
import type { Media } from '@/@types/media'
import useDialogState from '@/hooks/use-dialog-state'

type MediaDialogType = 'add' | 'edit' | 'delete' | 'move' | 'share'

type MediaContextType = {
  open: MediaDialogType | null
  setOpen: (dialog: MediaDialogType | null) => void
  currentRow: Media | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Media | null>>
}

const MediaContext = React.createContext<MediaContextType | null>(null)

export function MediaProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<MediaDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Media | null>(null)

  return (
    <MediaContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </MediaContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useMedia = () => {
  const context = React.useContext(MediaContext)
  if (!context) {
    throw new Error('useMedia must be used within <MediaProvider>')
  }
  return context
}
