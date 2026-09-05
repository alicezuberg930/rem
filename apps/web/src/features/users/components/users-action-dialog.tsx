import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { HttpError } from '@/lib/repository/http-error'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
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
  RHFPasswordField,
  RHFTextField,
} from '@/components/hook-form'
import RHFSwitch from '@/components/hook-form/RHFSwitch'
import { users } from '@/lib/queries/user'
import { type User } from '../data/schema'

const userFormSchema = z
  .object({
    fullname: z.string().trim().min(1, 'Full name is required.').max(100),
    email: z.email('A valid email is required.').max(100),
    phone: z.string().trim().min(1, 'Phone is required.').max(20),
    birthday: z.string(),
    password: z.string(),
    confirmPassword: z.string(),
    roleId: z.string().min(1, 'Role is required.'),
    salary: z
      .string()
      .trim()
      .regex(/^\d+$/, 'Salary must be a non-negative whole number.'),
    dependants: z
      .string()
      .trim()
      .regex(/^\d+$/, 'Dependants must be a non-negative whole number.'),
    bankOwner: z.string().max(255),
    bankAccount: z.string().max(255),
    bankName: z.string().max(255),
    bankCode: z.string().max(255),
    bankBranch: z.string().max(255),
    isActive: z.boolean(),
    isVerified: z.boolean(),
    isEdit: z.boolean(),
  })
  .refine(
    ({ isEdit, password }) => (isEdit && !password) || password.length > 0,
    { message: 'Password is required.', path: ['password'] }
  )
  .refine(
    ({ isEdit, password }) => (isEdit && !password) || password.length >= 8,
    {
      message: 'Password must be at least 8 characters long.',
      path: ['password'],
    }
  )
  .refine(
    ({ isEdit, password }) => (isEdit && !password) || /[a-z]/.test(password),
    {
      message: 'Password must contain a lowercase letter.',
      path: ['password'],
    }
  )
  .refine(
    ({ isEdit, password }) => (isEdit && !password) || /\d/.test(password),
    {
      message: 'Password must contain a number.',
      path: ['password'],
    }
  )
  .refine(
    ({ isEdit, password, confirmPassword }) =>
      (isEdit && !password && !confirmPassword) ||
      password === confirmPassword,
    { message: "Passwords don't match.", path: ['confirmPassword'] }
  )

type UserForm = z.infer<typeof userFormSchema>

type UserActionDialogProps = {
  currentRow?: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersActionDialog({
  currentRow,
  open,
  onOpenChange,
}: UserActionDialogProps) {
  const isEdit = !!currentRow
  const formId = isEdit ? 'user-edit-form' : 'user-create-form'
  const createUser = useMutation(users().create.mutationOptions())
  const updateUser = useMutation(users().update.mutationOptions())
  const { data: roles = [] } = useQuery({
    ...users().roles.queryOptions(),
    enabled: open,
  })
  const form = useForm<UserForm>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      fullname:
        currentRow?.fullname ??
        [currentRow?.firstName, currentRow?.lastName].filter(Boolean).join(' '),
      email: currentRow?.email ?? '',
      phone: currentRow?.phone ?? currentRow?.phoneNumber ?? '',
      birthday: currentRow?.birthday ?? '',
      password: '',
      confirmPassword: '',
      roleId: currentRow?.roleId ?? '',
      salary: String(currentRow?.salary ?? 0),
      dependants: String(currentRow?.dependants ?? 0),
      bankOwner: currentRow?.bankOwner ?? '',
      bankAccount: currentRow?.bankAccount ?? '',
      bankName: currentRow?.bankName ?? '',
      bankCode: currentRow?.bankCode ?? '',
      bankBranch: currentRow?.bankBranch ?? '',
      isActive: currentRow?.isActive ?? currentRow?.status === 'active',
      isVerified: currentRow?.isVerified ?? !isEdit,
      isEdit,
    },
  })

  useEffect(() => {
    if (!currentRow || form.getValues('roleId')) return
    const role = roles.find(
      ({ name }) => name.toLowerCase() === currentRow.role.toLowerCase()
    )
    if (role) form.setValue('roleId', role.id)
  }, [currentRow, form, roles])

  const onSubmit = (values: UserForm) => {
    const input = {
      fullname: values.fullname,
      email: values.email,
      phone: values.phone,
      birthday: values.birthday ?? null,
      roleId: values.roleId,
      salary: Number(values.salary),
      dependants: Number(values.dependants),
      bankOwner: values.bankOwner ?? null,
      bankAccount: values.bankAccount ?? null,
      bankName: values.bankName ?? null,
      bankCode: values.bankCode ?? null,
      bankBranch: values.bankBranch ?? null,
      isActive: values.isActive,
      isVerified: values.isVerified,
    }
    const submit = async () => {
      const response =
        isEdit && currentRow
          ? await updateUser.mutateAsync({
            ...input,
            id: currentRow.id,
            password: values.password,
            confirmPassword: values.confirmPassword,
          })
          : await createUser.mutateAsync({
            ...input,
            password: values.password,
            confirmPassword: values.confirmPassword,
          })
      form.reset()
      onOpenChange(false)
      return response
    }

    toast.promise(submit, {
      loading: isEdit ? 'Updating user' : 'Creating user',
      error: (error) =>
        error instanceof HttpError ? error.message : 'Internal server error',
      success: (response) => response.message,
    })
  }

  const isPending = createUser.isPending || updateUser.isPending

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
          <DialogTitle>{isEdit ? 'Edit User' : 'Add New User'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the user and their current business membership.'
              : 'Create a user and assign their membership in the current business.'}
          </DialogDescription>
        </DialogHeader>
        <div className='h-120 w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <FormProvider
            id={formId}
            methods={form}
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className='space-y-6 px-0.5'>
              <FieldGroup>
                <h3 className='font-medium'>User details</h3>
                <div className='grid gap-4 sm:grid-cols-2'>
                  <RHFTextField name='fullname' fieldLabel='Full Name' />
                  <RHFTextField name='email' fieldLabel='Email' type='email' />
                  <RHFTextField name='phone' fieldLabel='Phone' />
                  <RHFTextField
                    name='birthday'
                    fieldLabel='Birthday'
                    type='date'
                  />
                  <RHFPasswordField
                    name='password'
                    fieldLabel={isEdit ? 'New Password' : 'Password'}
                  />
                  <RHFPasswordField
                    name='confirmPassword'
                    fieldLabel='Confirm Password'
                  />
                </div>
              </FieldGroup>

              <FieldGroup>
                <h3 className='font-medium'>Business membership</h3>
                <div className='grid gap-4 sm:grid-cols-3'>
                  <RFHStyledSelect
                    groups={[
                      {
                        items: roles.map((role) => ({
                          label: role.name,
                          value: role.id,
                        })),
                      },
                    ]}
                    name='roleId'
                    fieldLabel='Role'
                  />
                  <RHFTextField
                    name='salary'
                    fieldLabel='Salary'
                    type='number'
                    min='0'
                    step='1'
                  />
                  <RHFTextField
                    name='dependants'
                    fieldLabel='Dependants'
                    type='number'
                    min='0'
                    step='1'
                  />
                </div>
                <div className='flex flex-wrap gap-6'>
                  <RHFSwitch name='isActive' label='Active membership' />
                  <RHFSwitch name='isVerified' label='Verified user' />
                </div>
              </FieldGroup>

              <FieldGroup>
                <h3 className='font-medium'>Bank details</h3>
                <div className='grid gap-4 sm:grid-cols-2'>
                  <RHFTextField name='bankOwner' fieldLabel='Account Owner' />
                  <RHFTextField
                    name='bankAccount'
                    fieldLabel='Account Number'
                  />
                  <RHFTextField name='bankName' fieldLabel='Bank Name' />
                  <RHFTextField name='bankCode' fieldLabel='Bank Code' />
                  <RHFTextField name='bankBranch' fieldLabel='Bank Branch' />
                </div>
              </FieldGroup>
            </div>
          </FormProvider>
        </div>
        <DialogFooter className='gap-y-2'>
          <DialogClose>
            <Button type='button' variant='outline'>
              Cancel
            </Button>
          </DialogClose>
          <Button type='submit' form={formId} disabled={isPending}>
            {isEdit ? 'Save Changes' : 'Create User'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
