import { useCallback, useEffect } from 'react'
import { z } from 'zod'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { type ApiResponse, type ChatGroup, type ChatUser } from '@/@types'
import { toast } from '@/components/ui/toast'
import { files } from '@/lib/queries/file'
import { httpClient } from '@/lib/repository/http-client'
import { HttpError } from '@/lib/repository/http-error'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FormProvider, RHFTextField, RHFUploadAvatar } from '@/components/hook-form'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { type CustomFile } from '@/components/upload'
import { getInitials } from '@/lib/utils'

const groupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Group name is required.')
    .max(100, 'Group name must be 100 characters or fewer.'),
  avatar: z.custom<CustomFile>(
    (value) => value instanceof File,
    'Group avatar is required.'
  ),
  members: z
    .array(z.string())
    .min(2, 'Select at least two members.')
    .refine(
      (members) => new Set(members).size === members.length,
      'Each member can only be selected once.'
    ),
})

type GroupForm = z.infer<typeof groupSchema>

type CreateGroupDialogProps = {
  users: ChatUser[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: (group: ChatGroup) => void
}

export function CreateGroupDialog({
  users,
  open,
  onOpenChange,
  onCreated,
}: CreateGroupDialogProps) {
  const form = useForm<GroupForm>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: '',
      avatar: undefined,
      members: [],
    },
  })
  const { mutateAsync: uploadFile } = useMutation(files().upload.mutationOptions())
  const avatar = useWatch({ control: form.control, name: 'avatar' })

  useEffect(() => () => {
    if (avatar?.preview) URL.revokeObjectURL(avatar.preview)
  }, [avatar])

  const handleAvatarDrop = useCallback((files: File[]) => {
    const file = files[0]
    if (!file) return
    const avatarFile = Object.assign(file, { preview: URL.createObjectURL(file) })
    form.setValue('avatar', avatarFile, {
      shouldDirty: true,
      shouldValidate: true,
    })
  }, [form])

  const handleOpenChange = (state: boolean) => {
    if (!state && form.formState.isSubmitting) return
    if (!state) form.reset()
    onOpenChange(state)
  }

  const onSubmit = async (values: GroupForm) => {
    const request = async () => {
      const uploadResponse = await uploadFile({
        file: values.avatar,
        subFolder: '/groups',
      })
      return httpClient.post<ApiResponse<ChatGroup>>('/group', {
        name: values.name,
        avatar: uploadResponse.data,
        members: values.members,
      })
    }

    toast.promise(request, {
      loading: 'Creating group…',
      success: (response) => response.message,
      error: (error) => error instanceof HttpError ? error.message : 'Unable to create group',
    })

    try {
      const response = await request()
      onCreated(response.data)
      form.reset()
      onOpenChange(false)
    } catch {
      return
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create group</DialogTitle>
          <DialogDescription>
            Add a name, avatar, and at least two people from this business.
          </DialogDescription>
        </DialogHeader>

        <FormProvider
          id='create-group-form'
          methods={form}
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className='space-y-5'>
            <RHFUploadAvatar
              name='avatar'
              fieldLabel='Group avatar'
              accept={{ 'image/*': [] }}
              maxSize={3 * 1024 * 1024}
              disabled={form.formState.isSubmitting}
              onDrop={handleAvatarDrop}
            />

            <RHFTextField
              name='name'
              fieldLabel='Group name'
              placeholder='Design team'
              maxLength={100}
              disabled={form.formState.isSubmitting}
            />

            <Controller
              control={form.control}
              name='members'
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className='flex items-center justify-between gap-4'>
                    <FieldLabel>Members</FieldLabel>
                    <span className='text-xs text-muted-foreground'>
                      {field.value.length} selected
                    </span>
                  </div>
                  <Command className='rounded-lg border'>
                    <CommandInput placeholder='Search people…' />
                    <CommandList className='max-h-52 mt-1'>
                      <CommandEmpty>No people found.</CommandEmpty>
                      <CommandGroup>
                        {users.map((user) => {
                          const selected = field.value.includes(user.id)
                          return (
                            <CommandItem
                              key={user.id}
                              value={`${user.fullname} ${user.email}`}
                              data-checked={selected}
                              aria-selected={selected}
                              disabled={form.formState.isSubmitting}
                              onSelect={() =>
                                field.onChange(selected ? field.value.filter((id) => id !== user.id) : [...field.value, user.id])
                              }
                              className='bg-transparent data-[checked=false]:bg-transparent'
                            >
                              <Avatar className='size-8'>
                                <AvatarImage
                                  src={user.avatar ?? undefined}
                                  alt={user.fullname}
                                />
                                <AvatarFallback>
                                  {getInitials(user.fullname)}
                                </AvatarFallback>
                              </Avatar>
                              <div className='min-w-0 flex-1'>
                                <span className='block truncate font-medium'>
                                  {user.fullname}
                                </span>
                                <span className='block truncate text-xs text-muted-foreground'>
                                  {user.email}
                                </span>
                              </div>
                            </CommandItem>
                          )
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
        </FormProvider>

        <DialogFooter>
          <Button
            type='button'
            variant='outline'
            disabled={form.formState.isSubmitting}
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            form='create-group-form'
            disabled={form.formState.isSubmitting}
          >
            Create group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
