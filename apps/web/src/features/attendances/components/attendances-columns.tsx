import { type ColumnDef } from '@tanstack/react-table'
import { Attendance } from '@/@types'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
// import { DataTableRowActions } from './data-table-row-actions'
import { format } from 'date-fns'

export const attendancesColumns: ColumnDef<Attendance>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={
          table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-0.5'
      />
    ),
    meta: {
      className: cn('max-md:sticky start-0 z-10 rounded-tl-[inherit]'),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-0.5'
      />
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'checkInTime',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Check-in time' />
    ),
    cell: ({ row }) => {
      const time = format(row.getValue('checkInTime'), 'HH:mm:ss')
      return <LongText className='max-w-36'>{time}</LongText>
    },
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
        'ps-0.5 max-md:sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none'
      ),
    },
    enableHiding: false,
  },
  {
    accessorKey: 'checkOutTime',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Check-out time' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36'>{row.getValue('checkOutTime')}</LongText>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Date' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36'>{row.getValue('date')}</LongText>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Type' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36'>{row.getValue('type')}</LongText>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36'>{row.getValue('status')}</LongText>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'note',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Note' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36'>{row.getValue('note')}</LongText>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'address',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Address' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36'>{row.getValue('address')}</LongText>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'latitude',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Latitude' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36'>{row.getValue('latitude')}</LongText>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'longitude',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Longitude' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36'>{row.getValue('longitude')}</LongText>
    ),
    enableSorting: true,
  },
  // {
  //   accessorKey: 'status',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='Status' />
  //   ),
  //   cell: ({ row }) => {
  //     const { status } = row.original
  //     const badgeColor = callTypes.get(status)
  //     return (
  //       <div className='flex space-x-2'>
  //         <Badge variant='outline' className={cn('capitalize', badgeColor)}>
  //           {row.getValue('status')}
  //         </Badge>
  //       </div>
  //     )
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id))
  //   },
  //   enableHiding: false,
  //   enableSorting: true,
  // },
  // {
  //   id: 'actions',
  //   cell: DataTableRowActions,
  // },
]
