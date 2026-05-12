import { createFileRoute } from '@tanstack/react-router'
import { Businesses } from '@/features/businesses'

export const Route = createFileRoute('/businesses/')({
  component: Businesses,
})
