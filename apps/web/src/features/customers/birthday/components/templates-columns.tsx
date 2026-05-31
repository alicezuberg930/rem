import { type ColumnDef } from '@tanstack/react-table'
import { Template } from '@/@types'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { DataTableRowActions } from './data-table-row-actions'

export const templatesColumns: ColumnDef<Template>[] = [
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
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36'>{row.getValue('name')}</LongText>
    ),
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
        'ps-0.5 max-md:sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none'
      ),
    },
    enableHiding: false,
  },
  {
    accessorKey: 'header',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Header' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36'>{row.getValue('header')}</LongText>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'body',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Body' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36'>{row.getValue('body')}</LongText>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'footer',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Footer' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36'>{row.getValue('footer')}</LongText>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'contactPhone',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Contact Phone' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36'>{row.getValue('contactPhone')}</LongText>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'websiteUrl',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Website URL' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36'>{row.getValue('websiteUrl')}</LongText>
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
  //   enableSorting: false,
  // },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
