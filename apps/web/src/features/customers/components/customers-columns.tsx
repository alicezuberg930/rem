import { type ColumnDef } from '@tanstack/react-table'
import type { Contact } from '@/@types'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { CustomersRowActions } from './customers-row-actions'

export const customersColumns: ColumnDef<Contact>[] = [
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
    accessorKey: 'firstName',
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
    accessorKey: 'lastName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Last Name' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-40'>{row.getValue('lastName')}</LongText>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'surname',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Surname' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-40'>{row.getValue('surname')}</LongText>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Type' />
    ),
    cell: ({ row }) => (
      <span className='capitalize'>
        {String(row.getValue('type')).toLowerCase()}
      </span>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Phone' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-40'>{row.getValue('phone')}</LongText>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'mobilePhone',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Mobile Phone' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-40'>{row.getValue('mobilePhone')}</LongText>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-64'>{row.getValue('email')}</LongText>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'birthday',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Birthday' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-40'>{row.getValue('birthday')}</LongText>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'occupation',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Occupation' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-48'>{row.getValue('occupation')}</LongText>
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
