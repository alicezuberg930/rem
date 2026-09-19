import { createFileRoute } from '@tanstack/react-router'
import { Scanners } from '@/features/scanners'

export const Route = createFileRoute('/_authenticated/scanner/')({
  component: Scanners,
})
