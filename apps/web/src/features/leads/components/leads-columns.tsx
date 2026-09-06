import { type ColumnDef } from '@tanstack/react-table'
import { LEAD_SOURCE, LEAD_STATUS, type Lead } from '@/@types'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { leadStatusClasses } from '../data/data'
import { LeadsRowActions } from './leads-row-actions'

export const leadsColumns: ColumnDef<Lead>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={
          table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all leads'
        className='translate-y-0.5'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select lead'
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
    accessorKey: 'source',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Source' />
    ),
    cell: ({ row }) => LEAD_SOURCE[row.original.source],
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => (
      <Badge
        variant='outline'
        className={cn(leadStatusClasses.get(row.original.status))}
      >
        {LEAD_STATUS[row.original.status]}
      </Badge>
    ),
    enableHiding: false,
    enableSorting: false,
  },
  {
    id: 'actions',
    cell: LeadsRowActions,
    enableSorting: false,
    enableHiding: false,
  },
]
