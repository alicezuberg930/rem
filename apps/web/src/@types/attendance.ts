import { User } from '.'

export const CHECK_IN_TYPE = {
  OFFICE: 'Office',
  REMOTE: 'Remote',
  HYBRID: 'Hybrid',
} as const

export type CheckInType = keyof typeof CHECK_IN_TYPE

export const CHECK_IN_STATUS = {
  ON_TIME: 'On Time',
  LATE: 'Late',
  HALF_DAY: 'Half Day',
} as const

export type CheckInStatus = keyof typeof CHECK_IN_STATUS

export type Attendance = {
  id: string
  user: User
  checkInTime: string
  checkOutTime: string | null
  businessId: string
  date: string
  checkInType: CheckInType
  checkInStatus: CheckInStatus
  note: string | null
  address: string
  latitude: number
  longitude: number
}
