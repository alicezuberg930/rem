import * as React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Field, FieldError, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'

interface RHFInputRangeProps {
  name: string
  min?: number
  max?: number
  step?: number
  container?: React.HTMLAttributes<HTMLDivElement>
  fieldLabel: string
  leftInput?: React.ComponentProps<'input'>
  rightInut?: React.ComponentProps<'input'>
}

export default function RHFInputRange({
  name,
  min,
  max,
  step,
  fieldLabel,
  container,
  leftInput,
  rightInut,
}: Readonly<RHFInputRangeProps>) {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error, invalid } }) => {
        const [start, end] = field.value || [undefined, undefined]

        const handleChange =
          (index: 0 | 1) => (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue =
              e.target.value === '' ? undefined : Number(e.target.value)
            const updated: [number | undefined, number | undefined] =
              index === 0 ? [newValue, end] : [start, newValue]
            field.onChange(updated)
          }

        return (
          <Field data-invalid={invalid}>
            <FieldLabel htmlFor={field.name}>{fieldLabel}</FieldLabel>
            <div className='flex items-center gap-2' {...container}>
              <Input
                type='number'
                value={start ?? ''}
                onChange={handleChange(0)}
                placeholder='Min'
                min={min}
                max={max}
                step={step}
                aria-invalid={invalid}
                {...leftInput}
              />
              <span className='text-muted-foreground'>-</span>
              <Input
                type='number'
                value={end ?? ''}
                onChange={handleChange(1)}
                placeholder='Max'
                min={min}
                max={max}
                step={step}
                aria-invalid={invalid}
                {...rightInut}
              />
            </div>
            {invalid && <FieldError errors={[error]} />}
          </Field>
        )
      }}
    />
  )
}
