import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { format } from 'date-fns'
import { ShippingOrder } from '@/@types/shipping-order'
import { ClockInButton } from '@/layout/clock-in-button'
import { Header } from '@/layout/header'
import { Main } from '@/layout/main'
import { AgGridProvider, AgGridReact } from 'ag-grid-react'
import { readSheet } from 'read-excel-file/browser'
import { fNumber } from '@/lib/format-number'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/toast'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columnDefs, defaultColDef, gridTheme, importColumns, modules, createEmptyRows, MAX_IMPORT_SIZE, MAX_IMPORT_ROWS } from './components/const'
import { ShipmentOrderPrimaryButtons } from './components/shipment-order-primary-buttons'

const isPopulatedCell = (value: unknown) => value !== null && value !== undefined && String(value).trim() !== ''

const parseImportedRows = (sheetRows: unknown[][]): ShippingOrder[] => {
  if (sheetRows.length === 0) throw new Error('The selected workbook is empty.')

  const [headerRow, ...dataRows] = sheetRows
  const headerPositions = new Map<string, number>()

  headerRow.forEach((header, index) => {
    headerPositions.set(String(header), index)
  })

  const missingHeaders = importColumns.filter(({ header }) => !headerPositions.has(header))

  if (missingHeaders.length > 0) {
    const names = missingHeaders.map(({ header }) => header).join(', ')
    throw new Error(
      `Missing required column${missingHeaders.length > 1 ? 's' : ''}: ${names}`
    )
  }
  const populatedRows = dataRows.filter((row) => row.some(isPopulatedCell))
  if (populatedRows.length === 0) {
    throw new Error('The workbook has headers but no order rows.')
  }
  if (populatedRows.length > MAX_IMPORT_ROWS) {
    throw new Error(
      `The workbook contains more than ${MAX_IMPORT_ROWS.toLocaleString()} rows.`
    )
  }

  return populatedRows.map((row) => {
    const record = {} as Record<keyof ShippingOrder, string | number | null>
    importColumns.forEach(({ field, header, type }) => {
      const value = row[headerPositions.get(String(header))!]
      record[field] = type === 'number' ? fNumber(value as string) : String(value)
    })
    return record as ShippingOrder
  })
}

export function ShipmentOrder() {
  const [rows, setRows] = useState<ShippingOrder[]>(createEmptyRows)
  const [query, setQuery] = useState('')
  const [isImporting, setIsImporting] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const gridRef = useRef<AgGridReact<ShippingOrder>>(null)

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', focusSearch)
    return () => window.removeEventListener('keydown', focusSearch)
  }, [])

  const importExcel = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setIsImporting(true)
    try {
      if (!file.name.toLowerCase().endsWith('.xlsx')) {
        throw new Error('Choose an Excel workbook in .xlsx format.')
      }
      if (file.size > MAX_IMPORT_SIZE) {
        throw new Error('The workbook is larger than the 10 MB import limit.')
      }
      const sheetRows = await readSheet(file)
      const importedRows = parseImportedRows(sheetRows)
      gridRef.current?.api.stopEditing()
      gridRef.current?.api.setFilterModel(null)
      setQuery('')
      setRows(importedRows)
      toast.success(`Imported ${importedRows.length} order${importedRows.length === 1 ? '' : 's'} from ${file.name}.`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'The workbook could not be imported.')
    } finally {
      setIsImporting(false)
      event.target.value = ''
    }
  }

  const exportExcel = () => {
    if (!gridRef.current) return
    gridRef.current.api.stopEditing()
    gridRef.current.api.exportDataAsCsv({
      allColumns: true,
      exportedRows: 'filteredAndSorted',
      fileName: `shipment-orders-${format(new Date(), 'yyyy-MM-dd-HH-mm-ss')}.csv`,
      processCellCallback: ({ value }) => {
        if (value === null || value === undefined) return ''
        if (typeof value === 'number') return String(value)
        const text = String(value)
        return /^[+=@\t\r-]/.test(text) ? `'${text}` : text
      },
    })
  }

  return (
    <>
      <Header fixed>
        <Search />
        <ClockInButton />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              Shipment Order
            </h2>
            <p className='text-muted-foreground'>
              Enter shipment orders directly into the sheet.
            </p>
          </div>
          <ShipmentOrderPrimaryButtons
            isImporting={isImporting}
            importExcel={importExcel}
            exportExcel={exportExcel}
          />
          <Input
            ref={searchRef}
            type='search'
            placeholder='Search orders...'
            aria-keyshortcuts='Control+K Meta+K'
            value={query}
          />
        </div>
        <AgGridProvider modules={modules}>
          <AgGridReact<ShippingOrder>
            ref={gridRef}
            theme={gridTheme}
            rowData={rows}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            quickFilterText={query}
            headerHeight={64}
            animateRows
            singleClickEdit
            stopEditingWhenCellsLoseFocus
            suppressMovableColumns
          />
        </AgGridProvider>
      </Main>
    </>
  )
}