import { type ColumnDef } from '@tanstack/react-table'
import type { Contact } from '@/@types'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { ContactsRowActions } from './contacts-row-actions'

const contactTypeLabels = {
  PERSONAL: 'Personal',
  COMPANY: 'Company',
} as const

export const contactsColumns: ColumnDef<Contact>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={
          table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all contacts'
        className='translate-y-0.5'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select contact'
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
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Type' />
    ),
    cell: ({ row }) => (
      <Badge variant='outline'>{contactTypeLabels[row.original.type]}</Badge>
    ),
    enableSorting: false,
  },
  {
    accessorFn: (row) => row.tag?.name ?? '',
    id: 'tag',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tag' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-48'>{row.original.tag?.name ?? '-'}</LongText>
    ),
    enableSorting: false,
  },
  {
    id: 'actions',
    cell: ContactsRowActions,
    enableSorting: false,
    enableHiding: false,
  },
]
