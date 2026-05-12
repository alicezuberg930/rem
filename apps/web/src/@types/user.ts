import { Business } from './business'
import { Role } from './role'

type Provider = 'GOOGLE' | 'FACEBOOK' | 'LOCAL'

type UserBussinessDetails = {
  dependants: number
  bankBranch: string
  bankCode: string
  bankName: string
  bankAccount: string
  bankOwner: string
  salary: string
  isVerified: boolean
  isActive: boolean
}

export type User = Partial<UserBussinessDetails> & {
  id: string
  avatar: string
  birthday: string
  createdAt: string
  fullname: string
  email: string
  phone: string
  provider: Provider
  isVerified: boolean
}

export type Profile = User & {
  businesses: (Business & { role: Role })[]
}
