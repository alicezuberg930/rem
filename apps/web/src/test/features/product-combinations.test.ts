import type { Variant } from '@/@types'
import { describe, expect, it } from 'vitest'
import {
  generateProductCombinations,
  getCombinationKey,
  MAX_PRODUCT_COMBINATIONS,
} from '@/features/products/lib/product-combinations'

const color: Variant = {
  id: 'variant-color',
  name: 'Color',
  options: [
    { id: 'option-red', value: 'Red' },
    { id: 'option-blue', value: 'Blue' },
  ],
}

const size: Variant = {
  id: 'variant-size',
  name: 'Size',
  options: [
    { id: 'option-small', value: 'Small' },
    { id: 'option-large', value: 'Large' },
  ],
}

describe('product combination generation', () => {
  it('generates a deterministic Cartesian product in variant and option order', () => {
    const combinations = generateProductCombinations([color, size])

    expect(combinations.map((item) => item.variantOptionIds)).toEqual([
      ['option-red', 'option-small'],
      ['option-red', 'option-large'],
      ['option-blue', 'option-small'],
      ['option-blue', 'option-large'],
    ])
  })

  it('preserves matching IDs, SKUs, and prices through variant reordering', () => {
    const cached = [
      {
        id: 'combination-1',
        variantOptionIds: ['option-red', 'option-small'],
        sku: 'TSHIRT-RED-S',
        price: 1200,
      },
    ]

    const combinations = generateProductCombinations([size, color], cached)
    const preserved = combinations.find(
      (item) =>
        getCombinationKey(item.variantOptionIds) ===
        getCombinationKey(['option-red', 'option-small'])
    )

    expect(preserved).toEqual({
      id: 'combination-1',
      variantOptionIds: ['option-small', 'option-red'],
      sku: 'TSHIRT-RED-S',
      price: 1200,
    })
  })

  it('returns no combinations when a selected variation has no values', () => {
    expect(
      generateProductCombinations([
        color,
        { id: 'variant-empty', name: 'Empty', options: [] },
      ])
    ).toEqual([])
  })

  it('rejects Cartesian products above the supported limit', () => {
    const oversized: Variant = {
      id: 'variant-oversized',
      name: 'Oversized',
      options: Array.from(
        { length: MAX_PRODUCT_COMBINATIONS + 1 },
        (_, index) => ({ id: `option-${index}`, value: String(index) })
      ),
    }

    expect(() => generateProductCombinations([oversized])).toThrow(
      `A product can have at most ${MAX_PRODUCT_COMBINATIONS} variant combinations.`
    )
  })
})
