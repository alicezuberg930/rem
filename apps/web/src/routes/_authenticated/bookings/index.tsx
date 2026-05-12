import { Bookings } from '@/features/bookings'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/bookings/')({
    component: Bookings,
})
