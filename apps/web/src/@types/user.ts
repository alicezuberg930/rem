import type { Business } from './business'
import type { Role } from './role'

export type UserProvider = 'GOOGLE' | 'FACEBOOK' | 'LOCAL'

type UserBusinessDetails = {
  businessId: string
  roleId: string
  roleName: string
  membershipVerified: boolean
  dependants: number
  bankBranch: string | null
  bankCode: string | null
  bankName: string | null
  bankAccount: string | null
  bankOwner: string | null
  salary: number
  isActive: boolean
}

export type User = Partial<UserBusinessDetails> & {
  id: string
  avatar: string | null
  birthday: string | null
  createdAt: string
  fullname: string
  email: string
  phone: string
  provider: UserProvider
  isVerified: boolean
}

export type Profile = User & {
  businesses: (Business & { role: Role })[]
}
