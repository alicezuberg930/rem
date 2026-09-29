import { useEffect, useState } from 'react'
import { parseCsv } from '@/lib/csv'
import { cn } from '@/lib/utils'
import { Spinner } from '@/components/ui/spinner'

const MAX_VISIBLE_ROWS = 1_000
const MAX_VISIBLE_COLUMNS = 100

type CsvViewerProps = {
  url: string
  title?: string
  className?: string
}

type CsvViewerState = {
  url: string
  status: 'loading' | 'ready' | 'error'
  rows: string[][]
  totalRows: number
  totalColumns: number
  error?: string
}

const createInitialState = (url: string): CsvViewerState => ({
  url,
  status: 'loading',
  rows: [],
  totalRows: 0,
  totalColumns: 0,
})

export function CsvViewer({
  url,
  title = 'CSV preview',
  className,
}: CsvViewerProps) {
  const [state, setState] = useState<CsvViewerState>(() =>
    createInitialState(url)
  )

  useEffect(() => {
    const controller = new AbortController()

    fetch(url, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Unable to load CSV (${response.status})`)
        }
        return response.text()
      })
      .then((content) => {
        const parsedRows = parseCsv(content)
        const totalColumns = parsedRows.reduce(
          (maximum, currentRow) => Math.max(maximum, currentRow.length),
          0
        )

        setState({
          url,
          status: 'ready',
          rows: parsedRows
            .slice(0, MAX_VISIBLE_ROWS + 1)
            .map((currentRow) => currentRow.slice(0, MAX_VISIBLE_COLUMNS)),
          totalRows: Math.max(parsedRows.length - 1, 0),
          totalColumns,
        })
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setState({
          ...createInitialState(url),
          status: 'error',
          error: error instanceof Error ? error.message : 'Unable to load CSV',
        })
      })

    return () => controller.abort()
  }, [url])

  const currentState = state.url === url ? state : createInitialState(url)
  const [header = [], ...dataRows] = currentState.rows
  const visibleColumnCount = Math.min(
    Math.max(header.length, ...dataRows.map((row) => row.length), 0),
    MAX_VISIBLE_COLUMNS
  )

  return (
    <div
      aria-label={title}
      className={cn(
        'relative h-[70dvh] min-h-96 w-full overflow-hidden rounded-md border bg-background',
        className
      )}
    >
      {currentState.status === 'loading' && (
        <div className='flex size-full items-center justify-center gap-2 text-sm text-muted-foreground'>
          <Spinner />
          Loading CSV…
        </div>
      )}

      {currentState.status === 'error' && (
        <div className='flex size-full items-center justify-center p-6 text-center text-sm text-destructive'>
          {currentState.error}
        </div>
      )}

      {currentState.status === 'ready' && currentState.rows.length === 0 && (
        <div className='flex size-full items-center justify-center p-6 text-sm text-muted-foreground'>
          This CSV file is empty.
        </div>
      )}

      {currentState.status === 'ready' && currentState.rows.length > 0 && (
        <div className='flex size-full flex-col'>
          <div className='min-h-0 flex-1 overflow-auto'>
            <table className='w-max min-w-full border-separate border-spacing-0 text-sm'>
              <thead className='sticky top-0 z-10 bg-muted'>
                <tr>
                  {Array.from(
                    { length: visibleColumnCount },
                    (_, columnIndex) => (
                      <th
                        key={columnIndex}
                        scope='col'
                        className='max-w-96 min-w-32 border-r border-b px-3 py-2 text-left font-medium whitespace-pre-wrap last:border-r-0'
                      >
                        {header[columnIndex] || `Column ${columnIndex + 1}`}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {dataRows.map((row, rowIndex) => (
                  <tr key={rowIndex} className='even:bg-muted/30'>
                    {Array.from(
                      { length: visibleColumnCount },
                      (_, columnIndex) => (
                        <td
                          key={columnIndex}
                          className='max-w-96 min-w-32 border-r border-b px-3 py-2 align-top whitespace-pre-wrap last:border-r-0'
                        >
                          {row[columnIndex]}
                        </td>
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {(currentState.totalRows > MAX_VISIBLE_ROWS ||
            currentState.totalColumns > MAX_VISIBLE_COLUMNS) && (
            <p className='border-t bg-muted/50 px-3 py-2 text-xs text-muted-foreground'>
              Showing the first{' '}
              {Math.min(currentState.totalRows, MAX_VISIBLE_ROWS)} rows and{' '}
              {Math.min(currentState.totalColumns, MAX_VISIBLE_COLUMNS)}{' '}
              columns.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
