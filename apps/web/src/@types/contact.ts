export type ContactType = 'PERSONAL' | 'COMPANY'

type TagColor =
  | 'RED'
  | 'GREEN'
  | 'BLUE'
  | 'YELLOW'
  | 'ORANGE'
  | 'PURPLE'
  | 'PINK'
  | 'BROWN'
  | 'GRAY'

export type ContactTag = {
  id: string
  name: string
  color: TagColor
  isActive: boolean
}

export type CustomerGroup = {
  id: string
  name: string
  percentage: number | null
}

export type Contact = {
  id: string
  type: ContactType
  firstName: string
  lastName: string
  surname: string
  phone: string
  mobilePhone: string | null
  email: string
  birthday: string | null
  occupation: string | null
  taxCode: string | null
  website: string | null
  facebook: string | null
  instagram: string | null
  zalo: string | null
  identityCard: string | null
  identityIssuedOn: string | null
  identityIssuedAt: string | null
  insuranceNumber: string | null
  note: string | null
  address1: string | null
  address2: string | null
  country: string | null
  zipCode: string | null

  customerGroup?: CustomerGroup | null

  tag?: ContactTag
}

export type QueryContact = {
  page?: number
  pageSize?: number
  customerGroupId?: string
  type?: ContactType
}
