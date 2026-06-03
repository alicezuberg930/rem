// hooks
import { useForm } from 'react-hook-form'
// utils
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
// types
import { Template } from '@/@types'
import { toast } from 'sonner'
import { templates } from '@/lib/queries/template'
import { HttpError } from '@/lib/repository/http-error'
import { inlineQuillStyles } from '@/lib/utils'
import { TemplateValidators } from '@/lib/validators/template'
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
  RHFRichTextEditor,
  RHFTextField,
} from '@/components/hook-form'

type TemplateActionDialogProps = {
  currentRow?: Template
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TemplatesActionDialog({
  currentRow,
  open,
  onOpenChange,
}: TemplateActionDialogProps) {
  const update = useMutation(templates().update.mutationOptions())
  const create = useMutation(templates().create.mutationOptions())

  const isEdit = !!currentRow
  const form = useForm<TemplateValidators.TemplateForm>({
    resolver: zodResolver(TemplateValidators.formSchema),
    defaultValues: isEdit
      ? {
          ...currentRow,
          isEdit,
        }
      : {
          name: '',
          header: '',
          body: '',
          footer: '',
          websiteUrl: null,
          contactPhone: null,
          isEdit,
        },
  })

  const { handleSubmit, reset, setValue } = form

  const onSubmit = async (values: TemplateValidators.TemplateForm) => {
    const submit = async () => {
      setValue('header', inlineQuillStyles(values.header))
      setValue('body', inlineQuillStyles(values.body))
      setValue('footer', inlineQuillStyles(values.footer))
      // We need to inline the styles because Quill uses classes for styling,
      // and we want to preserve the styles when sending the data to the server.
      // The server will then store the inlined HTML, and we can render it without worrying about missing styles.
      // values = {
      //   ...values,
      //   header: inlineQuillStyles(values.header),
      //   body: inlineQuillStyles(values.body),
      //   footer: inlineQuillStyles(values.footer),
      // }
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
      error: (err) =>
        err instanceof HttpError ? err.message : 'Internal server error',
      success: (res) => res.message,
    })
  }

  // const handleDropThumbnail = useCallback((acceptedFiles: File[]) => {
  //   const file = acceptedFiles[0]
  //   if (!file) return
  //   const img = new window.Image()
  //   img.src = URL.createObjectURL(file)
  //   const newFile = Object.assign(file, {
  //     preview: URL.createObjectURL(file),
  //   })
  // setValue('thumbnail', newFile, { shouldValidate: true })
  // img.onload = () => {
  //   URL.revokeObjectURL(img.src)
  //   if (img.naturalWidth / img.naturalHeight !== 1) {
  //     setError('thumbnail', { type: 'manual', message: ('thumbnail_must_be_square') })
  //   } else {
  //     const newFile = Object.assign(file, {
  //       preview: URL.createObjectURL(file),
  //     })
  //     setValue('thumbnail', newFile, { shouldValidate: true })
  //   }
  // }
  // img.onerror = () => {
  //   URL.revokeObjectURL(img.src)
  //   setError('thumbnail', { type: 'manual', message: ('thumbnail_must_be_square') })
  // }
  // }, [setValue, setError])

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
            {isEdit ? 'Edit Template' : 'Add New Template'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the Template here. '
              : 'Create new Template here. '}
            Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className='h-105 w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <FormProvider
            id='templates-form'
            methods={form}
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className='space-y-4 px-0.5'>
              <FieldGroup>
                {/* <RHFUpload
                  multiple={false}
                  name='thumbnail'
                  maxSize={15728640}
                  onDrop={handleDropThumbnail}
                  onDelete={() => setValue('thumbnail', null, { shouldValidate: true })}
                  fieldLabel={('song_audio_file')}
                /> */}
                <RHFTextField name='name' fieldLabel='Name' />
                <RHFRichTextEditor name='header' fieldLabel='Header' />
                <RHFRichTextEditor name='body' fieldLabel='Body' />
                <RHFRichTextEditor name='footer' fieldLabel='Footer' />
                <RHFTextField name='websiteUrl' fieldLabel='Website URL' />
                <RHFTextField name='contactPhone' fieldLabel='Contact Phone' />
              </FieldGroup>
            </div>
          </FormProvider>
        </div>
        <DialogFooter>
          <Button type='submit' form='templates-form'>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
