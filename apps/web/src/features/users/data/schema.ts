import { z } from 'zod'

const userStatusSchema = z.union([
  z.literal('active'),
  z.literal('inactive'),
  z.literal('invited'),
  z.literal('suspended'),
])
export type UserStatus = z.infer<typeof userStatusSchema>

const userRoleSchema = z.string().min(1)

const _userSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  status: userStatusSchema,
  role: userRoleSchema,
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  fullname: z.string().optional(),
  phone: z.string().optional(),
  birthday: z.string().nullable().optional(),
  roleId: z.string().optional(),
  salary: z.number().optional(),
  dependants: z.number().optional(),
  bankOwner: z.string().nullable().optional(),
  bankAccount: z.string().nullable().optional(),
  bankName: z.string().nullable().optional(),
  bankCode: z.string().nullable().optional(),
  bankBranch: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
  isVerified: z.boolean().optional(),
})
export type User = z.infer<typeof _userSchema>
