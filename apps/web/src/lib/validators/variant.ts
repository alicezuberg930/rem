import z from 'zod'

export const variantOptionSchema = z.object({
  value: z
    .string()
    .trim()
    .min(1, 'Option value is required.')
    .max(100, 'Option value must be 100 characters or fewer.'),

  id: z.string().optional(),
})

export const variantSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Variant name is required.')
    .max(100, 'Variant name must be 100 characters or fewer.'),
  isEdit: z.boolean(),
  options: z
    .array(variantOptionSchema)
    .min(1, 'At least one option is required.')
    .superRefine((options, context) => {
      const values = new Set<string>()
      options.forEach((option, index) => {
        const value = option.value.trim().toLowerCase()
        if (values.has(value)) {
          context.addIssue({
            code: 'custom',
            message: 'Option values must be unique.',
            path: [index, 'value'],
          })
        }
        values.add(value)
      })
    }),
})

export type VariantForm = z.infer<typeof variantSchema>
