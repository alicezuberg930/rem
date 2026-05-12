import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CALENDAR_BOOKING_STATUS, CalendarBooking } from '@/@types'
import { toast } from 'sonner'
import { createBooking, updateBooking } from '@/lib/repository/api'
import { HttpError } from '@/lib/repository/http-error'
import { BookingValidators } from '@/lib/validators/booking'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FieldGroup } from '@/components/ui/field'
import {
  FormProvider,
  RFHStyledSelect,
  RHFSingleDatePicker,
  RHFTextField,
} from '@/components/hook-form'
import { useBookings } from './bookings-provider'

type BookingActionDialogProps = {
  currentRow?: CalendarBooking
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BookingsActionDialog({
  currentRow,
  open,
  onOpenChange,
}: BookingActionDialogProps) {
  const { contacts } = useBookings()
  const isEdit = !!currentRow
  const form = useForm<BookingValidators.BookingForm>({
    resolver: zodResolver(BookingValidators.formSchema),
    defaultValues: isEdit
      ? {
          status: currentRow.status,
          contactId: currentRow.contact.id,
          bookingStartDate: new Date(currentRow.bookingStartDate),
          bookingEndDate: new Date(currentRow.bookingEndDate),
          serviceStaffId: currentRow.serviceStaff?.id,
          correspondentId: currentRow.correspondent?.id,
          cancelReason: currentRow.cancelReason,
          isEdit,
        }
      : {
          status: 'BOOKED',
          contactId: undefined,
          bookingStartDate: new Date(),
          bookingEndDate: new Date(),
          serviceStaffId: null,
          correspondentId: null,
          cancelReason: null,
          isEdit,
        },
  })

  const { handleSubmit, reset } = form

  const onSubmit = async (values: BookingValidators.BookingForm) => {
    const submit = async () => {
      let response
      try {
        if (values.isEdit) {
          response = await updateBooking(values, currentRow?.id!)
        } else {
          response = await createBooking(values)
        }
        return response
      } catch (error) {
        throw error
      } finally {
        form.reset()
        onOpenChange(false)
      }
    }
    toast.promise(submit, {
      loading: 'Submitting data',
      error: (err) => (err as HttpError).message,
      success: (data) => data?.message,
    })
  }

  const statuses = Object.entries(CALENDAR_BOOKING_STATUS).map((status) => ({
    label: status[1],
    value: status[0],
  }))

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-xl'>
        <DialogHeader className='text-start'>
          <DialogTitle>
            {isEdit ? 'Edit Booking' : 'Add New Booking'}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the Booking here. ' : 'Create new Booking here. '}
            Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className='h-105 w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <FormProvider
            id='bookings-form'
            methods={form}
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className='space-y-4 px-0.5'>
              <FieldGroup>
                <div className='flex gap-2'>
                  <RFHStyledSelect
                    groups={[{ items: statuses }]}
                    name='status'
                    fieldLabel='Status'
                  />
                </div>
                <div className='flex gap-2'>
                  <RHFSingleDatePicker
                    withTime={true}
                    placeholder='Pick a schedule date if you want to schedule later'
                    name='bookingStartDate'
                    fieldLabel='Booking start date'
                  />
                  <RHFSingleDatePicker
                    withTime={true}
                    placeholder='Pick a schedule date if you want to schedule later'
                    name='bookingEndDate'
                    fieldLabel='Booking end date'
                  />
                </div>
                {contacts?.length > 0 && (
                  <RFHStyledSelect
                    groups={[
                      {
                        items: contacts.map((contact) => ({
                          label: contact.firstName,
                          value: contact.id,
                        })),
                      },
                    ]}
                    name='contactId'
                    fieldLabel='Contacts'
                  />
                )}
                <RHFTextField
                  disabled={!isEdit}
                  name='cancelReason'
                  fieldLabel='Cancel reason'
                />
              </FieldGroup>
            </div>
          </FormProvider>
        </div>
        <DialogFooter>
          <Button type='submit' form='bookings-form'>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
