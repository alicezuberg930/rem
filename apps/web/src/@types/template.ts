import { QueryPaginate } from '.'

export type Template = {
  id: string
  name: string
  header: string
  body: string
  footer: string
  contactPhone: string | null
  websiteUrl: string | null
}

export type QueryTemplate = QueryPaginate & {
  name?: string
}

// export type CreateTemplate = Template
