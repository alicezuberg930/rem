import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import type { Customer } from '@/@types'
import { toast } from '@/components/ui/toast'
import { customers } from '@/lib/queries/customer'
import { HttpError } from '@/lib/repository/http-error'
import {
  customerFormSchema,
  type CustomerForm,
} from '@/lib/validators/customer'
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
  RHFTextField,
} from '@/components/hook-form'
import { useCustomers } from './customer-provider'

type CustomersActionDialogProps = {
  currentRow?: Customer
  open: boolean
  onOpenChange: (open: boolean) => void
}

const today = () => new Date().toISOString().slice(0, 10)

export function CustomersActionDialog({
  currentRow,
  open,
  onOpenChange,
}: CustomersActionDialogProps) {
  const { contacts, customerGroups } = useCustomers()
  const update = useMutation(customers().update.mutationOptions())
  const create = useMutation(customers().create.mutationOptions())
  const isEdit = Boolean(currentRow)
  const form = useForm<CustomerForm>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      contactId: currentRow?.contact.id ?? '',
      customerGroupId: currentRow?.customerGroup?.id ?? 'none',
      customerSince: currentRow?.customerSince ?? today(),
    },
  })

  const onSubmit = async (values: CustomerForm) => {
    const input = {
      contactId: values.contactId,
      customerGroupId:
        values.customerGroupId === 'none' ? null : values.customerGroupId,
      customerSince: values.customerSince,
    }
    const submit = async () => {
      const response =
        isEdit && currentRow
          ? await update.mutateAsync({ id: currentRow.id, ...input })
          : await create.mutateAsync(input)
      form.reset()
      onOpenChange(false)
      return response
    }
    toast.promise(submit, {
      loading: isEdit ? 'Updating customer' : 'Creating customer',
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
      <DialogContent className='sm:max-w-3xl'>
        <DialogHeader className='text-start'>
          <DialogTitle>
            {isEdit ? 'Edit Customer' : 'Add New Customer'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the customer record.'
              : 'Create a customer record.'}{' '}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className='w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <FormProvider
            id='customers-form'
            methods={form}
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className='space-y-4 px-0.5'>
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
                        items: [
                          { label: 'No group', value: 'none' },
                          ...customerGroups.map((group) => ({
                            label: group.name,
                            value: group.id,
                          })),
                        ],
                      },
                    ]}
                    name='customerGroupId'
                    fieldLabel='Customer Group'
                  />
                  <RHFTextField
                    name='customerSince'
                    fieldLabel='Customer Since'
                    type='date'
                  />
                </div>
              </FieldGroup>
            </div>
          </FormProvider>
        </div>
        <DialogFooter>
          <Button
            type='submit'
            form='customers-form'
            disabled={create.isPending || update.isPending}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
