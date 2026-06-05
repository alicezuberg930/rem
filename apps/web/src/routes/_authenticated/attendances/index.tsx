import { createFileRoute } from '@tanstack/react-router'
import { Attendances } from '@/features/attendances'

export const Route = createFileRoute('/_authenticated/attendances/')({
  component: Attendances,
})
