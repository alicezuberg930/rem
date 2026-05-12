import { useFormContext, Controller } from 'react-hook-form'
import { Field, FieldError, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'

type RHFTextFieldProps = React.ComponentProps<'input'> & {
  name: string
  fieldLabel: string
}

export const RHFTextField = ({
  name,
  fieldLabel,
  ...other
}: RHFTextFieldProps) => {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error, invalid } }) => (
        <Field data-invalid={invalid}>
          <FieldLabel htmlFor={field.name}>{fieldLabel}</FieldLabel>
          <Input
            {...other}
            {...field}
            id={field.name}
            aria-invalid={invalid}
            autoComplete='off'
          />
          {invalid && <FieldError errors={[error]} />}
        </Field>
      )}
    />
  )
}

type RHFTextAreaProps = React.ComponentProps<'textarea'> & {
  name: string
  fieldLabel: string
}

export const RHFTextArea = ({
  name,
  fieldLabel,
  ...other
}: RHFTextAreaProps) => {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error, invalid } }) => (
        <Field data-invalid={invalid}>
          <FieldLabel htmlFor={field.name}>{fieldLabel}</FieldLabel>
          <Textarea
            {...other}
            {...field}
            id={field.name}
            aria-invalid={invalid}
            autoComplete='off'
          />
          {invalid && <FieldError errors={[error]} />}
        </Field>
      )}
    />
  )
}
