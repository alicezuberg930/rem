import * as z from 'zod'

export const customerFormSchema = z.object({
  contactId: z.string().min(1, 'Contact is required.'),
  customerGroupId: z.string(),
  customerSince: z.string().min(1, 'Customer since is required.'),
})

export type CustomerForm = z.infer<typeof customerFormSchema>
