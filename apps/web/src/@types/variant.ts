import type { QueryPaginate } from '.'

export type VariantOption = {
  id: string
  value: string
}

export type Variant = {
  id: string
  name: string
  options: VariantOption[]
}

export type QueryVariant = QueryPaginate & {
  name?: string
}
