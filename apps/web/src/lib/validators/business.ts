import * as z from 'zod'
import { MAIL_PROVIDER, PHONE_PROVIDER } from '@/@types'

export namespace BusinessValidators {
  const businessMailProviderSchema = z.union(
    Object.entries(MAIL_PROVIDER).map((provider) => z.literal(provider[1]))
  )

  const businessPhoneProviderSchema = z.union(
    Object.entries(PHONE_PROVIDER).map((provider) => z.literal(provider[1]))
  )

  export const formSchema = z.object({
    name: z.string().min(8, 'Name must be at least 8 characters long.'),
    description: z.string().nullable().optional(),
    slug: z.string().min(8, 'Slug must be at least 8 characters long.'),
    logoUrl: z
      .union([z.string(), z.instanceof(File)])
      .nullable()
      .optional(),
    workStartTime: z.string().nullable().optional(),
    insuranceContributionSalary: z.string(),
    twilioAccountSid: z.string().nullable().optional(),
    twilioAuthToken: z.string().nullable().optional(),
    twilioPhoneNumber: z.string().nullable().optional(),
    vonageApiKey: z.string().nullable().optional(),
    vonageApiSecret: z.string().nullable().optional(),
    cloudinaryCloudName: z.string().nullable().optional(),
    cloudinaryApiKey: z.string().nullable().optional(),
    cloudinaryApiSecret: z.string().nullable().optional(),
    resendApiKey: z.string().nullable().optional(),
    resendEmail: z.string().nullable().optional(),
    mailHost: z.string().nullable().optional(),
    mailPort: z.number().nullable().optional(),
    mailUsername: z.string().nullable().optional(),
    mailPassword: z.string().nullable().optional(),
    sendGridApiKey: z.string().nullable().optional(),
    sendGridUsername: z.string().nullable().optional(),
    mailgunApiKey: z.string().nullable().optional(),
    mailgunDomain: z.string().nullable().optional(),
    mailgunUsername: z.string().nullable().optional(),
    mailProvider: businessMailProviderSchema.nullable().optional(),
    phoneProvider: businessPhoneProviderSchema.nullable().optional(),
  })

  export type BusinessForm = z.infer<typeof formSchema>
}
