// hooks
import { useFieldArray, useForm } from 'react-hook-form'
// utils
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
// types
import { templates } from '@/lib/queries/template'
import { HttpError } from '@/lib/repository/http-error'
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
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { toast } from '@/components/ui/toast'
import {
  FormProvider,
  RHFTextField,
} from '@/components/hook-form'
import { VariantForm, variantSchema } from '@/lib/validators/variant'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'

type VariantActionDialogProps = {
  currentRow?: VariantForm
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function VariantsActionDialog({
  currentRow,
  open,
  onOpenChange,
}: VariantActionDialogProps) {
  const { mutateAsync: update } = useMutation(templates().update.mutationOptions())
  const { mutateAsync: create } = useMutation(templates().create.mutationOptions())

  const isEdit = !!currentRow
  const form = useForm<VariantForm>({
    resolver: zodResolver(variantSchema),
    defaultValues: isEdit
      ? {
        ...currentRow,
        isEdit,
      }
      : {
        isEdit,
        name: '',
        options: [
          {
            id: '',
            value: '',
          }
        ]
      },
  })

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = form

  const {
    fields: optionFields,
    remove,
    append
  } = useFieldArray({
    control,
    name: 'options',
  })

  const onSubmit = async (values: VariantForm) => {
    console.log(values)
    const submit = async () => {
      // const res = isEdit && currentRow?.id ? await update(values) : await create(values)
      form.reset()
      onOpenChange(false)
      // return res
    }
    //   toast.promise(submit, {
    //     loading: 'Submitting data',
    //     error: (err) => err instanceof HttpError ? err.message : 'Internal server error',
    //     success: (res) => res.message,
    //   })
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
            {isEdit ? 'Edit Variant' : 'Add New Variant'}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update existing Variant. ' : 'Create a new Variant. '}
            Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className='h-105 w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <FormProvider
            id='variants-form'
            methods={form}
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className='space-y-4 px-0.5'>
              <FieldGroup>
                {/* Variant name */}
                <RHFTextField fieldLabel='Variant name' placeholder='Color' name='name' />

                {/* Options */}
                <Field data-invalid={false}>
                  <FieldLabel htmlFor='options'>Options</FieldLabel>

                  {optionFields.map((option, optionIndex) => {
                    const optionError = errors.options?.[optionIndex]
                    return (
                      <div
                        key={option.id}
                        className="flex items-start gap-2"
                      >
                        {/* Option value */}
                        <div className="flex-1 space-y-1">
                          <Input
                            placeholder="Red"
                            {...register(`options.${optionIndex}.value`)}
                          />
                          {optionError?.value && <FieldError errors={[optionError]} className='mt-1' />}
                          {/* {optionError?.value && (
                            <p className="text-xs text-destructive">
                              {optionError.value.message}
                            </p>
                          )} */}
                        </div>
                        {/* Option ID */}
                        <div className="flex-1 space-y-1">
                          <Input
                            placeholder="Option ID (optional)"
                            {...register(`options.${optionIndex}.value`)}
                          />
                          {/* {optionError?.id && (
                            <p className="text-xs text-destructive">
                              {optionError.id.message}
                            </p>
                          )} */}
                        </div>

                        <Button
                          type="button"
                          size="icon"
                          onClick={() => remove(optionIndex)}
                          disabled={optionFields.length === 1}
                        >
                          <X />
                        </Button>
                      </div>
                    )
                  })}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ id: '', value: '' })}
                  >
                    Add option
                  </Button>
                </Field>
              </FieldGroup>
            </div>
          </FormProvider>
        </div>
        <DialogFooter>
          <Button type='submit' form='variants-form'>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}