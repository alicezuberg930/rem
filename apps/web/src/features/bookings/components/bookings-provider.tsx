import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { CalendarBooking, Contact } from '@/@types'
import { bookings } from '@/lib/queries/booking'
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
  const { data: contacts = [] } = useQuery(bookings().contacts.queryOptions())

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
