// hooks
import { useForm } from 'react-hook-form'
// utils
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
// types
import { Campaign, CAMPAIGN_SEND_TYPE } from '@/@types'
import { toast } from 'sonner'
import { campaigns } from '@/lib/queries/campaign'
import { HttpError } from '@/lib/repository/http-error'
import { CampaignValidators } from '@/lib/validators'
// components
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
  RHFMultiSelect,
  RHFSingleDatePicker,
  RHFTextField,
} from '@/components/hook-form'
import { useCampaigns } from './campaign-provider'

type CampaignActionDialogProps = {
  currentRow?: Campaign
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CampaignsActionDialog({
  currentRow,
  open,
  onOpenChange,
}: CampaignActionDialogProps) {
  const { templates, contacts } = useCampaigns()
  const update = useMutation(campaigns().update.mutationOptions())
  const create = useMutation(campaigns().create.mutationOptions())

  const isEdit = !!currentRow
  const form = useForm<CampaignValidators.CampaignForm>({
    resolver: zodResolver(CampaignValidators.formSchema),
    defaultValues: isEdit
      ? {
          name: currentRow.name,
          description: currentRow.description,
          // status: currentRow.status,
          sendType: currentRow.sendType,
          templateId: currentRow.template.id,
          contactIds: currentRow!.contacts.map((contact) => contact.id),
          ...(currentRow.scheduleAt && {
            scheduleAt: new Date(currentRow.scheduleAt),
          }),
          isEdit,
        }
      : {
          contactIds: [],
          templateId: templates.length > 0 ? templates[0].id : undefined,
          name: '',
          description: '',
          // status: 'PENDING',
          sendType: 'SCHEDULED',
          scheduleAt: null,
          isEdit,
        },
  })

  const { handleSubmit, reset } = form

  const onSubmit = async (values: CampaignValidators.CampaignForm) => {
    const submit = async () => {
      const res =
        isEdit && currentRow?.id
          ? await update.mutateAsync(values)
          : await create.mutateAsync(values)
      form.reset()
      onOpenChange(false)
      return res
    }
    toast.promise(submit, {
      loading: 'Submitting data',
      error: (err) => (err as HttpError).message,
      success: (data) => data?.message,
    })
  }

  // const statuses = Object.entries(CAMPAIGN_STATUS).map(status => ({ label: status[0], value: status[1] }))

  const types = Object.entries(CAMPAIGN_SEND_TYPE).map((status) => ({
    label: status[0],
    value: status[1],
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
            {isEdit ? 'Edit Campaign' : 'Add New Campaign'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the Campaign here. '
              : 'Create new Campaign here. '}
            Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className='h-105 w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <FormProvider
            id='campaigns-form'
            methods={form}
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className='space-y-4 px-0.5'>
              <FieldGroup>
                <RHFTextField name='name' fieldLabel='Name' />
                <RHFTextField name='description' fieldLabel='Description' />
                <div className='flex gap-2'>
                  <RFHStyledSelect
                    groups={[{ items: types }]}
                    name='sendType'
                    fieldLabel='Send type'
                  />
                  {templates?.length > 0 && (
                    <RFHStyledSelect
                      groups={[
                        {
                          items: templates.map((template) => ({
                            label: template.name,
                            value: template.id,
                          })),
                        },
                      ]}
                      name='templateId'
                      fieldLabel='Choose template'
                    />
                  )}
                </div>
                <RHFSingleDatePicker
                  withTime={true}
                  placeholder='Pick a schedule date if you want to schedule later'
                  name='scheduleAt'
                  fieldLabel='Scheduled date'
                />
                {contacts?.length > 0 && (
                  <RHFMultiSelect
                    options={contacts.map((contact) => ({
                      label: contact.firstName,
                      value: contact.id,
                    }))}
                    name='contactIds'
                    fieldLabel='Contacts'
                  />
                )}
              </FieldGroup>
            </div>
          </FormProvider>
        </div>
        <DialogFooter>
          <Button type='submit' form='campaigns-form'>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
