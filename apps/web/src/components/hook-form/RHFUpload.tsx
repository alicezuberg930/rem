// form
import { useFormContext, Controller } from 'react-hook-form'
import { Field, FieldError, FieldLabel } from '../ui/field'
// components
import { UploadAvatar, Upload, type UploadProps } from '../upload'

interface Props extends Omit<UploadProps, 'file'> {
  name: string
  multiple?: boolean
  fieldLabel: string
}

export function RHFUploadAvatar({ name, ...other }: Readonly<Props>) {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Field data-invalid={!!error}>
          {/* <FieldLabel htmlFor={field.name}>{fieldLabel}</FieldLabel> */}
          <UploadAvatar
            accept={{ 'image/*': [] }}
            error={!!error}
            file={field.value}
            {...other}
          />
          {!!error && <FieldError errors={[error]} className='mt-1' />}
        </Field>
      )}
    />
  )
}

export function RHFUpload({
  name,
  multiple,
  helperText,
  fieldLabel,
  ...other
}: Readonly<Props>) {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) =>
        multiple ? (
          <Field data-invalid={!!error}>
            <FieldLabel htmlFor={field.name}>{fieldLabel}</FieldLabel>
            <Upload
              multiple
              accept={{ 'image/*': [] }}
              files={field.value}
              error={!!error}
              helperText={
                (!!error || helperText) && (
                  <FieldError errors={[error]} className='mt-3' />
                )
              }
              {...other}
            />
          </Field>
        ) : (
          <Field data-invalid={!!error}>
            <FieldLabel htmlFor={field.name}>{fieldLabel}</FieldLabel>
            <Upload
              accept={{ 'image/*': [] }}
              file={field.value}
              error={!!error}
              helperText={
                (!!error || helperText) && (
                  <FieldError errors={[error]} className='mt-3' />
                )
              }
              {...other}
            />
          </Field>
        )
      }
    />
  )
}
