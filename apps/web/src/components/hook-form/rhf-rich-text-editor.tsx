import type { ComponentProps } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import { CKEditor } from '@/components/ck-editor'
import { cn } from '@/lib/utils'
import { Field, FieldError, FieldLabel } from '../ui/field'

type RHFRichTextEditorProps = Omit<
    ComponentProps<typeof CKEditor>, 'initialData' | 'onChange'
> & {
    name: string
    fieldLabel: string
    className?: string
}

export const RHFRichTextEditor = ({
    name,
    fieldLabel,
    className,
    ...other
}: RHFRichTextEditorProps) => {
    const { control } = useFormContext()

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error, invalid } }) => (
                <Field data-invalid={invalid}>
                    <FieldLabel htmlFor={field.name}>{fieldLabel}</FieldLabel>
                    <div className={cn(invalid && 'ring-1 ring-destructive', className)}>
                        <CKEditor
                            {...other}
                            initialData={field.value ?? ''}
                            onChange={field.onChange}
                        />
                    </div>
                    {invalid && <FieldError errors={[error]} />}
                </Field>
            )}
        />
    )
}