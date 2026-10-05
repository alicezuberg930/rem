import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  BAR_CODE_TYPES,
  PRODUCT_VARIANT_MODES,
  type Product,
  type ProductRequest,
  type Variant,
} from '@/@types'
import { products } from '@/lib/queries/product'
import { variants } from '@/lib/queries/variant'
import { HttpError } from '@/lib/repository/http-error'
import { productSchema, type ProductForm } from '@/lib/validators/product'
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
import {
  FormProvider,
  RHFSelect,
  RHFTextArea,
  RHFTextField,
} from '@/components/hook-form'
import {
  generateProductCombinations,
  getCombinationKey,
  getProductCombinationCount,
  MAX_PRODUCT_COMBINATIONS,
  type ProductCombinationDraft,
} from '../lib/product-combinations'

type ProductsActionDialogProps = {
  currentRow?: Product
  open: boolean
  onOpenChange: (open: boolean) => void
}

const emptyProduct: ProductForm = {
  name: '',
  sku: '',
  unit: '',
  barCodeType: 'CODE_128',
  expiredDate: '',
  description: '',
  previewImageUrl: '',
  price: null,
  variantMode: 'SIMPLE',
  variantIds: ['', ''],
  combinations: [],
}

function getDefaultValues(product?: Product): ProductForm {
  if (!product) return { ...emptyProduct, variantIds: ['', ''] }

  const variantIds = product.variants.slice(0, 2).map((variant) => variant.id)
  while (variantIds.length < 2) variantIds.push('')

  return {
    name: product.name,
    sku: product.sku,
    unit: product.unit,
    barCodeType: product.barCodeType,
    expiredDate: product.expiredDate ?? '',
    description: product.description ?? '',
    previewImageUrl: product.previewImageUrl ?? '',
    price: product.price,
    variantMode: product.variantMode,
    variantIds,
    combinations: product.combinations.map((combination) => ({
      id: combination.id,
      variantOptionIds: combination.variantOptions.map((option) => option.id),
      sku: combination.sku,
      price: combination.price,
    })),
  }
}

function toNullableNumber(value: string | number) {
  return value === '' ? null : Number(value)
}

function hasSameOptionOrder(left: readonly string[], right: readonly string[]) {
  return (
    left.length === right.length &&
    left.every((optionId, index) => optionId === right[index])
  )
}

function getCombinationLabel(
  selectedVariants: readonly Variant[],
  optionIds: readonly string[]
) {
  return selectedVariants
    .map((variant, index) => {
      const option = variant.options.find(
        (candidate) => candidate.id === optionIds[index]
      )
      return `${variant.name}: ${option?.value ?? 'Unknown value'}`
    })
    .join(' / ')
}

export function ProductsActionDialog({
  currentRow,
  open,
  onOpenChange,
}: ProductsActionDialogProps) {
  const createProduct = useMutation(products().create.mutationOptions())
  const updateProduct = useMutation(products().update.mutationOptions())
  const variantsQuery = useQuery({
    ...variants().selection.queryOptions(),
    enabled: open,
  })
  const isEdit = Boolean(currentRow)
  const defaultValues = useMemo(
    () => getDefaultValues(currentRow),
    [currentRow]
  )

  const form = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues,
  })
  const {
    clearErrors,
    control,
    formState: { errors, isSubmitting },
    getValues,
    handleSubmit,
    register,
    reset,
    setError,
    setValue,
  } = form
  const { fields, replace } = useFieldArray({
    control,
    name: 'combinations',
    keyName: 'fieldKey',
  })
  const variantMode = useWatch({ control, name: 'variantMode' })
  const selectedVariantIds = useWatch({ control, name: 'variantIds' })
  const primaryVariantId = selectedVariantIds?.[0] ?? ''
  const secondaryVariantId = selectedVariantIds?.[1] ?? ''
  const combinationCache = useRef(new Map<string, ProductCombinationDraft>())

  const availableVariants = useMemo(() => {
    const variantsById = new Map<string, Variant>()
    currentRow?.variants.forEach((variant) => {
      variantsById.set(variant.id, variant)
    })
    variantsQuery.data?.forEach((variant) => {
      variantsById.set(variant.id, variant)
    })
    return Array.from(variantsById.values()).sort((left, right) =>
      left.name.localeCompare(right.name)
    )
  }, [currentRow, variantsQuery.data])

  const activeVariantIds = useMemo(
    () => (selectedVariantIds ?? []).filter(Boolean).slice(0, 2),
    [selectedVariantIds]
  )
  const selectedVariants = useMemo(
    () =>
      activeVariantIds
        .map((variantId) =>
          availableVariants.find((variant) => variant.id === variantId)
        )
        .filter((variant): variant is Variant => Boolean(variant)),
    [activeVariantIds, availableVariants]
  )
  const combinationCount = useMemo(
    () => getProductCombinationCount(selectedVariants),
    [selectedVariants]
  )

  const resetForm = useCallback(() => {
    combinationCache.current = new Map(
      defaultValues.combinations.map((combination) => [
        getCombinationKey(combination.variantOptionIds),
        combination,
      ])
    )
    reset(defaultValues)
  }, [defaultValues, reset])

  useEffect(() => {
    if (open) resetForm()
  }, [open, resetForm])

  useEffect(() => {
    if (!primaryVariantId && secondaryVariantId) {
      setValue('variantIds.1', '')
    }
  }, [primaryVariantId, secondaryVariantId, setValue])

  useEffect(() => {
    const currentCombinations = getValues('combinations')
    currentCombinations.forEach((combination) => {
      combinationCache.current.set(
        getCombinationKey(combination.variantOptionIds),
        combination
      )
    })

    if (variantMode !== 'VARIABLE' || !primaryVariantId) {
      if (currentCombinations.length > 0) replace([])
      return
    }

    // Avoid dropping edit values while a selected variant is still loading.
    if (selectedVariants.length !== activeVariantIds.length) return

    if (combinationCount > MAX_PRODUCT_COMBINATIONS) {
      if (currentCombinations.length > 0) replace([])
      setError('combinations', {
        message: `A product can have at most ${MAX_PRODUCT_COMBINATIONS} variant combinations.`,
      })
      return
    }
    clearErrors('combinations')

    const nextCombinations = generateProductCombinations(
      selectedVariants,
      combinationCache.current.values()
    )
    const alreadyCurrent =
      currentCombinations.length === nextCombinations.length &&
      currentCombinations.every((combination, index) =>
        hasSameOptionOrder(
          combination.variantOptionIds,
          nextCombinations[index]?.variantOptionIds ?? []
        )
      )

    if (!alreadyCurrent) replace(nextCombinations)
  }, [
    activeVariantIds,
    clearErrors,
    combinationCount,
    getValues,
    primaryVariantId,
    replace,
    selectedVariants,
    setError,
    variantMode,
  ])

  const onSubmit = async (values: ProductForm) => {
    const isVariable = values.variantMode === 'VARIABLE'
    const submittedVariantIds = values.variantIds.filter(Boolean).slice(0, 2)

    if (isVariable) {
      const submittedVariants = submittedVariantIds
        .map((variantId) =>
          availableVariants.find((variant) => variant.id === variantId)
        )
        .filter((variant): variant is Variant => Boolean(variant))
      if (
        getProductCombinationCount(submittedVariants) > MAX_PRODUCT_COMBINATIONS
      ) {
        setError('combinations', {
          message: `A product can have at most ${MAX_PRODUCT_COMBINATIONS} variant combinations.`,
        })
        return
      }
      const expectedCombinationKeys = new Set(
        generateProductCombinations(submittedVariants).map((combination) =>
          getCombinationKey(combination.variantOptionIds)
        )
      )
      const submittedCombinationKeys = new Set(
        values.combinations.map((combination) =>
          getCombinationKey(combination.variantOptionIds)
        )
      )
      const hasEveryCombination =
        submittedVariants.length === submittedVariantIds.length &&
        expectedCombinationKeys.size === values.combinations.length &&
        [...expectedCombinationKeys].every((key) =>
          submittedCombinationKeys.has(key)
        )

      if (!hasEveryCombination) {
        setError('combinations', {
          message:
            'Enter a SKU and price for every value combination of the selected variations.',
        })
        return
      }
    }

    const payload: ProductRequest = {
      name: values.name,
      sku: values.sku,
      unit: values.unit,
      barCodeType: values.barCodeType,
      expiredDate: values.expiredDate || null,
      description: values.description || null,
      previewImageUrl: values.previewImageUrl || null,
      price: isVariable ? null : values.price,
      variantMode: values.variantMode,
      variantIds: isVariable ? submittedVariantIds : [],
      combinations: isVariable
        ? values.combinations.map((combination) => ({
          ...(combination.id ? { id: combination.id } : {}),
          variantOptionIds: combination.variantOptionIds,
          sku: combination.sku,
          // The schema requires this for every variable-product row.
          price: combination.price!,
        }))
        : [],
    }

    const submit = async () => {
      const response =
        isEdit && currentRow
          ? await updateProduct.mutateAsync({ id: currentRow.id, ...payload })
          : await createProduct.mutateAsync(payload)
      reset(defaultValues)
      onOpenChange(false)
      return response
    }

    await toast
      .promise(submit, {
        loading: isEdit ? 'Updating product' : 'Creating product',
        error: (error) =>
          error instanceof HttpError ? error.message : 'Internal server error',
        success: (response) => response.message,
      })
      .catch(() => undefined)
  }

  const isPending =
    isSubmitting || createProduct.isPending || updateProduct.isPending

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!state) resetForm()
        onOpenChange(state)
      }}
    >
      <DialogContent className='flex max-h-[90vh] flex-col sm:max-w-3xl'>
        <DialogHeader className='text-start'>
          <DialogTitle>{isEdit ? 'Edit product' : 'Add product'}</DialogTitle>
          <DialogDescription>
            Add product details and configure every value combination for a
            variable product.
          </DialogDescription>
        </DialogHeader>

        <div className='min-h-0 flex-1 overflow-y-auto py-1 pe-2'>
          <FormProvider
            id='products-form'
            methods={form}
            onSubmit={handleSubmit(onSubmit)}
          >
            <FieldGroup>
              <div className='grid gap-4 sm:grid-cols-2'>
                <RHFTextField name='name' fieldLabel='Name' />
                <RHFTextField name='sku' fieldLabel='Product SKU' />
                <RHFTextField name='unit' fieldLabel='Unit' />
                <RHFSelect name='barCodeType' fieldLabel='Bar code type'>
                  {Object.entries(BAR_CODE_TYPES).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </RHFSelect>
                <RHFTextField
                  name='expiredDate'
                  fieldLabel='Expiration date'
                  type='date'
                />
                <RHFTextField
                  name='previewImageUrl'
                  fieldLabel='Preview image URL'
                  type='url'
                  placeholder='https://example.com/product.jpg'
                />
              </div>

              <RHFTextArea name='description' fieldLabel='Description' />

              <RHFSelect name='variantMode' fieldLabel='Product type'>
                {Object.entries(PRODUCT_VARIANT_MODES).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </RHFSelect>

              {variantMode === 'SIMPLE' ? (
                <Field data-invalid={Boolean(errors.price)}>
                  <FieldLabel htmlFor='product-price'>Price</FieldLabel>
                  <Input
                    id='product-price'
                    type='number'
                    min={0}
                    step={1}
                    inputMode='numeric'
                    aria-invalid={Boolean(errors.price)}
                    {...register('price', { setValueAs: toNullableNumber })}
                  />
                  <FieldError errors={[errors.price]} />
                </Field>
              ) : (
                <div className='space-y-4'>
                  <div className='grid gap-4 sm:grid-cols-2'>
                    <RHFSelect
                      name='variantIds.0'
                      fieldLabel='Variation 1'
                      disabled={variantsQuery.isLoading}
                    >
                      <option value=''>Select a variation</option>
                      {availableVariants.map((variant) => (
                        <option
                          key={variant.id}
                          value={variant.id}
                          disabled={variant.id === secondaryVariantId}
                        >
                          {variant.name}
                        </option>
                      ))}
                    </RHFSelect>

                    <RHFSelect
                      name='variantIds.1'
                      fieldLabel='Variation 2 (optional)'
                      disabled={variantsQuery.isLoading || !primaryVariantId}
                    >
                      <option value=''>No second variation</option>
                      {availableVariants.map((variant) => (
                        <option
                          key={variant.id}
                          value={variant.id}
                          disabled={variant.id === primaryVariantId}
                        >
                          {variant.name}
                        </option>
                      ))}
                    </RHFSelect>
                  </div>

                  <p className='text-sm text-muted-foreground'>
                    Select one variation, with an optional second variation.
                    Each value combination will get its own SKU and price.
                  </p>

                  {variantsQuery.isLoading && (
                    <p role='status' className='text-sm text-muted-foreground'>
                      Loading variations…
                    </p>
                  )}
                  {variantsQuery.isError && (
                    <p role='alert' className='text-sm text-destructive'>
                      Variations could not be loaded. Try reopening the dialog.
                    </p>
                  )}
                  {!variantsQuery.isLoading &&
                    !variantsQuery.isError &&
                    availableVariants.length === 0 && (
                      <p className='text-sm text-muted-foreground'>
                        Create a variation and its values before creating a
                        variable product.
                      </p>
                    )}

                  {selectedVariants.length > 0 && (
                    <Field data-invalid={Boolean(errors.combinations)}>
                      <div>
                        <FieldLabel>Variation combinations</FieldLabel>
                        <p className='text-sm text-muted-foreground'>
                          Enter inventory details for all generated value
                          combinations.
                        </p>
                      </div>

                      <div className='space-y-3'>
                        {fields.map((combination, index) => {
                          const skuError = errors.combinations?.[index]?.sku
                          const priceError = errors.combinations?.[index]?.price
                          const optionError =
                            errors.combinations?.[index]?.variantOptionIds
                          const skuId = `combination-${index}-sku`
                          const priceId = `combination-${index}-price`

                          return (
                            <div
                              key={combination.fieldKey}
                              className='grid gap-3 rounded-md border p-3 sm:grid-cols-[minmax(10rem,1fr)_minmax(9rem,1fr)_minmax(8rem,1fr)]'
                            >
                              <div className='min-w-0'>
                                <span className='text-xs font-medium text-muted-foreground'>
                                  Values
                                </span>
                                <p className='font-medium'>
                                  {getCombinationLabel(
                                    selectedVariants,
                                    combination.variantOptionIds
                                  )}
                                </p>
                                <FieldError errors={[optionError]} />
                              </div>

                              {combination.variantOptionIds.map(
                                (_optionId, optionIndex) => (
                                  <input
                                    key={optionIndex}
                                    type='hidden'
                                    {...register(
                                      `combinations.${index}.variantOptionIds.${optionIndex}`
                                    )}
                                  />
                                )
                              )}
                              {combination.id && (
                                <input
                                  type='hidden'
                                  {...register(`combinations.${index}.id`)}
                                />
                              )}

                              <Field data-invalid={Boolean(skuError)}>
                                <FieldLabel htmlFor={skuId}>SKU</FieldLabel>
                                <Input
                                  id={skuId}
                                  aria-invalid={Boolean(skuError)}
                                  {...register(`combinations.${index}.sku`)}
                                />
                                <FieldError errors={[skuError]} />
                              </Field>

                              <Field data-invalid={Boolean(priceError)}>
                                <FieldLabel htmlFor={priceId}>Price</FieldLabel>
                                <Input
                                  id={priceId}
                                  type='number'
                                  min={0}
                                  step={1}
                                  inputMode='numeric'
                                  aria-invalid={Boolean(priceError)}
                                  {...register(`combinations.${index}.price`, {
                                    setValueAs: toNullableNumber,
                                  })}
                                />
                                <FieldError errors={[priceError]} />
                              </Field>
                            </div>
                          )
                        })}
                      </div>
                      <FieldError errors={[errors.combinations]} />
                    </Field>
                  )}
                </div>
              )}
            </FieldGroup>
          </FormProvider>
        </div>

        <DialogFooter>
          <Button
            type='submit'
            form='products-form'
            disabled={
              isPending ||
              (variantMode === 'VARIABLE' && variantsQuery.isLoading)
            }
          >
            {isEdit ? 'Save changes' : 'Create product'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
