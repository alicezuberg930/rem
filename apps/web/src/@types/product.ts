import type { Variant, VariantOption } from './variant'

export const BAR_CODE_TYPES = {
  AZTEC: 'Aztec',
  CODABAR: 'Codabar',
  CODE_39: 'Code 39',
  CODE_93: 'Code 93',
  CODE_128: 'Code 128',
  DATA_MATRIX: 'Data Matrix',
  EAN_8: 'EAN-8',
  EAN_13: 'EAN-13',
  ITF: 'ITF',
  PDF_417: 'PDF417',
  UPC_A: 'UPC-A',
  UPC_E: 'UPC-E',
} as const

export const PRODUCT_VARIANT_MODES = {
  SIMPLE: 'Simple',
  VARIABLE: 'Variable',
} as const

export type BarCodeType = keyof typeof BAR_CODE_TYPES
export type ProductVariantMode = keyof typeof PRODUCT_VARIANT_MODES

export type ProductVariantCombination = {
  id: string
  sku: string
  price: number
  variantOptions: VariantOption[]
}

export type Product = {
  id: string
  createdAt: string
  updatedAt: string
  name: string
  sku: string
  unit: string
  barCodeType: BarCodeType
  expiredDate: string | null
  description: string | null
  previewImageUrl: string | null
  price: number | null
  variantMode: ProductVariantMode
  variants: Variant[]
  combinations: ProductVariantCombination[]
}

export type ProductVariantCombinationRequest = {
  id?: string
  variantOptionIds: string[]
  sku: string
  price: number
}

export type ProductRequest = {
  name: string
  sku: string
  unit: string
  barCodeType: BarCodeType
  expiredDate: string | null
  description: string | null
  previewImageUrl: string | null
  price: number | null
  variantMode: ProductVariantMode
  variantIds: string[]
  combinations: ProductVariantCombinationRequest[]
}
