import type { ColumnDef } from '@tanstack/react-table'
import { PAYROLL_STATUS, type PayrollItem } from '@/@types'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'

const numberFormatter = new Intl.NumberFormat('en-US')

const formatNumber = (value: number | null | undefined) =>
  value == null ? '-' : numberFormatter.format(value)

const formatDateTime = (value: string | null | undefined) =>
  value ? value.replace('T', ' ').slice(0, 16) : '-'

export const payrollColumns: ColumnDef<PayrollItem>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={
          table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all payroll items'
        className='translate-y-0.5'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select payroll item'
        className='translate-y-0.5'
      />
    ),
    meta: {
      className: cn('max-md:sticky start-0 z-10 rounded-tl-[inherit]'),
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'userFullname',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Employee' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-48'>{row.original.userFullname}</LongText>
    ),
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: 'payrollPeriodName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Period' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-40'>{row.original.payrollPeriodName}</LongText>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'baseSalary',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Base Salary' />
    ),
    cell: ({ row }) => formatNumber(row.original.baseSalary),
    enableSorting: false,
  },
  {
    accessorKey: 'totalAllowances',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Allowances' />
    ),
    cell: ({ row }) => formatNumber(row.original.totalAllowances),
    enableSorting: false,
  },
  {
    accessorKey: 'totalBonuses',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Bonuses' />
    ),
    cell: ({ row }) => formatNumber(row.original.totalBonuses),
    enableSorting: false,
  },
  {
    accessorKey: 'totalDeductions',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Deductions' />
    ),
    cell: ({ row }) => formatNumber(row.original.totalDeductions),
    enableSorting: false,
  },
  {
    accessorKey: 'taxAmount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tax' />
    ),
    cell: ({ row }) => formatNumber(row.original.taxAmount),
    enableSorting: false,
  },
  {
    accessorKey: 'insuranceAmount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Insurance' />
    ),
    cell: ({ row }) => formatNumber(row.original.insuranceAmount),
    enableSorting: false,
  },
  {
    accessorKey: 'netSalary',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Net Salary' />
    ),
    cell: ({ row }) => formatNumber(row.original.netSalary),
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => (
      <Badge variant='outline'>{PAYROLL_STATUS[row.original.status]}</Badge>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'paidAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Paid At' />
    ),
    cell: ({ row }) => formatDateTime(row.original.paidAt),
    enableSorting: false,
  },
]
