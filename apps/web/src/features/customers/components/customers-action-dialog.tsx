import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import type { Contact } from '@/@types'
import { toast } from 'sonner'
import { getCookie } from '@/lib/cookies'
import { contacts } from '@/lib/queries/contact'
import { HttpError } from '@/lib/repository/http-error'
import { contactFormSchema, type ContactForm } from '@/lib/validators/contact'
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
  RHFTextArea,
  RHFTextField,
} from '@/components/hook-form'
import { useCustomers } from './customer-provider'

type CustomersActionDialogProps = {
  currentRow?: Contact
  open: boolean
  onOpenChange: (open: boolean) => void
}

const nullable = (value: string | null | undefined) => value ?? ''

export function CustomersActionDialog({
  currentRow,
  open,
  onOpenChange,
}: CustomersActionDialogProps) {
  const { tags, customerGroups } = useCustomers()
  const update = useMutation(contacts().update.mutationOptions())
  const create = useMutation(contacts().create.mutationOptions())
  const isEdit = Boolean(currentRow)
  const form = useForm<ContactForm>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      businessId: getCookie('X-Business-Id') ?? '',
      customerGroupId: currentRow?.customerGroup?.id ?? 'none',
      tagId: currentRow?.tag?.id ?? '',
      type: currentRow?.type ?? 'PERSONAL',
      firstName: currentRow?.firstName ?? '',
      lastName: currentRow?.lastName ?? '',
      surname: currentRow?.surname ?? '',
      phone: currentRow?.phone ?? '',
      mobilePhone: nullable(currentRow?.mobilePhone),
      email: currentRow?.email ?? '',
      birthday: nullable(currentRow?.birthday),
      occupation: nullable(currentRow?.occupation),
      taxCode: nullable(currentRow?.taxCode),
      website: nullable(currentRow?.website),
      facebook: nullable(currentRow?.facebook),
      instagram: nullable(currentRow?.instagram),
      zalo: nullable(currentRow?.zalo),
      identityCard: nullable(currentRow?.identityCard),
      identityIssuedOn: nullable(currentRow?.identityIssuedOn),
      identityIssuedAt: nullable(currentRow?.identityIssuedAt),
      insuranceNumber: nullable(currentRow?.insuranceNumber),
      note: nullable(currentRow?.note),
      address1: nullable(currentRow?.address1),
      address2: nullable(currentRow?.address2),
      country: nullable(currentRow?.country),
      zipCode: nullable(currentRow?.zipCode),
    },
  })

  useEffect(() => {
    if (open && !currentRow && tags[0] && !form.getValues('tagId')) {
      form.setValue('tagId', tags[0].id)
    }
  }, [currentRow, form, open, tags])

  const onSubmit = async (values: ContactForm) => {
    const input = {
      ...values,
      customerGroupId:
        values.customerGroupId === 'none' ? null : values.customerGroupId,
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
        <div className='h-120 w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <FormProvider
            id='customers-form'
            methods={form}
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className='space-y-4 px-0.5'>
              <FieldGroup>
                <div className='grid gap-4 sm:grid-cols-3'>
                  <RFHStyledSelect
                    groups={[
                      {
                        items: [
                          { label: 'Personal', value: 'PERSONAL' },
                          { label: 'Company', value: 'COMPANY' },
                        ],
                      },
                    ]}
                    name='type'
                    fieldLabel='Type'
                  />
                  <RFHStyledSelect
                    groups={[
                      {
                        items: tags.map((tag) => ({
                          label: tag.name,
                          value: tag.id,
                        })),
                      },
                    ]}
                    name='tagId'
                    fieldLabel='Tag'
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
                </div>
                <div className='grid gap-4 sm:grid-cols-3'>
                  <RHFTextField name='firstName' fieldLabel='First Name' />
                  <RHFTextField name='lastName' fieldLabel='Last Name' />
                  <RHFTextField name='surname' fieldLabel='Surname' />
                </div>
                <div className='grid gap-4 sm:grid-cols-2'>
                  <RHFTextField name='phone' fieldLabel='Phone' />
                  <RHFTextField name='mobilePhone' fieldLabel='Mobile Phone' />
                  <RHFTextField name='email' fieldLabel='Email' type='email' />
                  <RHFTextField name='birthday' fieldLabel='Birthday' />
                  <RHFTextField name='occupation' fieldLabel='Occupation' />
                  <RHFTextField name='taxCode' fieldLabel='Tax Code' />
                  <RHFTextField name='website' fieldLabel='Website' />
                  <RHFTextField
                    name='insuranceNumber'
                    fieldLabel='Insurance Number'
                  />
                  <RHFTextField
                    name='identityCard'
                    fieldLabel='Identity Card'
                  />
                  <RHFTextField
                    name='identityIssuedOn'
                    fieldLabel='Identity Issued On'
                    type='date'
                  />
                  <RHFTextField
                    name='identityIssuedAt'
                    fieldLabel='Identity Issued At'
                  />
                  <RHFTextField name='zalo' fieldLabel='Zalo' />
                  <RHFTextField name='facebook' fieldLabel='Facebook' />
                  <RHFTextField name='instagram' fieldLabel='Instagram' />
                  <RHFTextField name='address1' fieldLabel='Address 1' />
                  <RHFTextField name='address2' fieldLabel='Address 2' />
                  <RHFTextField name='country' fieldLabel='Country' />
                  <RHFTextField name='zipCode' fieldLabel='Zip Code' />
                </div>
                <RHFTextArea name='note' fieldLabel='Note' />
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
