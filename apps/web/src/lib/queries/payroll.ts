import { mutationOptions, queryOptions } from '@tanstack/react-query'
import type {
  ApiResponse,
  PaginatedApiResponse,
  PayrollItem,
  QueryPayroll,
} from '@/@types'
import { queryClient } from '@/providers/query-provider'
import { httpClient } from '../repository/http-client'

const keys = {
  root: ['payroll'] as const,
  all: (options: QueryPayroll) => ['payroll', 'list', options],
  generateAllEmployeePayroll: [
    'payroll',
    'generate-all-employee-payroll',
  ] as const,
  export: (options: QueryPayroll) => ['payroll', 'export', options],
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

  generateAllEmployeePayroll: {
    mutationOptions: () =>
      mutationOptions({
        mutationKey: keys.generateAllEmployeePayroll,
        mutationFn: async (periodId: string) =>
          httpClient.post<ApiResponse<PayrollItem[]>>(
            `/payrolls/period/${periodId}/generate`
          ),
        onSuccess: () =>
          queryClient().invalidateQueries({ queryKey: keys.root }),
      }),
  },

  export: {
    queryKey: keys.export,
    download: (options: QueryPayroll = {}) =>
      httpClient.download(
        '/payrolls/export',
        options as Record<string, unknown>
      ),
  },
})
