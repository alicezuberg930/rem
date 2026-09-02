import * as z from 'zod'

const optionalText = z.string().nullable()

export const contactFormSchema = z.object({
  businessId: z.string().min(1, 'Business is required.'),
  customerGroupId: z.string().nullable(),
  tagId: z.string().min(1, 'Tag is required.'),
  type: z.enum(['PERSONAL', 'COMPANY']),
  firstName: z.string().min(1, 'First name is required.'),
  lastName: z.string().min(1, 'Last name is required.'),
  surname: z.string().min(1, 'Surname is required.'),
  phone: z.string().min(1, 'Phone is required.'),
  mobilePhone: optionalText,
  email: z.email('A valid email is required.'),
  birthday: optionalText,
  occupation: optionalText,
  taxCode: z.string().min(1, 'Tax code is required.'),
  website: optionalText,
  facebook: optionalText,
  instagram: optionalText,
  zalo: optionalText,
  identityCard: optionalText,
  identityIssuedOn: optionalText,
  identityIssuedAt: optionalText,
  insuranceNumber: optionalText,
  note: optionalText,
  address1: optionalText,
  address2: optionalText,
  country: optionalText,
  zipCode: optionalText,
})

export type ContactForm = z.infer<typeof contactFormSchema>
