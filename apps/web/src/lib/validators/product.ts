import * as z from 'zod'
import { BAR_CODE_TYPES, PRODUCT_VARIANT_MODES } from '@/@types/product'

const requiredText = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .max(255, `${label} must be 255 characters or fewer.`)

const optionalText = (maximum: number, label: string) =>
  z
    .string()
    .trim()
    .max(maximum, `${label} must be ${maximum} characters or fewer.`)

const nullableInteger = z
  .number()
  .int('Price must be a whole number.')
  .nonnegative('Price must be zero or greater.')
  .nullable()

export const productCombinationSchema = z.object({
  id: z.string().optional(),
  variantOptionIds: z
    .array(z.string().min(1, 'A variant option is required.'))
    .min(1, 'At least one variant option is required.')
    .max(2, 'A combination can contain at most two variant options.')
    .superRefine((optionIds, context) => {
      const seen = new Set<string>()
      optionIds.forEach((optionId, index) => {
        if (seen.has(optionId)) {
          context.addIssue({
            code: 'custom',
            message: 'A variant option can only appear once per combination.',
            path: [index],
          })
        }
        seen.add(optionId)
      })
    }),
  sku: requiredText('SKU'),
  price: nullableInteger,
})

export const productSchema = z
  .object({
    name: requiredText('Name'),
    sku: requiredText('SKU'),
    unit: requiredText('Unit'),
    barCodeType: z.enum(
      Object.keys(BAR_CODE_TYPES) as [
        keyof typeof BAR_CODE_TYPES,
        ...(keyof typeof BAR_CODE_TYPES)[],
      ]
    ),
    expiredDate: z
      .string()
      .refine(
        (value) => value === '' || /^\d{4}-\d{2}-\d{2}$/.test(value),
        'Expiration date is invalid.'
      ),
    description: optionalText(65_535, 'Description'),
    previewImageUrl: optionalText(255, 'Preview image URL'),
    price: nullableInteger,
    variantMode: z.enum(
      Object.keys(PRODUCT_VARIANT_MODES) as [
        keyof typeof PRODUCT_VARIANT_MODES,
        ...(keyof typeof PRODUCT_VARIANT_MODES)[],
      ]
    ),
    variantIds: z
      .array(z.string())
      .max(2, 'Select no more than two variations.'),
    combinations: z.array(productCombinationSchema),
  })
  .superRefine((product, context) => {
    if (product.variantMode === 'SIMPLE') {
      if (product.price === null) {
        context.addIssue({
          code: 'custom',
          message: 'Price is required for a simple product.',
          path: ['price'],
        })
      }
      return
    }

    const selectedVariantIds = product.variantIds.filter(Boolean)

    if (!product.variantIds[0]) {
      context.addIssue({
        code: 'custom',
        message: 'Select a variation for a variable product.',
        path: ['variantIds', 0],
      })
    }

    const seenVariantIds = new Set<string>()
    product.variantIds.forEach((variantId, index) => {
      if (!variantId) return
      if (seenVariantIds.has(variantId)) {
        context.addIssue({
          code: 'custom',
          message: 'Each variation can only be selected once.',
          path: ['variantIds', index],
        })
      }
      seenVariantIds.add(variantId)
    })

    if (product.combinations.length === 0) {
      context.addIssue({
        code: 'custom',
        message: 'The selected variation must have at least one option.',
        path: ['combinations'],
      })
    }

    const combinationKeys = new Set<string>()
    product.combinations.forEach((combination, index) => {
      if (combination.variantOptionIds.length !== selectedVariantIds.length) {
        context.addIssue({
          code: 'custom',
          message:
            'Each combination must include one option for every selected variation.',
          path: ['combinations', index, 'variantOptionIds'],
        })
      }

      const combinationKey = JSON.stringify(
        [...combination.variantOptionIds].sort((left, right) =>
          left.localeCompare(right)
        )
      )
      if (combinationKeys.has(combinationKey)) {
        context.addIssue({
          code: 'custom',
          message: 'Each variation combination can only appear once.',
          path: ['combinations', index, 'variantOptionIds'],
        })
      }
      combinationKeys.add(combinationKey)

      if (combination.price === null) {
        context.addIssue({
          code: 'custom',
          message: 'Price is required.',
          path: ['combinations', index, 'price'],
        })
      }
    })
  })

export type ProductForm = z.infer<typeof productSchema>
