export const MAIL_PROVIDER = {
  SMTP: 'SMTP',
  Exchange: 'EXCHANGE',
  Sendgrid: 'SENDGRID',
  Resend: 'RESEND',
  Mailgun: 'MAILGUN',
  'Amazon SES': 'AMAZON_SES',
  Postmark: 'POSTMARK',
  Other: 'OTHER',
} as const

export type MailProvider = keyof typeof MAIL_PROVIDER

export const PHONE_PROVIDER = {
  TWILIO: 'Twilio',
  VONAGE: 'Vonage',
  OTHER: 'Other',
} as const

export type PhoneProvider = keyof typeof PHONE_PROVIDER

export type Business = {
  id: string
  name: string
  description: string
  slug: string
  logoUrl: string | null
  workStartTime: string | null
  insuranceContributionSalary: number | null
  twilioAccountSid: string | null
  twilioAuthToken: string | null
  twilioPhoneNumber: string | null
  vonageApiKey: string | null
  vonageApiSecret: string | null
  cloudinaryCloudName: string | null
  cloudinaryApiKey: string | null
  cloudinaryApiSecret: string | null
  resendApiKey: string | null
  resendEmail: string | null
  mailHost: string | null
  mailPort: number | null
  mailUsername: string | null
  mailPassword: string | null
  sendGridApiKey: string | null
  sendGridUsername: string | null
  mailgunApiKey: string | null
  mailgunDomain: string | null
  mailgunUsername: string | null
  mailProvider: MailProvider
  phoneProvider: PhoneProvider
}
