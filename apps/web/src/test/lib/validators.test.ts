import { describe, expect, it } from 'vitest'
import {
  AuthValidators,
  BookingValidators,
  BusinessValidators,
  CampaignValidators,
  contactFormSchema,
  customerFormSchema,
  leadFormSchema,
  TemplateValidators,
} from '@/lib/validators'
import { AttendanceValidators } from '@/lib/validators/attendance'
import { productSchema } from '@/lib/validators/product'
import { variantSchema } from '@/lib/validators/variant'

describe('authentication validators', () => {
  it('accepts valid sign-in credentials', () => {
    expect(
      AuthValidators.signInSchema.safeParse({
        email: 'user@example.com',
        password: 'secret1',
      }).success
    ).toBe(true)
  })

  it('rejects mismatched sign-up passwords', () => {
    const result = AuthValidators.signUpSchema.safeParse({
      fullname: 'Ada Lovelace',
      phone: '0912345678',
      email: 'ada@example.com',
      password: 'secret1',
      confirmPassword: 'secret2',
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.path).toEqual(['confirmPassword'])
  })
})

describe('business form validators', () => {
  it('enforces the minimum business name and slug lengths', () => {
    const result = BusinessValidators.formSchema.safeParse({
      name: 'Short',
      slug: 'short',
      insuranceContributionSalary: '1000000',
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues.map((issue) => issue.path[0])).toEqual(
      expect.arrayContaining(['name', 'slug'])
    )
  })

  it('requires a scheduled campaign date', () => {
    const result = CampaignValidators.formSchema.safeParse({
      name: 'September campaign',
      description: null,
      sendType: 'SCHEDULED',
      templateId: 'template-1',
      scheduleAt: null,
      contactIds: ['contact-1'],
      isEdit: false,
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues.slice(-1)[0]?.path).toEqual(['scheduleAt'])
  })
})

describe('entity validators', () => {
  it('requires booking fields', () => {
    expect(BookingValidators.formSchema.safeParse({}).success).toBe(false)
  })

  it('rejects checkout times before check-in', () => {
    const result = AttendanceValidators.checkInSchema.safeParse({
      type: 'OFFICE',
      checkInTime: new Date('2026-09-30T10:00:00'),
      checkOutTime: new Date('2026-09-30T09:00:00'),
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues.slice(-1)[0]?.path).toEqual(['checkOutTime'])
  })

  it('requires core contact and customer fields', () => {
    expect(contactFormSchema.safeParse({}).success).toBe(false)
    expect(customerFormSchema.safeParse({}).success).toBe(false)
    expect(leadFormSchema.safeParse({}).success).toBe(false)
  })

  it('enforces template content lengths when creating', () => {
    const result = TemplateValidators.formSchema.safeParse({
      name: 'Welcome',
      header: 'short',
      body: 'short',
      footer: 'short',
      contactPhone: null,
      websiteUrl: null,
      isEdit: false,
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues).toHaveLength(3)
  })

  it('rejects duplicate variant options case-insensitively', () => {
    const result = variantSchema.safeParse({
      name: 'Size',
      isEdit: false,
      options: [{ value: 'Large' }, { value: ' large ' }],
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.path).toEqual(['options', 1, 'value'])
  })

  it('requires a base price for simple products', () => {
    const result = productSchema.safeParse({
      name: 'T-Shirt',
      sku: 'TSHIRT',
      unit: 'piece',
      barCodeType: 'CODE_128',
      expiredDate: '',
      description: '',
      previewImageUrl: '',
      price: null,
      variantMode: 'SIMPLE',
      variantIds: [],
      combinations: [],
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.path).toEqual(['price'])
  })

  it('accepts inventory rows containing two product variation options', () => {
    const result = productSchema.safeParse({
      name: 'T-Shirt',
      sku: 'TSHIRT',
      unit: 'piece',
      barCodeType: 'CODE_128',
      expiredDate: '',
      description: '',
      previewImageUrl: '',
      price: null,
      variantMode: 'VARIABLE',
      variantIds: ['variant-color', 'variant-size'],
      combinations: [
        {
          variantOptionIds: ['option-red', 'option-small'],
          sku: 'TSHIRT-RED-S',
          price: 1200,
        },
        {
          variantOptionIds: ['option-red', 'option-large'],
          sku: 'TSHIRT-RED-L',
          price: 1300,
        },
      ],
    })

    expect(result.success).toBe(true)
  })

  it('rejects duplicate product variations', () => {
    const result = productSchema.safeParse({
      name: 'T-Shirt',
      sku: 'TSHIRT',
      unit: 'piece',
      barCodeType: 'CODE_128',
      expiredDate: '',
      description: '',
      previewImageUrl: '',
      price: null,
      variantMode: 'VARIABLE',
      variantIds: ['variant-color', 'variant-color'],
      combinations: [
        {
          variantOptionIds: ['option-red', 'option-blue'],
          sku: 'TSHIRT-RED-BLUE',
          price: 1200,
        },
      ],
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: ['variantIds', 1] }),
      ])
    )
  })

  it('rejects more than two product variations', () => {
    const result = productSchema.safeParse({
      name: 'T-Shirt',
      sku: 'TSHIRT',
      unit: 'piece',
      barCodeType: 'CODE_128',
      expiredDate: '',
      description: '',
      previewImageUrl: '',
      price: null,
      variantMode: 'VARIABLE',
      variantIds: ['variant-color', 'variant-size', 'variant-material'],
      combinations: [],
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: ['variantIds'] }),
      ])
    )
  })

  it('requires one option per selected product variation', () => {
    const result = productSchema.safeParse({
      name: 'T-Shirt',
      sku: 'TSHIRT',
      unit: 'piece',
      barCodeType: 'CODE_128',
      expiredDate: '',
      description: '',
      previewImageUrl: '',
      price: null,
      variantMode: 'VARIABLE',
      variantIds: ['variant-color', 'variant-size'],
      combinations: [
        {
          variantOptionIds: ['option-red'],
          sku: 'TSHIRT-RED',
          price: 1200,
        },
      ],
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: ['combinations', 0, 'variantOptionIds'],
        }),
      ])
    )
  })
})
