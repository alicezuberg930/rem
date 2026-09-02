import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { Contact, ContactTag, CustomerGroup } from '@/@types'
import { contacts } from '@/lib/queries/contact'
import useDialogState from '@/hooks/use-dialog-state'

type CustomersDialogType = 'add' | 'edit' | 'delete'

type CustomersContextType = {
  open: CustomersDialogType | null
  setOpen: (dialog: CustomersDialogType | null) => void
  currentRow: Contact | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Contact | null>>
  tags: ContactTag[]
  customerGroups: CustomerGroup[]
}

const CustomersContext = React.createContext<CustomersContextType | null>(null)

export function CustomersProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<CustomersDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Contact | null>(null)
  const { data: tags = [] } = useQuery(contacts().tags.queryOptions())
  const { data: customerGroups = [] } = useQuery(contacts().customerGroups.queryOptions())

  return (
    <CustomersContext
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        tags,
        customerGroups,
      }}
    >
      {children}
    </CustomersContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCustomers = () => {
  const context = React.useContext(CustomersContext)
  if (!context) {
    throw new Error('useCustomers must be used within <CustomersProvider>')
  }
  return context
}
