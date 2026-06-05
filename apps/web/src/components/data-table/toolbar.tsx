import { type Table } from '@tanstack/react-table'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableFacetedFilter } from './faceted-filter'
import { DataTableStringFilter } from './string-filter'
import { DataTableDateFilter } from './date-filter'
import { DataTableViewOptions } from './view-options'

type DataTableFilterType = 'select' | 'string' | 'date'

type DataTableToolbarProps<TData> = {
  table: Table<TData>
  searchPlaceholder?: string
  searchKey?: string
  filters?: {
    columnId: string
    title: string
    type?: DataTableFilterType
    placeholder?: string
    options?: {
      label: string
      value: string
      icon?: React.ComponentType<{ className?: string }>
    }[]
  }[]
}

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = 'Filter...',
  searchKey,
  filters = [],
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0 || table.getState().globalFilter

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        {searchKey ? (
          <Input
            placeholder={searchPlaceholder}
            value={
              (table.getColumn(searchKey)?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            className='w-37.5 lg:w-62.5'
          />
        ) : (
          <Input
            placeholder={searchPlaceholder}
            value={table.getState().globalFilter ?? ''}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className='w-37.5 lg:w-62.5'
          />
        )}
        <div className='flex gap-x-2'>
          {filters.map((filter) => {
            const column = table.getColumn(filter.columnId)
            if (!column) return null

            const filterType = filter.type ?? 'select'

            switch (filterType) {
              case 'string':
                return (
                  <DataTableStringFilter
                    key={filter.columnId}
                    column={column}
                    title={filter.title}
                    placeholder={filter.placeholder}
                  />
                )
              case 'date':
                return (
                  <DataTableDateFilter
                    key={filter.columnId}
                    column={column}
                  />
                )
              case 'select':
              default:
                return (
                  <DataTableFacetedFilter
                    key={filter.columnId}
                    column={column}
                    title={filter.title}
                    options={filter.options ?? []}
                  />
                )
            }
          })}
        </div>
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => {
              table.resetColumnFilters()
              table.setGlobalFilter('')
            }}
            className='px-2 lg:px-3'
          >
            Reset
            <X className='ms-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
