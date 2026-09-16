import { useFormContext, Controller } from 'react-hook-form'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Field, FieldError, FieldLabel } from '../ui/field'
import { MultiSelect, type MultiSelectProps } from '../ui/multi-select'
import { NativeSelect } from '../ui/native-select'

type RFHStyledSelectProps = {
  name: string
  fieldLabel: string
  groups: {
    label?: string
    items: { label: string; value: string }[]
  }[]
}

export function RFHStyledSelect({
  name,
  fieldLabel,
  groups,
}: RFHStyledSelectProps) {
  const { control } = useFormContext()
  const items = groups.flatMap((group) => group.items)

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error, invalid } }) => (
        <Field data-invalid={invalid}>
          <FieldLabel htmlFor={field.name}>{fieldLabel}</FieldLabel>
          <Select
            items={items}
            name={name}
            value={field.value}
            onValueChange={(value) => field.onChange(value)}
          >
            <SelectTrigger className='w-full'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false}>
              {groups.map((group, i) => (
                <SelectGroup key={i}>
                  {group.label && <SelectLabel>{group.label}</SelectLabel>}
                  {group.items.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
          {invalid && <FieldError errors={[error]} />}
        </Field>
      )}
    />
  )
}

type RHFSelectProps = React.ComponentProps<'select'> & {
  name: string
  fieldLabel: string
  children: React.ReactNode
}

export function RHFSelect({
  name,
  fieldLabel,
  children,
  size, // Destructure size to prevent it from being passed to NativeSelect
  ...other
}: RHFSelectProps) {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error, invalid } }) => (
        <Field data-invalid={invalid}>
          <FieldLabel htmlFor={field.name}>{fieldLabel}</FieldLabel>
          <NativeSelect {...other} {...field} aria-invalid={invalid}>
            {/* render NativeSelectOptions  */}
            {children}
          </NativeSelect>
          {invalid && <FieldError errors={[error]} />}
        </Field>
      )}
    />
  )
}

type RHFMultiSelectProps = Omit<MultiSelectProps, 'onValueChange'> & {
  name: string
  fieldLabel: string
}

export function RHFMultiSelect({
  name,
  fieldLabel,
  children,
  ...other
}: RHFMultiSelectProps) {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error, invalid } }) => (
        <Field data-invalid={invalid}>
          <FieldLabel htmlFor={field.name}>{fieldLabel}</FieldLabel>
          <MultiSelect
            {...other}
            aria-invalid={invalid}
            onValueChange={field.onChange}
            defaultValue={field.value}
          />
          {invalid && <FieldError errors={[error]} />}
        </Field>
      )}
    />
  )
}
