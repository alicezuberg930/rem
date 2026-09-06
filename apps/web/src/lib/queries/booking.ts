import { mutationOptions, queryOptions } from '@tanstack/react-query'
import type {
  ApiResponse,
  CalendarBooking,
  Contact,
  PaginatedApiResponse,
  QueryContact,
} from '@/@types'
import { queryClient } from '@/providers/query-provider'
import type { BookingValidators } from '@/lib/validators'
import { httpClient } from '../repository/http-client'

const keys = {
  root: ['bookings'] as const,
  all: ['bookings', 'list'] as const,
  contacts: (options: QueryContact) => ['bookings', 'contacts', options],
  create: ['bookings', 'create'] as const,
  update: ['bookings', 'update'] as const,
}

type PageResponse<T> = PaginatedApiResponse<T[]>['data']

export const bookings = () => ({
  all: {
    queryOptions: () =>
      queryOptions({
        queryKey: keys.all,
        queryFn: async () => {
          const { data } =
            await httpClient.get<ApiResponse<CalendarBooking[]>>(
              '/calendar-bookings'
            )
          return data
        },
      }),
  },

  contacts: {
    queryOptions: (options: QueryContact = { pageSize: 1_000 }) =>
      queryOptions({
        queryKey: keys.contacts(options),
        queryFn: async () => {
          const { data } = await httpClient.get<
            ApiResponse<PageResponse<Contact>>
          >('/contacts', options as Record<string, unknown>)
          return data.content
        },
      }),
  },

  create: {
    mutationOptions: () =>
      mutationOptions({
        mutationKey: keys.create,
        mutationFn: async (input: BookingValidators.BookingForm) =>
          httpClient.post<ApiResponse<CalendarBooking>>('/calendar-bookings', {
            ...input,
          }),
        onSuccess: () =>
          queryClient().invalidateQueries({ queryKey: keys.root }),
      }),
  },

  update: {
    mutationOptions: () =>
      mutationOptions({
        mutationKey: keys.update,
        mutationFn: async ({
          id,
          ...input
        }: BookingValidators.BookingForm & { id: string }) =>
          httpClient.put<ApiResponse<CalendarBooking>>(
            `/calendar-bookings/${id}`,
            { ...input }
          ),
        onSuccess: () =>
          queryClient().invalidateQueries({ queryKey: keys.root }),
      }),
  },
})
