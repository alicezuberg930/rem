import type { QueryPaginate } from '.'
import type { Contact } from './contact'

export const LEAD_SOURCE = {
  WEBSITE: 'Website',
  LANDING_PAGE: 'Landing page',
  CONTACT_FORM: 'Contact form',
  LIVE_CHAT: 'Live chat',
  CHATBOT: 'Chatbot',
  MOBILE_APP: 'Mobile app',
  PHONE_CALL: 'Phone call',
  EMAIL: 'Email',
  SMS: 'SMS',
  WHATSAPP: 'WhatsApp',
  FACEBOOK: 'Facebook',
  INSTAGRAM: 'Instagram',
  LINKEDIN: 'LinkedIn',
  TIKTOK: 'TikTok',
  YOUTUBE: 'YouTube',
  X_TWITTER: 'X / Twitter',
  ZALO: 'Zalo',
  GOOGLE_ORGANIC: 'Google organic',
  BING_ORGANIC: 'Bing organic',
  OTHER_SEARCH_ENGINE: 'Other search engine',
  GOOGLE_ADS: 'Google Ads',
  FACEBOOK_ADS: 'Facebook Ads',
  INSTAGRAM_ADS: 'Instagram Ads',
  LINKEDIN_ADS: 'LinkedIn Ads',
  TIKTOK_ADS: 'TikTok Ads',
  YOUTUBE_ADS: 'YouTube Ads',
  DISPLAY_ADS: 'Display Ads',
  RETARGETING_ADS: 'Retargeting Ads',
  REFERRAL: 'Referral',
  CUSTOMER_REFERRAL: 'Customer referral',
  PARTNER_REFERRAL: 'Partner referral',
  EMPLOYEE_REFERRAL: 'Employee referral',
  PARTNER: 'Partner',
  AFFILIATE: 'Affiliate',
  RESELLER: 'Reseller',
  DISTRIBUTOR: 'Distributor',
  EVENT: 'Event',
  TRADE_SHOW: 'Trade show',
  CONFERENCE: 'Conference',
  SEMINAR: 'Seminar',
  WEBINAR: 'Webinar',
  NETWORKING: 'Networking',
  WALK_IN: 'Walk in',
  STORE_VISIT: 'Store visit',
  QR_CODE: 'QR code',
  DIRECT_MAIL: 'Direct mail',
  COLD_CALL: 'Cold call',
  COLD_EMAIL: 'Cold email',
  OUTBOUND_SALES: 'Outbound sales',
  MARKETPLACE: 'Marketplace',
  API: 'API',
  THIRD_PARTY_INTEGRATION: 'Third-party integration',
  IMPORT: 'Import',
  CSV_IMPORT: 'CSV import',
  OTHER: 'Other',
  UNKNOWN: 'Unknown',
} as const

export const LEAD_STATUS = {
  NEW: 'New',
  ASSIGNED: 'Assigned',
  CONTACT_ATTEMPTED: 'Contact attempted',
  CONTACTED: 'Contacted',
  ENGAGED: 'Engaged',
  QUALIFIED: 'Qualified',
  NURTURING: 'Nurturing',
  ON_HOLD: 'On hold',
  UNQUALIFIED: 'Unqualified',
  DISQUALIFIED: 'Disqualified',
  CONVERTED: 'Converted',
  LOST: 'Lost',
  DUPLICATE: 'Duplicate',
  INVALID: 'Invalid',
  DO_NOT_CONTACT: 'Do not contact',
} as const

export type LeadSource = keyof typeof LEAD_SOURCE
export type LeadStatus = keyof typeof LEAD_STATUS

export type Lead = {
  id: string
  contact: Contact
  source: LeadSource
  status: LeadStatus
}

export type QueryLead = QueryPaginate & {
  source?: LeadSource
  status?: LeadStatus
}
