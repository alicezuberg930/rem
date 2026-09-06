import { z } from 'zod'
import { LEAD_SOURCE, LEAD_STATUS } from '@/@types'

const leadSourceSchema = z.enum(
  Object.keys(LEAD_SOURCE) as [
    keyof typeof LEAD_SOURCE,
    ...(keyof typeof LEAD_SOURCE)[],
  ]
)

const leadStatusSchema = z.enum(
  Object.keys(LEAD_STATUS) as [
    keyof typeof LEAD_STATUS,
    ...(keyof typeof LEAD_STATUS)[],
  ]
)

export const leadSchema = z.object({
  id: z.string(),
  source: leadSourceSchema,
  status: leadStatusSchema,
})

export type LeadSourceOption = z.infer<typeof leadSourceSchema>
export type LeadStatusOption = z.infer<typeof leadStatusSchema>
