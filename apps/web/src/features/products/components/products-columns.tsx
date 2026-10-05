import type { ColumnDef } from '@tanstack/react-table'
import type { Product } from '@/@types'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { DataTableRowActions } from './data-table-row-actions'

const displayValue = (value: string | number | null | undefined) =>
  value === null || value === undefined || value === '' ? '—' : String(value)

export const productsColumns: ColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Product name' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-56 font-medium'>{row.original.name}</LongText>
    ),
    meta: {
      className: cn(
        'min-w-48 drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
        'max-md:sticky start-0 z-10 @4xl/content:drop-shadow-none'
      ),
    },
    enableHiding: false,
  },
  {
    accessorKey: 'sku',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='SKU' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-44'>{row.original.sku}</LongText>
    ),
  },
  {
    accessorKey: 'unit',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Unit' />
    ),
    cell: ({ row }) => displayValue(row.original.unit),
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Price' />
    ),
    cell: ({ row }) =>
      row.original.price === null || row.original.price === undefined
        ? '—'
        : row.original.price.toLocaleString(),
  },
  {
    accessorKey: 'variantMode',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Product type' />
    ),
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.variantMode === 'VARIABLE' ? 'default' : 'secondary'
        }
      >
        {row.original.variantMode === 'VARIABLE' ? 'Variable' : 'Simple'}
      </Badge>
    ),
  },
  {
    id: 'variants',
    accessorFn: (row) => row.variants.map((variant) => variant.name).join(', '),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Variants' />
    ),
    cell: ({ row }) =>
      displayValue(row.original.variants.map((variant) => variant.name).join(', ')),
  },
  {
    accessorKey: 'barCodeType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Barcode' />
    ),
    cell: ({ row }) => displayValue(row.original.barCodeType),
  },
  {
    accessorKey: 'expiredDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Expires' />
    ),
    cell: ({ row }) => displayValue(row.original.expiredDate),
  },
  {
    id: 'actions',
    meta: { className: 'w-12 text-right' },
    cell: DataTableRowActions,
    enableSorting: false,
    enableHiding: false,
  },
]
