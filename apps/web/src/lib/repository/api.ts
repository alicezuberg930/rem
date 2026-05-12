import {
  Campaign,
  ApiResponse,
  PaginatedApiResponse,
  Contact,
  Business,
  CalendarBooking,
} from '@/@types'
import {
  BusinessValidators,
  CampaignValidators,
  BookingValidators,
} from '@/lib/validators'
import { getCookie } from '../cookies'
import { httpClient } from './http-client'

export const getCurrentRole = async (): Promise<ApiResponse<any>> => {
  return await httpClient.get<ApiResponse<any>>(
    `/auth/role?businessId=${'rc34mbn1q176xmzhk0lxkt4q'}`
  )
}

// file handling
export const uploadFile = async (
  file: File,
  subFolder?: string
): Promise<ApiResponse<string>> => {
  const formData = new FormData()
  if (subFolder)
    formData.append('subFolder', `/${getCookie('X-Business-Id')}${subFolder}`)
  formData.append('file', file, file.name)
  return await httpClient.post<ApiResponse<string>>('/upload/single', formData)
}

export const uploadFiles = async (
  files: File[],
  subFolder?: string
): Promise<ApiResponse<string[]>> => {
  const formData = new FormData()
  if (subFolder)
    formData.append('subFolder', `/${getCookie('X-Business-Id')}${subFolder}`)
  files.forEach((file) => formData.append('files[]', file, file.name))
  return await httpClient.post<ApiResponse<string[]>>(
    '/upload/multiple',
    formData
  )
}

// campaigns management
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

// contacts management
export const getContacts = async (): Promise<
  PaginatedApiResponse<Contact[]>
> => {
  return await httpClient.get<PaginatedApiResponse<Contact[]>>('/contacts')
}

// business management
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

// bookings management
export const createBooking = async (
  data: BookingValidators.BookingForm
): Promise<ApiResponse<CalendarBooking>> => {
  return await httpClient.post<ApiResponse<CalendarBooking>>(
    '/calendar-bookings',
    { ...data }
  )
}

export const updateBooking = async (
  data: BookingValidators.BookingForm,
  id: string
): Promise<ApiResponse<CalendarBooking>> => {
  return await httpClient.put<ApiResponse<CalendarBooking>>(
    `/calendar-bookings/${id}`,
    { ...data }
  )
}

export const getBookings = async (): Promise<
  ApiResponse<CalendarBooking[]>
> => {
  return await httpClient.get<ApiResponse<CalendarBooking[]>>(
    '/calendar-bookings'
  )
}
