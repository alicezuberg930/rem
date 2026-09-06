import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { LEAD_SOURCE, LEAD_STATUS, type Lead } from '@/@types'
import { toast } from 'sonner'
import { leads } from '@/lib/queries/lead'
import { HttpError } from '@/lib/repository/http-error'
import { leadFormSchema, type LeadForm } from '@/lib/validators/lead'
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
import { FormProvider, RFHStyledSelect } from '@/components/hook-form'
import { useLeads } from './leads-provider'

type LeadsActionDialogProps = {
  currentRow?: Lead
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LeadsActionDialog({
  currentRow,
  open,
  onOpenChange,
}: LeadsActionDialogProps) {
  const { contacts } = useLeads()
  const update = useMutation(leads().update.mutationOptions())
  const create = useMutation(leads().create.mutationOptions())
  const isEdit = Boolean(currentRow)
  const form = useForm<LeadForm>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      contactId: currentRow?.contact.id ?? '',
      source: currentRow?.source ?? 'WEBSITE',
      status: currentRow?.status ?? 'NEW',
    },
  })

  const onSubmit = async (values: LeadForm) => {
    const submit = async () => {
      const response =
        isEdit && currentRow
          ? await update.mutateAsync({ id: currentRow.id, ...values })
          : await create.mutateAsync(values)
      form.reset()
      onOpenChange(false)
      return response
    }
    toast.promise(submit, {
      loading: isEdit ? 'Updating lead' : 'Creating lead',
      error: (error) =>
        error instanceof HttpError ? error.message : 'Internal server error',
      success: (response) => response.message,
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader className='text-start'>
          <DialogTitle>{isEdit ? 'Edit Lead' : 'Add New Lead'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the lead record.' : 'Create a lead record.'}{' '}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <FormProvider
          id='leads-form'
          methods={form}
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <div className='grid gap-4 sm:grid-cols-2'>
              <RFHStyledSelect
                groups={[
                  {
                    items: contacts.map((contact) => ({
                      label: `${contact.firstName} ${contact.lastName} (${contact.email})`,
                      value: contact.id,
                    })),
                  },
                ]}
                name='contactId'
                fieldLabel='Contact'
              />
              <RFHStyledSelect
                groups={[
                  {
                    items: Object.entries(LEAD_SOURCE).map(([value, label]) => ({
                      label,
                      value,
                    })),
                  },
                ]}
                name='source'
                fieldLabel='Source'
              />
              <RFHStyledSelect
                groups={[
                  {
                    items: Object.entries(LEAD_STATUS).map(([value, label]) => ({
                      label,
                      value,
                    })),
                  },
                ]}
                name='status'
                fieldLabel='Status'
              />
            </div>
          </FieldGroup>
        </FormProvider>
        <DialogFooter>
          <Button
            type='submit'
            form='leads-form'
            disabled={create.isPending || update.isPending}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
