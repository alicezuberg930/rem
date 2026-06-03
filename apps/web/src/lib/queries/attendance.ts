import { mutationOptions, queryOptions } from '@tanstack/react-query'
import { ApiResponse, Attendance } from '@/@types'
import { httpClient } from '../repository/http-client'
import { AttendanceValidators } from '../validators/attendance'

const keys = {
  checkIn: () => ['attendance', 'check-in'],
  me: () => ['attendance', 'me'],
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
          return await httpClient.get<ApiResponse<Attendance[]>>(
            '/attendances/me'
          )
        },
      }),
  },
})
