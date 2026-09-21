import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import type { Contact } from '@/@types'
import { toast } from '@/components/ui/toast'
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
import { useContacts } from './contacts-provider'

type ContactsActionDialogProps = {
  currentRow?: Contact
  open: boolean
  onOpenChange: (open: boolean) => void
}

const contactTypes = [
  { label: 'Personal', value: 'PERSONAL' },
  { label: 'Company', value: 'COMPANY' },
]

const textValue = (value: string | null | undefined) => value ?? ''
const nullableText = (value: string | null) => {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

function buildDefaultValues(currentRow?: Contact): ContactForm {
  return {
    tagId: currentRow?.tag?.id ?? '',
    type: currentRow?.type ?? 'PERSONAL',
    firstName: currentRow?.firstName ?? '',
    lastName: currentRow?.lastName ?? '',
    surname: currentRow?.surname ?? '',
    phone: currentRow?.phone ?? '',
    mobilePhone: textValue(currentRow?.mobilePhone),
    email: currentRow?.email ?? '',
    birthday: textValue(currentRow?.birthday),
    occupation: textValue(currentRow?.occupation),
    taxCode: currentRow?.taxCode ?? '',
    website: textValue(currentRow?.website),
    facebook: textValue(currentRow?.facebook),
    instagram: textValue(currentRow?.instagram),
    zalo: textValue(currentRow?.zalo),
    identityCard: textValue(currentRow?.identityCard),
    identityIssuedOn: textValue(currentRow?.identityIssuedOn),
    identityIssuedAt: textValue(currentRow?.identityIssuedAt),
    insuranceNumber: textValue(currentRow?.insuranceNumber),
    note: textValue(currentRow?.note),
    address1: textValue(currentRow?.address1),
    address2: textValue(currentRow?.address2),
    country: textValue(currentRow?.country),
    zipCode: textValue(currentRow?.zipCode),
  }
}

function normalizeValues(values: ContactForm): ContactForm {
  return {
    ...values,
    mobilePhone: nullableText(values.mobilePhone),
    birthday: nullableText(values.birthday),
    occupation: nullableText(values.occupation),
    website: nullableText(values.website),
    facebook: nullableText(values.facebook),
    instagram: nullableText(values.instagram),
    zalo: nullableText(values.zalo),
    identityCard: nullableText(values.identityCard),
    identityIssuedOn: nullableText(values.identityIssuedOn),
    identityIssuedAt: nullableText(values.identityIssuedAt),
    insuranceNumber: nullableText(values.insuranceNumber),
    note: nullableText(values.note),
    address1: nullableText(values.address1),
    address2: nullableText(values.address2),
    country: nullableText(values.country),
    zipCode: nullableText(values.zipCode),
  }
}

export function ContactsActionDialog({
  currentRow,
  open,
  onOpenChange,
}: ContactsActionDialogProps) {
  const { tags } = useContacts()
  const update = useMutation(contacts().update.mutationOptions())
  const create = useMutation(contacts().create.mutationOptions())
  const isEdit = Boolean(currentRow)
  const form = useForm<ContactForm>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: buildDefaultValues(currentRow),
  })

  const onSubmit = async (values: ContactForm) => {
    const input = normalizeValues(values)
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
      loading: isEdit ? 'Updating contact' : 'Creating contact',
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
      <DialogContent className='sm:max-w-5xl'>
        <DialogHeader className='text-start'>
          <DialogTitle>
            {isEdit ? 'Edit Contact' : 'Add New Contact'}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the contact record.' : 'Create a contact record.'}{' '}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className='max-h-[70vh] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <FormProvider
            id='contacts-form'
            methods={form}
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className='space-y-6 px-0.5'>
              <FieldGroup>
                <div className='grid gap-4 sm:grid-cols-3'>
                  <RFHStyledSelect
                    groups={[{ items: contactTypes }]}
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
                  <RHFTextField name='taxCode' fieldLabel='Tax Code' />
                  <RHFTextField name='firstName' fieldLabel='First Name' />
                  <RHFTextField name='lastName' fieldLabel='Last Name' />
                  <RHFTextField name='surname' fieldLabel='Surname' />
                  <RHFTextField name='phone' fieldLabel='Phone' />
                  <RHFTextField name='mobilePhone' fieldLabel='Mobile Phone' />
                  <RHFTextField name='email' fieldLabel='Email' type='email' />
                  <RHFTextField
                    name='birthday'
                    fieldLabel='Birthday'
                    type='date'
                  />
                  <RHFTextField name='occupation' fieldLabel='Occupation' />
                  <RHFTextField name='website' fieldLabel='Website' />
                  <RHFTextField name='facebook' fieldLabel='Facebook' />
                  <RHFTextField name='instagram' fieldLabel='Instagram' />
                  <RHFTextField name='zalo' fieldLabel='Zalo' />
                </div>
              </FieldGroup>
              <FieldGroup>
                <div className='grid gap-4 sm:grid-cols-3'>
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
                  <RHFTextField
                    name='insuranceNumber'
                    fieldLabel='Insurance Number'
                  />
                  <RHFTextField name='country' fieldLabel='Country' />
                  <RHFTextField name='zipCode' fieldLabel='Zip Code' />
                  <RHFTextField name='address1' fieldLabel='Address 1' />
                  <RHFTextField name='address2' fieldLabel='Address 2' />
                </div>
              </FieldGroup>
              <FieldGroup>
                <RHFTextArea name='note' fieldLabel='Note' rows={4} />
              </FieldGroup>
            </div>
          </FormProvider>
        </div>
        <DialogFooter>
          <Button
            type='submit'
            form='contacts-form'
            disabled={create.isPending || update.isPending}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
