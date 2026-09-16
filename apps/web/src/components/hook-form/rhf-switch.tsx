import { useFormContext, Controller } from 'react-hook-form'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'

type RHFSwitchProps = {
  name: string
  label?: string
  helperText?: string
  disabled?: boolean
  className?: string
}

export default function RHFSwitch({
  name,
  label,
  helperText,
  disabled,
  className,
}: Readonly<RHFSwitchProps>) {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className={className}>
          <div className='flex items-center space-x-2'>
            <Switch
              id={name}
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
            {label && (
              <Label
                htmlFor={name}
                className='text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
              >
                {label}
              </Label>
            )}
          </div>
          {(helperText || error) && (
            <p
              className={`mt-1 text-sm ${error ? 'text-destructive' : 'text-muted-foreground'}`}
            >
              {error ? error.message : helperText}
            </p>
          )}
        </div>
      )}
    />
  )
}
