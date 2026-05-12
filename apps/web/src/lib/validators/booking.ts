import * as z from 'zod'
import { CalendarBookingStatus, CALENDAR_BOOKING_STATUS } from '@/@types'

export namespace BookingValidators {
  const calendarBookingSchema = z.union(
    Object.entries(CALENDAR_BOOKING_STATUS).map((type) =>
      z.literal(type[0] as CalendarBookingStatus)
    )
  )

  export const formSchema = z.object({
    status: calendarBookingSchema,
    contactId: z.string({ error: 'Contact is required' }),
    bookingStartDate: z.date({ error: 'Start date is required' }),
    bookingEndDate: z.date({ error: 'End date is required' }),
    serviceStaffId: z.string().nullable(),
    correspondentId: z.string().nullable(),
    cancelReason: z.string().nullable(),
    isEdit: z.boolean(),
  })
  // .refine(
  //     ({ scheduleAt, sendType }) => {
  //         if (sendType === "SCHEDULED") return !!scheduleAt
  //         return true
  //     },
  //     {
  //         message: 'Schedule date must be specified when send type is SCHEDULED.',
  //         path: ['scheduleAt'],
  //     }
  // )

  export type BookingForm = z.infer<typeof formSchema>
}
