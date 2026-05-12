import { Controller, useFormContext } from 'react-hook-form'
import { PasswordInput } from '../password-input'
import { Field, FieldError, FieldLabel } from '../ui/field'

type RHFTextFieldProps = React.ComponentProps<'input'> & {
  name: string
  fieldLabel: string
}

export const RHFPasswordField = ({
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
          <PasswordInput
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
