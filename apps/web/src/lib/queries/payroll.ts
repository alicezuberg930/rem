import { queryOptions } from '@tanstack/react-query'
import type {
  ApiResponse,
  PaginatedApiResponse,
  PayrollItem,
  QueryPayroll,
} from '@/@types'
import { httpClient } from '../repository/http-client'

const keys = {
  all: (options: QueryPayroll) => ['payroll', 'list', options],
}

type PageResponse<T> = PaginatedApiResponse<T[]>['data']

export const payroll = () => ({
  all: {
    queryOptions: (options: QueryPayroll = {}) =>
      queryOptions({
        queryKey: keys.all(options),
        queryFn: async () => {
          const { data } = await httpClient.get<
            ApiResponse<PageResponse<PayrollItem>>
          >('/payrolls/items', options as Record<string, unknown>)
          return data
        },
      }),
  },
})
