import type { QueryPaginate } from '.'

export const PAYROLL_STATUS = {
  DRAFT: 'Draft',
  PROCESSING: 'Processing',
  APPROVED: 'Approved',
  PAID: 'Paid',
  CANCELLED: 'Cancelled',
} as const

export type PayrollStatus = keyof typeof PAYROLL_STATUS

export type PayrollItem = {
  id: string
  createdAt: string | null
  updatedAt: string | null
  businessId: string
  payrollPeriodId: string
  payrollPeriodName: string
  payrollPeriodStartDate: string
  payrollPeriodEndDate: string
  payrollPeriodStatus: PayrollStatus
  userId: string
  userFullname: string
  userEmail: string
  userPhone: string | null
  baseSalary: number
  totalAllowances: number
  totalBonuses: number
  totalDeductions: number
  taxAmount: number
  insuranceAmount: number
  netSalary: number
  workedDays: number | null
  absentDays: number | null
  lateDays: number | null
  unpaidLeaveDays: number | null
  status: PayrollStatus
  approverId: string | null
  approverFullname: string | null
  paidAt: string | null
}

export type QueryPayroll = QueryPaginate
