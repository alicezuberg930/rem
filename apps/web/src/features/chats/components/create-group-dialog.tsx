import { useCallback, useEffect } from 'react'
import { z } from 'zod'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { type ApiResponse, type ChatGroup, type ChatUser } from '@/@types'
import { Check } from 'lucide-react'
import { toast } from 'sonner'
import { uploadFile } from '@/lib/repository/api'
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { type CustomFile, UploadAvatar } from '@/components/upload'
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
  const avatar = useWatch({ control: form.control, name: 'avatar' })

  useEffect(() => () => {
    if (avatar?.preview) URL.revokeObjectURL(avatar.preview)
  }, [avatar])

  const handleAvatarDrop = useCallback((files: File[]) => {
    const file = files[0]
    if (!file) return
    const avatarFile = Object.assign(file, {
      preview: URL.createObjectURL(file),
    })
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
    const request = (async () => {
      const uploadResponse = await uploadFile(values.avatar, '/groups')
      return httpClient.post<ApiResponse<ChatGroup>>('/group', {
        name: values.name,
        avatar: uploadResponse.data,
        members: values.members,
      })
    })()

    toast.promise(request, {
      loading: 'Creating group…',
      success: (response) => response.message,
      error: (error) => error instanceof HttpError ? error.message : 'Unable to create group',
    })

    try {
      const response = await request
      onCreated(response.data)
      form.reset()
      onOpenChange(false)
    } catch {
      return
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-xl'>
        <DialogHeader>
          <DialogTitle>Create group</DialogTitle>
          <DialogDescription>
            Add a name, avatar, and at least two people from this business.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id='create-group-form'
            className='space-y-5'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name='avatar'
              render={({ fieldState }) => (
                <FormItem>
                  <FormLabel className='sr-only'>Group avatar</FormLabel>
                  <UploadAvatar
                    accept={{ 'image/*': [] }}
                    maxSize={3 * 1024 * 1024}
                    file={avatar}
                    error={fieldState.invalid}
                    disabled={form.formState.isSubmitting}
                    onDrop={handleAvatarDrop}
                  />
                  <FormMessage className='text-center' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Design team'
                      autoComplete='off'
                      maxLength={100}
                      disabled={form.formState.isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='members'
              render={({ field }) => (
                <FormItem>
                  <div className='flex items-center justify-between gap-4'>
                    <FormLabel>Members</FormLabel>
                    <span className='text-xs text-muted-foreground'>
                      {field.value.length} selected
                    </span>
                  </div>
                  <Command className='rounded-lg border'>
                    <CommandInput placeholder='Search people…' />
                    <CommandList className='max-h-52'>
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
                                field.onChange(
                                  selected
                                    ? field.value.filter((id) => id !== user.id)
                                    : [...field.value, user.id]
                                )
                              }
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
                              {selected && <Check className='size-4' />}
                            </CommandItem>
                          )
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

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
