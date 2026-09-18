import { createFileRoute } from '@tanstack/react-router'
import { Scanner } from '@/features/scanner'

export const Route = createFileRoute('/_authenticated/scanner/')({
  component: Scanner,
})
