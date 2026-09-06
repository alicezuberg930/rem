import type {
  ApiResponse,
  Business,
  Campaign,
  Contact,
  PaginatedApiResponse,
  QueryContact,
} from '@/@types'
import type { BusinessValidators, CampaignValidators } from '@/lib/validators'
import { getCookie } from '../cookies'
import { httpClient } from './http-client'

export const getCampaigns = async (): Promise<
  PaginatedApiResponse<Campaign[]>
> => {
  return await httpClient.get<PaginatedApiResponse<Campaign[]>>('/campaigns')
}

export const createCampaign = async (
  data: CampaignValidators.CampaignForm
): Promise<ApiResponse<Campaign>> => {
  return await httpClient.post<ApiResponse<Campaign>>('/campaigns', { ...data })
}

export const updateCampaign = async (
  data: CampaignValidators.CampaignForm,
  id: string
): Promise<ApiResponse<Campaign>> => {
  return await httpClient.put<ApiResponse<Campaign>>(`/campaigns/${id}`, {
    ...data,
  })
}

export const deleteCampaign = async (
  id: string
): Promise<ApiResponse<Campaign>> => {
  return await httpClient.delete<ApiResponse<Campaign>>(`/campaigns/${id}`)
}

export const getContacts = async (
  params: QueryContact = {}
): Promise<PaginatedApiResponse<Contact[]>> => {
  return await httpClient.get<PaginatedApiResponse<Contact[]>>(
    '/contacts',
    params as Record<string, unknown>
  )
}

export const exportContacts = async (
  params: Omit<QueryContact, 'page' | 'pageSize'> = {}
) => {
  return await httpClient.download(
    '/contacts/export',
    params as Record<string, unknown>
  )
}

export const createBusiness = async (
  data: BusinessValidators.BusinessForm
): Promise<ApiResponse<Business>> => {
  return await httpClient.post<ApiResponse<Business>>('/businesses', {
    ...data,
  })
}

export const updateBusiness = async (
  data: BusinessValidators.BusinessForm
): Promise<ApiResponse<Business>> => {
  return await httpClient.put<ApiResponse<Business>>(
    `/businesses/${getCookie('X-Business-Id')}`,
    { ...data }
  )
}
