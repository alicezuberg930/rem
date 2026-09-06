import type { Table } from '@tanstack/react-table'
import { PAYROLL_STATUS, type PayrollItem } from '@/@types'
import { ReceiptText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'

type PayrollBulkActionsProps<TData> = {
  table: Table<TData>
}

const numberFormatter = new Intl.NumberFormat('en-US')

const formatNumber = (value: number | null | undefined) =>
  value == null ? '-' : numberFormatter.format(value)

const formatValue = (value: string | number | null | undefined) =>
  value == null || value === '' ? '-' : String(value)

const formatDateTime = (value: string | null | undefined) =>
  value ? value.replace('T', ' ').slice(0, 16) : '-'

const getPayrollDetails = (
  item: PayrollItem
): [string, string | number | null | undefined][] => [
  ['Payroll Item ID', item.id],
  ['Business ID', item.businessId],
  ['Employee', item.userFullname],
  ['Employee ID', item.userId],
  ['Email', item.userEmail],
  ['Phone', item.userPhone],
  ['Period', item.payrollPeriodName],
  ['Period ID', item.payrollPeriodId],
  ['Period Start', item.payrollPeriodStartDate],
  ['Period End', item.payrollPeriodEndDate],
  ['Period Status', PAYROLL_STATUS[item.payrollPeriodStatus]],
  ['Base Salary', formatNumber(item.baseSalary)],
  ['Allowances', formatNumber(item.totalAllowances)],
  ['Bonuses', formatNumber(item.totalBonuses)],
  ['Deductions', formatNumber(item.totalDeductions)],
  ['Tax', formatNumber(item.taxAmount)],
  ['Insurance', formatNumber(item.insuranceAmount)],
  ['Net Salary', formatNumber(item.netSalary)],
  ['Worked Days', item.workedDays],
  ['Absent Days', item.absentDays],
  ['Late Days', item.lateDays],
  ['Unpaid Leave Days', item.unpaidLeaveDays],
  ['Status', PAYROLL_STATUS[item.status]],
  ['Approver', item.approverFullname],
  ['Paid At', formatDateTime(item.paidAt)],
  ['Created At', formatDateTime(item.createdAt)],
  ['Updated At', formatDateTime(item.updatedAt)],
]

function PayrollDetailCard({ item }: { item: PayrollItem }) {
  return (
    <div className='rounded-md border p-3'>
      <div className='mb-3 flex items-start justify-between gap-4'>
        <div>
          <p className='font-medium'>{item.userFullname}</p>
          <p className='text-xs text-muted-foreground'>{item.userEmail}</p>
        </div>
        <p className='text-sm font-semibold'>{formatNumber(item.netSalary)}</p>
      </div>
      <dl className='grid grid-cols-2 gap-x-4 gap-y-2 text-xs'>
        {getPayrollDetails(item).map(([label, value]) => (
          <div key={label} className='space-y-0.5'>
            <dt className='text-muted-foreground'>{label}</dt>
            <dd className='font-medium'>{formatValue(value)}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export function DataTableBulkActions<TData>({
  table,
}: PayrollBulkActionsProps<TData>) {
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedPayrollItems = selectedRows.map(
    (row) => row.original as PayrollItem
  )

  return (
    <BulkActionsToolbar table={table} entityName='payroll item'>
      <Tooltip>
        <Popover>
          <PopoverTrigger
            render={
              <TooltipTrigger
                render={
                  <Button
                    variant='outline'
                    size='icon'
                    className='size-8'
                    aria-label='View payroll details'
                    title='View payroll details'
                  >
                    <ReceiptText />
                    <span className='sr-only'>View payroll details</span>
                  </Button>
                }
              />
            }
          />
          <PopoverContent
            side='top'
            align='center'
            className='max-h-[70vh] w-[min(36rem,calc(100vw-2rem))] overflow-y-auto'
          >
            <PopoverHeader>
              <PopoverTitle>Payroll details</PopoverTitle>
              <PopoverDescription>
                {selectedPayrollItems.length} selected payroll item
                {selectedPayrollItems.length > 1 ? 's' : ''}
              </PopoverDescription>
            </PopoverHeader>
            <div className='space-y-3'>
              {selectedPayrollItems.map((item) => (
                <PayrollDetailCard key={item.id} item={item} />
              ))}
            </div>
          </PopoverContent>
        </Popover>
        <TooltipContent>
          <p>View payroll details</p>
        </TooltipContent>
      </Tooltip>
    </BulkActionsToolbar>
  )
}
