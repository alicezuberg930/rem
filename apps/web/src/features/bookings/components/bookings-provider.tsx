import React, { useEffect, useState } from 'react'
import { CalendarBooking, Contact } from '@/@types'
import { getContacts } from '@/lib/repository/api'
import useDialogState from '@/hooks/use-dialog-state'

type BookingsDialogType = 'add'

type BookingsContextType = {
  open: BookingsDialogType | null
  setOpen: (str: BookingsDialogType | null) => void
  currentRow: CalendarBooking | null
  setCurrentRow: React.Dispatch<React.SetStateAction<CalendarBooking | null>>
  contacts: Contact[]
}

const BookingsContext = React.createContext<BookingsContextType | null>(null)

export function BookingsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<BookingsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<CalendarBooking | null>(null)
  const [contacts, setContacts] = useState<Contact[]>([])

  useEffect(() => {
    getContacts().then((res) => setContacts(res.data.content))
  }, [])

  return (
    <BookingsContext
      value={{ open, setOpen, currentRow, setCurrentRow, contacts }}
    >
      {children}
    </BookingsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useBookings = () => {
  const bookingsContext = React.useContext(BookingsContext)

  if (!bookingsContext) {
    throw new Error(
      'useCampaigns hook has to be used within <CampaignsContext>'
    )
  }

  return bookingsContext
}
