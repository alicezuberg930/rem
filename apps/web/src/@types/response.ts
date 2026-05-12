export type ApiResponse<T> = {
  timestamp: string
  statusCode: number
  data: T
  message: string
}

export type PaginatedApiResponse<T = []> = {
  timestamp: string
  statusCode: number
  data: {
    content: T
    currentPage: number
    hasNext: boolean
    hasPrevious: boolean
    nextPage: number | null
    pageSize: number
    previousPage: number | null
    totalElements: number
    totalPages: number
  }
  message: string
}
