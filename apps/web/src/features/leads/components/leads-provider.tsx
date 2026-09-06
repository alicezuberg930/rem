import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { Contact, Lead } from '@/@types'
import { leads } from '@/lib/queries/lead'
import useDialogState from '@/hooks/use-dialog-state'

type LeadsDialogType = 'add' | 'edit' | 'delete'

type LeadsContextType = {
  open: LeadsDialogType | null
  setOpen: (dialog: LeadsDialogType | null) => void
  currentRow: Lead | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Lead | null>>
  contacts: Contact[]
}

const LeadsContext = React.createContext<LeadsContextType | null>(null)

export function LeadsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<LeadsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Lead | null>(null)
  const { data: contacts = [] } = useQuery(leads().contacts.queryOptions())

  return (
    <LeadsContext
      value={{ open, setOpen, currentRow, setCurrentRow, contacts }}
    >
      {children}
    </LeadsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useLeads = () => {
  const context = React.useContext(LeadsContext)
  if (!context) {
    throw new Error('useLeads must be used within <LeadsProvider>')
  }
  return context
}
