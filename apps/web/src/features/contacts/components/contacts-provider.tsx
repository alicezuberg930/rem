import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { Contact, ContactTag } from '@/@types'
import { contacts } from '@/lib/queries/contact'
import useDialogState from '@/hooks/use-dialog-state'

type ContactsDialogType = 'add' | 'edit' | 'delete'

type ContactsContextType = {
  open: ContactsDialogType | null
  setOpen: (dialog: ContactsDialogType | null) => void
  currentRow: Contact | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Contact | null>>
  tags: ContactTag[]
}

const ContactsContext = React.createContext<ContactsContextType | null>(null)

export function ContactsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<ContactsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Contact | null>(null)
  const { data: tags = [] } = useQuery(contacts().tags.queryOptions())

  return (
    <ContactsContext
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        tags,
      }}
    >
      {children}
    </ContactsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useContacts = () => {
  const context = React.useContext(ContactsContext)
  if (!context) {
    throw new Error('useContacts must be used within <ContactsProvider>')
  }
  return context
}
