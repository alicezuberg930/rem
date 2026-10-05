import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Users } from '@/features/users'

const usersSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  // Facet filters
  status: z
    .array(z.union([z.literal('active'), z.literal('inactive')]))
    .optional()
    .catch([]),
  membershipVerified: z.array(z.union([z.literal('verified'), z.literal('unverified')]))
    .optional()
    .catch([]),
  role: z.array(z.string()).optional().catch([]),
  fullname: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/users/')({
  validateSearch: usersSearchSchema,
  component: Users,
})
