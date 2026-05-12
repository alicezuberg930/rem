import { Business } from './business'
import { Contact } from './contact'
import { User } from './user'

export const CALENDAR_BOOKING_STATUS = {
  WAITING: 'Waiting',
  BOOKED: 'Booked',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  ABSENT: 'Absent',
  ARRIVED: 'Arrived',
  IN_ROOM: 'In room',
  BOUGHT_SERVICE: 'Bought service',
} as const

export type CalendarBookingStatus = keyof typeof CALENDAR_BOOKING_STATUS

export const CALENDAR_BOOKING_STATUS_COLOR: Record<
  CalendarBookingStatus,
  string
> = {
  WAITING: '#31d8eb',
  BOOKED: '#e8eb31',
  COMPLETED: '#39e33e',
  CANCELLED: '#f24444',
  ABSENT: '#827575',
  ARRIVED: '#2596be',
  IN_ROOM: '#ef8645',
  BOUGHT_SERVICE: '#f046dc',
} as const

export type CalendarBooking = {
  id: string
  business: Business
  serviceStaff: User | null
  correspondent: User | null
  contact: Contact
  status: CalendarBookingStatus
  bookingStartDate: string
  bookingEndDate: string
  type: CalendarBookingStatus
  cancelReason: string | null
}
