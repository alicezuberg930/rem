import { memo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Clock } from 'lucide-react'
import { toast } from 'sonner'
import { attendance } from '@/lib/queries/attendance'
import { HttpError } from '@/lib/repository/http-error'
import { getCurrentLocation } from '@/lib/utils'
import { AttendanceValidators } from '@/lib/validators/attendance'
import { useAuth } from '@/context/auth-provider'
import { ConfirmDialog } from '../confirm-dialog'
import { FormProvider, RHFTextField } from '../hook-form'
import { Button } from '../ui/button'
import { FieldGroup } from '../ui/field'

export const ClockInButton: React.FC = memo(() => {
  const { mutateAsync: checkIn } = useMutation(
    attendance().checkIn.mutationOptions()
  )
  const { user } = useAuth()
  const [open, onOpenChange] = useState(false)

  const form = useForm<AttendanceValidators.CheckIn>({
    resolver: zodResolver(AttendanceValidators.checkInSchema),
    defaultValues: {
      note: '',
      checkInTime: undefined,
      checkOutTime: undefined,
      date: undefined,
      type: 'REMOTE',
      address: '',
      latitude: undefined,
      longitude: undefined,
    },
  })

  const { handleSubmit } = form

  const onSubmit = async (values: AttendanceValidators.CheckIn) => {
    if (!user) return
    const submit = async () => {
      try {
        let location = await getCurrentLocation()
        values.longitude = location.longitude
        values.latitude = location.latitude
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${location.latitude}&lon=${location.longitude}`
        )
        if (!response.ok)
          throw new Error('Failed to get address from coordinates')
        const data = await response.json()
        values.address = data.display_name
      } catch (err) {
        onOpenChange(false)
        toast.error((err as Error).message)
        return
      }
      let currentDate = new Date()
      values.checkInTime = currentDate
      values.date = currentDate
      let result = await checkIn(values)
      onOpenChange(false)
      return result
    }
    toast.promise(submit, {
      loading: 'Submitting data',
      error: (err) => (err as HttpError).message,
      success: (res) => res?.message,
    })
  }

  return (
    <>
      <Button
        variant='ghost'
        className='size-8 border-border bg-background shadow-xs max-md:scale-125'
        onClick={() => onOpenChange(true)}
      >
        <Clock />
      </Button>

      <ConfirmDialog
        open={open}
        onOpenChange={onOpenChange}
        title='Clock In'
        desc='Are you sure you want to clock in?'
        confirmText='Clock In'
        className='sm:max-w-sm'
      >
        <div>
          <FormProvider
            methods={form}
            onSubmit={handleSubmit(onSubmit)}
            id='confirm-btn'
          >
            <div className={'grid gap-3'}>
              <FieldGroup>
                <RHFTextField
                  name='note'
                  type='text'
                  fieldLabel='Note'
                  placeholder='Add a note...'
                />
              </FieldGroup>
            </div>
          </FormProvider>
        </div>
      </ConfirmDialog>
    </>
  )
})
