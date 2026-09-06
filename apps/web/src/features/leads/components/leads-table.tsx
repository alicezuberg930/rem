import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import {
  type ColumnFilter,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { LEAD_SOURCE, LEAD_STATUS, type QueryLead } from '@/@types'
import { leads } from '@/lib/queries/lead'
import { cn } from '@/lib/utils'
import { useTableUrlState } from '@/hooks/use-table-url-state'
import { Spinner } from '@/components/ui/spinner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination, DataTableToolbar } from '@/components/data-table'
import { LeadsBulkActions } from './leads-bulk-actions'
import { leadsColumns as columns } from './leads-columns'

const route = getRouteApi('/_authenticated/leads/')

export function LeadsTable() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])
  const {
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    ensurePageInRange,
  } = useTableUrlState({
    search,
    navigate,
    pagination: { defaultPage: 1, defaultPageSize: 10 },
    globalFilter: { enabled: false },
    columnFilters: [
      { columnId: 'source', searchKey: 'source', type: 'array' },
      { columnId: 'status', searchKey: 'status', type: 'array' },
    ],
  })

  const queryParams = useMemo(
    () =>
      columnFilters.reduce<QueryLead>(
        (params, filter: ColumnFilter) => {
          if (filter.id === 'source' && Array.isArray(filter.value)) {
            params.source =
              filter.value.length === 1
                ? (filter.value[0] as QueryLead['source'])
                : undefined
          }
          if (filter.id === 'status' && Array.isArray(filter.value)) {
            params.status =
              filter.value.length === 1
                ? (filter.value[0] as QueryLead['status'])
                : undefined
          }
          return params
        },
        { page: pagination.pageIndex, pageSize: pagination.pageSize }
      ),
    [columnFilters, pagination.pageIndex, pagination.pageSize]
  )

  const { data, isLoading } = useQuery(leads().all.queryOptions(queryParams))

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    autoResetPageIndex: false,
    data: data?.content ?? [],
    columns,
    state: {
      sorting,
      pagination,
      rowSelection,
      columnFilters,
      columnVisibility,
    },
    enableRowSelection: true,
    onPaginationChange,
    onColumnFiltersChange,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    rowCount: data?.totalElements ?? 0,
    manualFiltering: true,
    manualPagination: true,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  useEffect(() => {
    ensurePageInRange(table.getPageCount())
  }, [table, ensurePageInRange])

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <DataTableToolbar
        table={table}
        showSearch={false}
        filters={[
          {
            columnId: 'source',
            title: 'Source',
            options: Object.entries(LEAD_SOURCE).map(([value, label]) => ({
              label,
              value,
            })),
          },
          {
            columnId: 'status',
            title: 'Status',
            options: Object.entries(LEAD_STATUS).map(([value, label]) => ({
              label,
              value,
            })),
          },
        ]}
      />
      <div className='overflow-hidden rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='group/row'>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={cn(
                      'bg-background group-hover/row:bg-muted',
                      header.column.columnDef.meta?.className,
                      header.column.columnDef.meta?.thClassName
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-32'>
                  <Spinner className='mx-auto h-16 w-16' />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className='group/row'>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        'bg-background group-hover/row:bg-muted',
                        cell.column.columnDef.meta?.className,
                        cell.column.columnDef.meta?.tdClassName
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No leads found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {!isLoading && <DataTablePagination table={table} className='mt-auto' />}
      <LeadsBulkActions table={table} />
    </div>
  )
}
