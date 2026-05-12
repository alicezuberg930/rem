import * as z from 'zod'
import { CAMPAIGN_SEND_TYPE } from '@/@types'

export namespace CampaignValidators {
  const campaignSendTypeSchema = z.union(
    Object.entries(CAMPAIGN_SEND_TYPE).map((type) => z.literal(type[1]))
  )

  // const campaignStatusSchema = z.union(Object.entries(CAMPAIGN_STATUS).map(status => z.literal(status[1])))

  export const formSchema = z
    .object({
      id: z.string().optional(),
      name: z.string().min(8, 'Name must be at least 8 characters long.'),
      description: z.string().nullable(),
      // status: campaignStatusSchema,
      sendType: campaignSendTypeSchema,
      templateId: z.string({ error: 'Template ID is required' }),
      scheduleAt: z.date().nullable(),
      contactIds: z.array(z.string()).min(1, 'Choose at least 1 contact'),
      isEdit: z.boolean(),
    })
    .refine(
      ({ scheduleAt, sendType }) => {
        if (sendType === 'SCHEDULED') return !!scheduleAt
        return true
      },
      {
        message: 'Schedule date must be specified when send type is SCHEDULED.',
        path: ['scheduleAt'],
      }
    )

  export type CampaignForm = z.infer<typeof formSchema>
}
