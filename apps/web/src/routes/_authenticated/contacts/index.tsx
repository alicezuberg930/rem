import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Contacts } from '@/features/contacts'

const contactsSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  type: z
    .array(z.enum(['PERSONAL', 'COMPANY']))
    .optional()
    .catch([]),
})

export const Route = createFileRoute('/_authenticated/contacts/')({
  validateSearch: contactsSearchSchema,
  component: Contacts,
})
