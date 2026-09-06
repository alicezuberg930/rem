import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Payroll } from '@/features/payroll'

const payrollSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
})

export const Route = createFileRoute('/_authenticated/payroll/')({
  validateSearch: payrollSearchSchema,
  component: Payroll,
})
