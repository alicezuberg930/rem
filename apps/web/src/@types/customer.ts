import type { QueryPaginate } from '.'
import type { Contact, CustomerGroup } from './contact'

export type Customer = {
  id: string
  contact: Contact
  customerGroup: CustomerGroup | null
  customerSince: string
}

export type QueryCustomer = QueryPaginate & {
  customerGroupId?: string
}
