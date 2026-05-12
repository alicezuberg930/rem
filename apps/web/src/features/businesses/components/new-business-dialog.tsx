import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { createBusiness } from '@/lib/repository/api'
import { HttpError } from '@/lib/repository/http-error'
import { slugify } from '@/lib/utils'
import { BusinessValidators } from '@/lib/validators/business'
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
import { FormProvider, RHFTextArea, RHFTextField } from '@/components/hook-form'

type CampaignActionDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewBusinessDialog({
  open,
  onOpenChange,
}: CampaignActionDialogProps) {
  const form = useForm<BusinessValidators.BusinessForm>({
    resolver: zodResolver(BusinessValidators.formSchema),
    defaultValues: {
      name: 'Rem Solution',
      description: 'Rem outsource company, a place for worshipping rem',
      slug: '',
      // logoUrl: null,
      workStartTime: undefined,
      insuranceContributionSalary: '1000000',
    },
  })

  const { handleSubmit, reset } = form

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'name') {
        form.setValue('slug', slugify(value.name || ''))
      }
    })
    return () => subscription.unsubscribe()
  }, [form])

  const onSubmit = async (values: BusinessValidators.BusinessForm) => {
    const submit = async () => {
      try {
        return await createBusiness(values)
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
          <DialogTitle>Create new business</DialogTitle>
          <DialogDescription>
            Create new business here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className='h-105 w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <FormProvider
            id='businesses-form'
            methods={form}
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className='space-y-4 px-0.5'>
              <FieldGroup>
                <RHFTextField name='name' fieldLabel='Name' />
                <RHFTextArea name='description' fieldLabel='Description' />
                <RHFTextField disabled name='slug' fieldLabel='Slug' />
                <RHFTextField
                  type='time'
                  name='workStartTime'
                  fieldLabel='Work start time'
                />
                <RHFTextField
                  type='number'
                  name='insuranceContributionSalary'
                  fieldLabel='Insurance Contribution Salary'
                />
              </FieldGroup>
            </div>
          </FormProvider>
        </div>
        <DialogFooter>
          <Button type='submit' form='businesses-form'>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
