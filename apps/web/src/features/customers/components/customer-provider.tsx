import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { Contact, Customer, CustomerGroup } from '@/@types'
import { customers } from '@/lib/queries/customer'
import useDialogState from '@/hooks/use-dialog-state'

type CustomersDialogType = 'add' | 'edit' | 'delete'

type CustomersContextType = {
  open: CustomersDialogType | null
  setOpen: (dialog: CustomersDialogType | null) => void
  currentRow: Customer | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Customer | null>>
  contacts: Contact[]
  customerGroups: CustomerGroup[]
}

const CustomersContext = React.createContext<CustomersContextType | null>(null)

export function CustomersProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<CustomersDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Customer | null>(null)
  const { data: contacts = [] } = useQuery(customers().contacts.queryOptions())
  const { data: customerGroups = [] } = useQuery(
    customers().customerGroups.queryOptions()
  )

  return (
    <CustomersContext
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        contacts,
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
