import type { Variant } from '@/@types'
import type { ProductForm } from '@/lib/validators/product'

export type ProductCombinationDraft = ProductForm['combinations'][number]
export const MAX_PRODUCT_COMBINATIONS = 1_000

export function getProductCombinationCount(
  selectedVariants: readonly Variant[]
) {
  if (
    selectedVariants.length === 0 ||
    selectedVariants.some((variant) => variant.options.length === 0)
  ) {
    return 0
  }

  return selectedVariants.reduce(
    (count, variant) => count * variant.options.length,
    1
  )
}

export function getCombinationKey(optionIds: readonly string[]) {
  return JSON.stringify(
    [...optionIds].sort((left, right) => left.localeCompare(right))
  )
}

export function generateProductCombinations(
  selectedVariants: readonly Variant[],
  cachedCombinations: Iterable<ProductCombinationDraft> = []
): ProductCombinationDraft[] {
  const combinationCount = getProductCombinationCount(selectedVariants)
  if (combinationCount === 0) return []
  if (combinationCount > MAX_PRODUCT_COMBINATIONS) {
    throw new RangeError(`A product can have at most ${MAX_PRODUCT_COMBINATIONS} variant combinations.`)
  }

  const cachedByKey = new Map<string, ProductCombinationDraft>()
  for (const combination of cachedCombinations) {
    cachedByKey.set(
      getCombinationKey(combination.variantOptionIds),
      combination
    )
  }

  const optionIdGroups = selectedVariants.reduce<string[][]>((groups, variant) =>
    groups.flatMap((group) =>
      variant.options.map((option) => [...group, option.id])
    ), [[]]
  )

  return optionIdGroups.map((variantOptionIds) => {
    const cached = cachedByKey.get(getCombinationKey(variantOptionIds))

    return cached
      ? { ...cached, variantOptionIds }
      : { variantOptionIds, sku: '', price: null }
  })
}
