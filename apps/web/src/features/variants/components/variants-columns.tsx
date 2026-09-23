import type { ColumnDef } from '@tanstack/react-table'
import type { Variant } from '@/@types/variant'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { DataTableRowActions } from './data-table-row-actions'

export const variantsColumns: ColumnDef<Variant>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={
          table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
        }
        onCheckedChange={(value) =>
          table.toggleAllPageRowsSelected(Boolean(value))
        }
        aria-label='Select all variants'
        className='translate-y-0.5'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
        aria-label={`Select ${row.original.name}`}
        className='translate-y-0.5'
      />
    ),
    meta: {
      className: cn('w-10 max-md:sticky start-0 z-10 rounded-tl-[inherit]'),
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Variant name' />
    ),
    cell: ({ row }) => <span className='font-medium'>{row.original.name}</span>,
    meta: {
      className: cn(
        'min-w-40 drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
        'max-md:sticky start-10 z-10 @4xl/content:drop-shadow-none'
      ),
    },
    enableHiding: false,
  },
  {
    id: 'options',
    header: 'Option values',
    cell: ({ row }) => (
      <div className='flex min-w-56 flex-wrap gap-1.5'>
        {row.original.options.map((option) => (
          <Badge key={option.id} variant='secondary'>
            {option.value}
          </Badge>
        ))}
      </div>
    ),
    enableSorting: false,
  },
  {
    id: 'actions',
    meta: { className: 'w-12 text-right' },
    cell: DataTableRowActions,
    enableSorting: false,
    enableHiding: false,
  },
]
