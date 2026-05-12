import { QueryPaginate } from '.'
import { Contact } from './contact'
import { Template } from './template'

export const CAMPAIGN_STATUS = {
  Draft: 'DRAFT',
  Pending: 'PENDING',
  Processing: 'PROCESSING',
  Sent: 'SENT',
  Failed: 'FAILED',
} as const

export const CAMPAIGN_SEND_TYPE = {
  Immediate: 'IMMEDIATE',
  Scheduled: 'SCHEDULED',
} as const

export type CampaignStatus =
  (typeof CAMPAIGN_STATUS)[keyof typeof CAMPAIGN_STATUS]

export type CampaignSendType =
  (typeof CAMPAIGN_SEND_TYPE)[keyof typeof CAMPAIGN_SEND_TYPE]

export type Campaign = {
  id: string
  name: string
  description: string | null
  sendType: CampaignSendType
  scheduleAt: string | null
  status: CampaignStatus

  template: Template
  contacts: Contact[]
}

export type QueryCampaign = QueryPaginate & {
  name?: string
  status?: CampaignStatus[]
  sendType?: CampaignSendType
}
