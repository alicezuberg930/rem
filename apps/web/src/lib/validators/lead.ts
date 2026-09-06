import * as z from 'zod'
import { LEAD_SOURCE, LEAD_STATUS } from '@/@types'

const leadSources = Object.keys(LEAD_SOURCE) as [
  keyof typeof LEAD_SOURCE,
  ...(keyof typeof LEAD_SOURCE)[],
]

const leadStatuses = Object.keys(LEAD_STATUS) as [
  keyof typeof LEAD_STATUS,
  ...(keyof typeof LEAD_STATUS)[],
]

export const leadFormSchema = z.object({
  contactId: z.string().min(1, 'Contact is required.'),
  source: z.enum(leadSources),
  status: z.enum(leadStatuses),
})

export type LeadForm = z.infer<typeof leadFormSchema>
