import { createFileRoute } from '@tanstack/react-router'
import { Bookings } from '@/features/bookings'

export const Route = createFileRoute('/_authenticated/bookings/')({
  component: Bookings,
})
