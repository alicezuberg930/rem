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
import { TASK_STATUS, type QueryTask } from '@/@types'
import { tasks } from '@/lib/queries/task'
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
import { taskPriorities, tasksColumns as columns } from './tasks-columns'

const route = getRouteApi('/_authenticated/tasks/')

export function TasksTable() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])
  const {
    globalFilter,
    onGlobalFilterChange,
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    ensurePageInRange,
  } = useTableUrlState({
    search,
    navigate,
    pagination: { defaultPage: 1, defaultPageSize: 10 },
    globalFilter: { enabled: true, key: 'filter' },
    columnFilters: [
      { columnId: 'status', searchKey: 'status', type: 'array' },
      { columnId: 'priority', searchKey: 'priority', type: 'array' },
    ],
  })

  const queryParams = useMemo(
    () =>
      columnFilters.reduce<QueryTask>(
        (params, filter: ColumnFilter) => {
          if (filter.id === 'status' && Array.isArray(filter.value)) {
            params.status =
              filter.value.length === 1
                ? (filter.value[0] as QueryTask['status'])
                : undefined
          }
          if (filter.id === 'priority' && Array.isArray(filter.value)) {
            params.priority =
              filter.value.length === 1
                ? (filter.value[0] as QueryTask['priority'])
                : undefined
          }
          return params
        },
        {
          page: pagination.pageIndex,
          pageSize: pagination.pageSize,
          filter: globalFilter || undefined,
        }
      ),
    [columnFilters, globalFilter, pagination.pageIndex, pagination.pageSize]
  )

  const { data, isLoading, isError } = useQuery(tasks().all.queryOptions(queryParams))

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
      globalFilter,
    },
    enableRowSelection: true,
    onPaginationChange,
    onColumnFiltersChange,
    onGlobalFilterChange,
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
    <div
      className={cn(
        'max-sm:has-[div[role="toolbar"]]:mb-16',
        'flex flex-1 flex-col gap-4'
      )}
    >
      <DataTableToolbar
        table={table}
        searchPlaceholder='Filter by title or assignee...'
        filters={[
          {
            columnId: 'status',
            title: 'Status',
            options: Object.entries(TASK_STATUS).map((s) => ({
              label: s[1],
              value: s[0],
            })),
          },
          {
            columnId: 'priority',
            title: 'Priority',
            options: taskPriorities,
          },
        ]}
      />
      <div className='overflow-hidden rounded-md border'>
        <Table className='min-w-4xl'>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={cn(
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
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  Unable to load tasks.
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
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
                  No tasks found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {!isLoading && <DataTablePagination table={table} className='mt-auto' />}
    </div>
  )
}
