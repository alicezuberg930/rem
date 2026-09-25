import { useEffect, useRef, useState } from 'react'
import {
  RowSelection,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { Media } from '@/@types/media'
import { cn } from '@/lib/utils'
import { useInView } from '@/hooks/use-in-view'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTableToolbar } from '@/components/data-table'
import { mediaColumns as columns } from './media-columns'

type MediaTableProps = {
  data: Media[]
  hasNextPage: boolean
  isFetchingNextPage: boolean
  isLoadMoreError: boolean
  onLoadMore: () => void
  onDoubleClick: (item: Media) => void
}

export function MediaTable({
  data,
  hasNextPage,
  isFetchingNextPage,
  isLoadMoreError,
  onLoadMore,
  onDoubleClick,
}: MediaTableProps) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const isLoadMoreInView = useInView(loadMoreRef, {
    margin: '10px',
    once: false,
  })

  useEffect(() => {
    if (
      isLoadMoreInView &&
      hasNextPage &&
      !isFetchingNextPage &&
      !isLoadMoreError
    ) {
      onLoadMore()
    }
  }, [
    hasNextPage,
    isFetchingNextPage,
    isLoadMoreError,
    isLoadMoreInView,
    onLoadMore,
  ])

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <DataTableToolbar table={table} showSearch={false} />
      <div className='overflow-hidden rounded-md border shadow-xs'>
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
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={cn(
                    'group/row',
                    row.original.type === 'FOLDER' && 'cursor-pointer'
                  )}
                  onDoubleClick={() => onDoubleClick(row.original)}
                >
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
                  No items found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* intersection observer for loading next page */}
      <div
        ref={loadMoreRef}
        className='flex min-h-8 items-center justify-center'
        aria-live='polite'
      >
        {isLoadMoreError ? (
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => onLoadMore()}
          >
            Retry loading more
          </Button>
        ) : (
          isFetchingNextPage && <Spinner />
        )}
      </div>
    </div>
  )
}
