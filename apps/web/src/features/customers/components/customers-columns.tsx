import { type ColumnDef } from '@tanstack/react-table'
import type { Customer } from '@/@types'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { CustomersRowActions } from './customers-row-actions'

export const customersColumns: ColumnDef<Customer>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={
          table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all customers'
        className='translate-y-0.5'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select customer'
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
    accessorFn: (row) => row.contact.firstName,
    id: 'firstName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='First Name' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-40'>{row.getValue('firstName')}</LongText>
    ),
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorFn: (row) => row.contact.lastName,
    id: 'lastName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Last Name' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-40'>{row.getValue('lastName')}</LongText>
    ),
    enableSorting: false,
  },
  {
    accessorFn: (row) => row.contact.phone,
    id: 'phone',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Phone' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-40'>{row.getValue('phone')}</LongText>
    ),
    enableSorting: false,
  },
  {
    accessorFn: (row) => row.contact.email,
    id: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-64'>{row.getValue('email')}</LongText>
    ),
    enableSorting: false,
  },
  {
    accessorFn: (row) => row.customerGroup?.id ?? 'none',
    id: 'customerGroupId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Customer Group' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-48'>
        {row.original.customerGroup?.name ?? 'No group'}
      </LongText>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'customerSince',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Customer Since' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-40'>{row.getValue('customerSince')}</LongText>
    ),
    enableSorting: false,
  },
  {
    id: 'actions',
    cell: CustomersRowActions,
    enableSorting: false,
    enableHiding: false,
  },
]
