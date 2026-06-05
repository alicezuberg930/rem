import { mutationOptions, queryOptions } from '@tanstack/react-query'
import { ApiResponse, Attendance, PaginatedApiResponse, QueryAttendance } from '@/@types'
import { httpClient } from '../repository/http-client'
import { AttendanceValidators } from '../validators/attendance'

const keys = {
  checkIn: () => ['attendance', 'check-in'],
  me: () => ['attendance', 'me'],
  all: (opts: QueryAttendance) => ['templates', opts],

}

export const attendance = () => ({
  checkIn: {
    mutationOptions: () =>
      mutationOptions({
        mutationKey: keys.checkIn(),
        mutationFn: async (input: AttendanceValidators.CheckIn) => {
          return await httpClient.post<ApiResponse<Attendance>>(
            '/attendances/check-in',
            { ...input }
          )
        },
      }),
  },

  me: {
    queryOptions: () =>
      queryOptions({
        queryKey: keys.me(),
        queryFn: async () => {
          return await httpClient.get<PaginatedApiResponse<Attendance[]>>(
            '/attendances/me'
          )
        },
      }),
  },

  all: {
    queryOptions: (opts: QueryAttendance = {}) =>
      queryOptions({
        queryKey: keys.all(opts),
        queryFn: async () => {
          const { data } = await httpClient.get<
            PaginatedApiResponse<Attendance[]>
          >('/attendances/all', opts as Record<string, unknown>)
          return data
        },
      }),
  },
})
