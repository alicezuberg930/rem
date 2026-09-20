import { createFileRoute } from '@tanstack/react-router'
import { Variants } from '@/features/variants'

export const Route = createFileRoute('/_authenticated/variants/')({
  component: Variants,
})
