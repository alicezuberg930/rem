import { type ChangeEvent, useEffect, useRef, useState } from 'react'
import { useTheme } from '@/providers/theme-provider'
import { downloadFile, UniverExchangeClientPlugin } from '@univerjs-pro/exchange-client'
import '@univerjs-pro/exchange-client/facade'
import '@univerjs-pro/exchange-client/lib/index.css'
import ExchangeClientEnUS from '@univerjs-pro/exchange-client/locale/en-US'
import { UniverLicensePlugin } from '@univerjs-pro/license'
import { UniverSheetsCorePreset } from '@univerjs/preset-sheets-core'
import '@univerjs/preset-sheets-core/lib/index.css'
import UniverPresetSheetsCoreEnUS from '@univerjs/preset-sheets-core/locales/en-US'
import { BooleanNumber, createUniver, LocaleType, mergeLocales, type IWorkbookData } from '@univerjs/presets'
import { Download, Loader2, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { ConfigDrawer } from '@/components/config-drawer'
import { ClockInButton } from '@/components/layout/clock-in-button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'

const editableRowCount = 100
const sheetId = 'shipment-orders'
const univerServerUrl = import.meta.env.VITE_UNIVER_SERVER_URL?.trim().replace(/\/+$/, '')
const univerLicense = import.meta.env.VITE_UNIVER_LICENSE?.trim()

const shipmentOrderFields = [
  { name: 'Order Code', width: 160 },
  { name: 'Recipient Name', width: 180 },
  { name: 'Recipient Phone Number', width: 210 },
  { name: 'Recipient Address', width: 260 },
  { name: 'Item Name', width: 180 },
  { name: 'Quantity', width: 120 },
  { name: 'Weight (grams)', width: 160 },
  { name: 'Item Value (VND)', width: 180 },
  { name: 'COD Amount (VND)', width: 190 },
  { name: 'Item Type', width: 160 },
  { name: 'Special Item Characteristics', width: 250 },
  { name: 'Service', width: 160 },
  { name: 'Additional Services', width: 200 },
  { name: 'Collect Payment on Inspection', width: 250 },
  { name: 'Length (cm)', width: 140 },
  { name: 'Width (cm)', width: 140 },
  { name: 'Height (cm)', width: 140 },
  { name: 'Shipping Fee Payer', width: 190 },
  { name: 'Other Requests', width: 210 },
  { name: 'Pickup Appointment Time', width: 220 },
  { name: 'Delivery Time', width: 180 },
] as const

const createWorkbookData = (): Partial<IWorkbookData> => ({
  id: 'shipment-order-workbook',
  name: 'Shipment Order',
  locale: LocaleType.EN_US,
  sheetOrder: [sheetId],
  styles: {
    header: {
      bg: { rgb: '#334155' },
      bl: BooleanNumber.TRUE,
      cl: { rgb: '#FFFFFF' },
    },
  },
  sheets: {
    [sheetId]: {
      id: sheetId,
      name: 'Shipment Orders',
      rowCount: editableRowCount + 1,
      columnCount: shipmentOrderFields.length,
      defaultRowHeight: 40,
      cellData: {
        0: Object.fromEntries(
          shipmentOrderFields.map(({ name }, columnIndex) => [
            columnIndex,
            { v: name, s: 'header' },
          ])
        ),
      },
      columnData: Object.fromEntries(
        shipmentOrderFields.map(({ width }, columnIndex) => [
          columnIndex,
          { w: width },
        ])
      ),
      rowData: {
        0: { h: 48 },
      },
      showGridlines: BooleanNumber.TRUE,
    },
  },
})

type UniverAPI = ReturnType<typeof createUniver>['univerAPI']
type UniverWorkbook = ReturnType<UniverAPI['createWorkbook']>

function hasShipmentOrderHeaders(snapshot: IWorkbookData) {
  const worksheetId = snapshot.sheetOrder[0]
  const headerCells = snapshot.sheets[worksheetId]?.cellData?.[0]
  return shipmentOrderFields.every(({ name }, columnIndex) => String(headerCells?.[columnIndex]?.v ?? '').trim() === name)
}

async function lockWorkbookHeaders(
  univerAPI: UniverAPI,
  workbook: UniverWorkbook
) {
  for (const worksheet of workbook.getSheets()) {
    worksheet.setFrozenRows(1)
    const rule = await worksheet
      .getRange(0, 0, 1, worksheet.getMaxColumns())
      .getRangePermission()
      .protect({
        name: 'Shipment Order Headers',
        allowViewByOthers: true,
      })
    await rule.setPoint(univerAPI.Enum.RangePermissionPoint.Edit, false)
    await rule.setPoint(univerAPI.Enum.RangePermissionPoint.View, true)
  }
}

export function ShipmentOrder() {
  const containerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const univerApiRef = useRef<UniverAPI>(null)
  const [isEditorReady, setIsEditorReady] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [protectionError, setProtectionError] = useState(false)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    if (!containerRef.current) return
    const { univerAPI } = createUniver({
      locale: LocaleType.EN_US,
      locales: {
        [LocaleType.EN_US]: mergeLocales(
          UniverPresetSheetsCoreEnUS,
          ExchangeClientEnUS
        ),
      },
      presets: [
        UniverSheetsCorePreset({
          container: containerRef.current,
        }),
      ],
      plugins: univerServerUrl
        ? [
          [UniverLicensePlugin, { license: univerLicense }],
          [
            UniverExchangeClientPlugin,
            {
              downloadEndpointUrl: `${univerServerUrl}/`,
              uploadFileServerUrl: `${univerServerUrl}/universer-api/stream/file/upload`,
              importServerUrl: `${univerServerUrl}/universer-api/exchange/{type}/import`,
              exportServerUrl: `${univerServerUrl}/universer-api/exchange/{type}/export`,
              getTaskServerUrl: `${univerServerUrl}/universer-api/exchange/task/{taskID}`,
              signUrlServerUrl: `${univerServerUrl}/universer-api/file/{fileID}/sign-url`,
              options: {
                minSheetRowCount: editableRowCount + 1,
                minSheetColumnCount: shipmentOrderFields.length,
              },
            },
          ],
        ]
        : [],
    })
    univerApiRef.current = univerAPI
    let isDisposed = false

    const workbook = univerAPI.createWorkbook(createWorkbookData())
    void lockWorkbookHeaders(univerAPI, workbook)
      .then(() => {
        if (!isDisposed) setIsEditorReady(true)
      })
      .catch(() => {
        if (!isDisposed) setProtectionError(true)
      })

    return () => {
      isDisposed = true
      univerApiRef.current = null
      univerAPI.dispose()
    }
  }, [])

  useEffect(() => {
    univerApiRef.current?.toggleDarkMode(resolvedTheme === 'dark')
  }, [resolvedTheme])

  const handleImport = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0]
    event.currentTarget.value = ''
    if (!file || !univerServerUrl) return

    const importSpreadsheet = async () => {
      const univerAPI = univerApiRef.current
      if (!univerAPI) throw new Error('The shipment order editor is not ready')

      setIsImporting(true)
      try {
        const snapshot = await univerAPI.importXLSXToSnapshotAsync(file)
        if (!snapshot) throw new Error('The spreadsheet could not be converted')
        if (!hasShipmentOrderHeaders(snapshot)) {
          throw new Error(
            'The first row must match the shipment order template headers'
          )
        }

        const currentWorkbook = univerAPI.getActiveWorkbook()
        const currentSnapshot = currentWorkbook?.save()
        if (currentWorkbook) univerAPI.disposeUnit(currentWorkbook.getId())

        try {
          const importedWorkbook = univerAPI.createWorkbook(snapshot)
          await lockWorkbookHeaders(univerAPI, importedWorkbook)
          setProtectionError(false)
        } catch (error) {
          const failedWorkbook = univerAPI.getActiveWorkbook()
          if (failedWorkbook) univerAPI.disposeUnit(failedWorkbook.getId())

          if (currentSnapshot) {
            try {
              univerAPI.createWorkbook(currentSnapshot)
            } catch {
              setIsEditorReady(false)
              setProtectionError(true)
            }
          }

          throw error
        }
      } finally {
        setIsImporting(false)
      }
    }

    toast.promise(importSpreadsheet, {
      loading: 'Importing spreadsheet',
      success: 'Spreadsheet imported',
      error: (error) =>
        error instanceof Error ? error.message : 'Spreadsheet import failed',
    })
  }

  const handleExport = () => {
    if (!univerServerUrl) return

    const exportSpreadsheet = async () => {
      const workbook = univerApiRef.current?.getActiveWorkbook()
      if (!workbook) throw new Error('The shipment order editor is not ready')

      setIsExporting(true)
      try {
        const file = await univerApiRef.current?.exportXLSXBySnapshotAsync(
          workbook.save()
        )
        if (!file) throw new Error('The spreadsheet could not be converted')
        downloadFile(file, 'shipment-orders', 'xlsx')
      } finally {
        setIsExporting(false)
      }
    }

    toast.promise(exportSpreadsheet, {
      loading: 'Exporting spreadsheet',
      success: 'Spreadsheet exported',
      error: (error) =>
        error instanceof Error ? error.message : 'Spreadsheet export failed',
    })
  }

  const actionsDisabled =
    !isEditorReady || !univerServerUrl || isImporting || isExporting

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

      <Main fixed fluid className='gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2
              id='shipment-order-title'
              className='text-2xl font-bold tracking-tight'
            >
              Shipment Order
            </h2>
            <p className='text-muted-foreground'>
              Enter shipment orders directly into the sheet.
            </p>
          </div>
          <div className='flex gap-2'>
            <input
              ref={fileInputRef}
              type='file'
              accept='.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
              className='sr-only'
              onChange={handleImport}
              tabIndex={-1}
            />
            <Button
              type='button'
              variant='outline'
              className='space-x-1'
              disabled={actionsDisabled}
              onClick={() => fileInputRef.current?.click()}
            >
              <span>Import</span>
              {isImporting ? (
                <Loader2 className='size-4 animate-spin' />
              ) : (
                <Upload size={18} />
              )}
            </Button>
            <Button
              type='button'
              variant='outline'
              className='space-x-1'
              disabled={actionsDisabled}
              onClick={handleExport}
            >
              <span>Export</span>
              {isExporting ? (
                <Loader2 className='size-4 animate-spin' />
              ) : (
                <Download size={18} />
              )}
            </Button>
          </div>
        </div>
        {!univerServerUrl && (
          <Alert>
            <AlertDescription>
              Spreadsheet import and export require a configured Univer
              conversion server.
            </AlertDescription>
          </Alert>
        )}
        {protectionError && (
          <Alert variant='destructive'>
            <AlertDescription>
              The shipment order header could not be locked. Reload the page
              before editing the sheet.
            </AlertDescription>
          </Alert>
        )}
        <div
          ref={containerRef}
          role='region'
          aria-labelledby='shipment-order-title'
          className='min-h-0 flex-1 overflow-hidden rounded-md border bg-background'
        />
      </Main>
    </>
  )
}
