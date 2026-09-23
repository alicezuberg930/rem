import { Locations } from '@/features/locations'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/locations/')({
  component: Locations,
})
