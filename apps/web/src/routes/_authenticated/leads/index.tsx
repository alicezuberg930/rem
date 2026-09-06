import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { LEAD_SOURCE, LEAD_STATUS } from '@/@types'
import { Leads } from '@/features/leads'

const leadSources = Object.keys(LEAD_SOURCE) as [
  keyof typeof LEAD_SOURCE,
  ...(keyof typeof LEAD_SOURCE)[],
]

const leadStatuses = Object.keys(LEAD_STATUS) as [
  keyof typeof LEAD_STATUS,
  ...(keyof typeof LEAD_STATUS)[],
]

const leadsSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  source: z.array(z.enum(leadSources)).optional().catch([]),
  status: z.array(z.enum(leadStatuses)).optional().catch([]),
})

export const Route = createFileRoute('/_authenticated/leads/')({
  validateSearch: leadsSearchSchema,
  component: Leads,
})
