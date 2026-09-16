import { createFileRoute } from '@tanstack/react-router'
import { Storage } from '@/features/storage'

export const Route = createFileRoute('/_authenticated/storage/')({
  component: Storage,
})
