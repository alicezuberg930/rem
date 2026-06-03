import * as z from 'zod'
import { CHECK_IN_TYPE, CheckInType } from '@/@types'

export namespace AttendanceValidators {
  const typeSchema = z.union(
    Object.entries(CHECK_IN_TYPE).map((type) =>
      z.literal(type[0] as CheckInType)
    )
  )

  export const checkInSchema = z
    .object({
      note: z.string().max(200, { error: 'Note is too long' }).optional(),
      checkInTime: z
        .date({ error: 'Check-in time must be a valid date' })
        .optional(),
      checkOutTime: z
        .date({ error: 'Check-out time must be a valid date' })
        .optional(),
      date: z.date({ error: 'Date must be a valid date' }).optional(),
      type: typeSchema,
      address: z.string().max(200, { error: 'Address is too long' }).optional(),
      // -90 to 90
      latitude: z
        .number({ error: 'Latitude must be a number' })
        .min(-90)
        .max(90)
        .optional(),
      // -180 to 180
      longitude: z
        .number({ error: 'Longitude must be a number' })
        .min(-180)
        .max(180)
        .optional(),
    })
    .refine(
      (data) => {
        if (data.checkOutTime && data.checkInTime) {
          return data.checkInTime < data.checkOutTime
        }
        return true
      },
      {
        message: 'Check-out time must be after check-in time',
        path: ['checkOutTime'],
      }
    )

  export type CheckIn = z.infer<typeof checkInSchema>
}
