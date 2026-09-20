import { createFileRoute } from '@tanstack/react-router'
import { CodeScanner } from '@/features/code-scanner'

export const Route = createFileRoute('/_authenticated/code-scanner/')({
  component: CodeScanner,
})
