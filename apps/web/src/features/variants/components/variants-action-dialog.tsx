import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import type { Variant } from '@/@types/variant'
import { Plus, Trash2 } from 'lucide-react'
import { variants } from '@/lib/queries/variant'
import { HttpError } from '@/lib/repository/http-error'
import { type VariantForm, variantSchema } from '@/lib/validators/variant'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/toast'
import { FormProvider, RHFTextField } from '@/components/hook-form'

type VariantActionDialogProps = {
  currentRow?: Variant
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function VariantsActionDialog({
  currentRow,
  open,
  onOpenChange,
}: VariantActionDialogProps) {
  const { mutateAsync: update } = useMutation(
    variants().update.mutationOptions()
  )
  const { mutateAsync: create } = useMutation(
    variants().create.mutationOptions()
  )
  const isEdit = Boolean(currentRow)

  const form = useForm<VariantForm>({
    resolver: zodResolver(variantSchema),
    defaultValues: isEdit
      ? {
        isEdit: true,
        name: currentRow?.name ?? '',
        options: currentRow?.options ?? [],
      }
      : {
        isEdit: false,
        name: '',
        options: [{ value: '' }],
      },
  })

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = form
  const { fields, remove, append } = useFieldArray({
    control,
    name: 'options',
  })

  const onSubmit = async ({ name, options }: VariantForm) => {
    const payload = {
      name,
      options: options.map(({ id, value }) => ({
        ...(id ? { id } : {}),
        value,
      })),
    }

    const submit = async () => {
      const response = isEdit && currentRow
        ? await update({ id: currentRow.id, ...payload })
        : await create(payload)
      reset()
      onOpenChange(false)
      return response
    }

    toast.promise(submit, {
      loading: isEdit ? 'Updating variant' : 'Creating variant',
      error: (error) => error instanceof HttpError ? error.message : 'Internal server error',
      success: (response) => response.message,
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!state) reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>{isEdit ? 'Edit variant' : 'Add variant'}</DialogTitle>
          <DialogDescription>
            Set the variant name and the values available for this option.
          </DialogDescription>
        </DialogHeader>

        <FormProvider
          id='variants-form'
          methods={form}
          onSubmit={handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <RHFTextField
              fieldLabel='Variant name'
              placeholder='Color'
              name='name'
            />

            <Field data-invalid={Boolean(errors.options)}>
              <div className='flex items-center justify-between gap-3'>
                <FieldLabel>Option values</FieldLabel>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => append({ value: '' })}
                >
                  <Plus data-icon='inline-start' />
                  Add option
                </Button>
              </div>

              <div className='max-h-64 space-y-3 overflow-y-auto py-1 pe-1'>
                {fields.map((option, index) => (
                  <div key={option.id} className='flex items-start gap-2'>
                    <div className='min-w-0 flex-1 space-y-1'>
                      <Input
                        aria-invalid={Boolean(errors.options?.[index]?.value)}
                        placeholder={index === 0 ? 'Red' : 'Option value'}
                        {...register(`options.${index}.value`)}
                      />
                      <FieldError errors={[errors.options?.[index]?.value]} />
                    </div>
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      aria-label={`Remove option ${index + 1}`}
                      disabled={fields.length === 1}
                      onClick={() => remove(index)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                ))}
              </div>

              <FieldError errors={[errors.options]} />
            </Field>
          </FieldGroup>
        </FormProvider>

        <DialogFooter>
          <Button type='submit' form='variants-form' disabled={isSubmitting}>
            {isEdit ? 'Save changes' : 'Create variant'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
