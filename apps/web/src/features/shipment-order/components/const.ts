import {
    ClientSideRowModelModule,
    CsvExportModule,
    NumberEditorModule,
    QuickFilterModule,
    SelectEditorModule,
    TextEditorModule,
    TextFilterModule,
    themeQuartz,
    type ColDef,
    type ValueFormatterParams,
} from 'ag-grid-community'
import { ShippingOrder } from '@/@types/shipping-order'
import { fCurrency, fNumber } from '@/lib/format-number'

export const itemTypeOptions: string[] = [
    'Household goods',
    'Electronics',
    'Fashion',
    'Food',
    'Printed matter',
    'Cosmetics',
]

export const columnDefs: ColDef<ShippingOrder>[] = [
    {
        field: 'orderCode',
        headerName: 'Order Code',
        pinned: 'left',
        lockPinned: true,
        width: 150,
        cellClass: 'order-code',
    },
    { field: 'recipientName', headerName: 'Recipient Name', width: 180 },
    {
        field: 'recipientPhone',
        headerName: 'Recipient Phone Number',
        width: 220,
    },
    {
        field: 'recipientAddress',
        headerName: 'Recipient Address',
        width: 250,
    },
    { field: 'itemName', headerName: 'Item Name', width: 190 },
    {
        field: 'quantity',
        headerName: 'Quantity',
        width: 110,
        type: 'numericColumn',
    },
    {
        field: 'weight',
        headerName: 'Weight (grams)',
        width: 160,
        type: 'numericColumn',
        valueFormatter: ({ value }: ValueFormatterParams<ShippingOrder>) => fNumber(value),
    },
    {
        field: 'itemValue',
        headerName: 'Item Value (VND)',
        width: 160,
        type: 'numericColumn',
        valueFormatter: ({ value }: ValueFormatterParams<ShippingOrder>) => fCurrency(value),
    },
    {
        field: 'codAmount',
        headerName: 'COD Amount (VND)',
        width: 170,
        type: 'numericColumn',
        valueFormatter: ({ value }: ValueFormatterParams<ShippingOrder>) => fCurrency(value),
    },
    {
        field: 'itemType',
        headerName: 'Item Type',
        width: 140,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
            values: itemTypeOptions,
        },
    },
    {
        field: 'specialCharacteristics',
        headerName: 'Special Item Characteristics',
        width: 240,
    },
    { field: 'service', headerName: 'Service', width: 130 },
    {
        field: 'additionalServices',
        headerName: 'Additional Services',
        width: 190,
    },
    {
        field: 'collectOnInspection',
        headerName: 'Collect Payment on Inspection',
        width: 220,
    },
    {
        field: 'length',
        headerName: 'Length (cm)',
        width: 125,
        type: 'numericColumn',
    },
    {
        field: 'width',
        headerName: 'Width (cm)',
        width: 120,
        type: 'numericColumn',
    },
    {
        field: 'height',
        headerName: 'Height (cm)',
        width: 125,
        type: 'numericColumn',
    },
    {
        field: 'shippingFeePayer',
        headerName: 'Shipping Fee Payer',
        width: 175,
    },
    { field: 'otherRequests', headerName: 'Other Requests', width: 210 },
    {
        field: 'pickupAppointment',
        headerName: 'Pickup Appointment Time',
        width: 205,
    },
    { field: 'deliveryTime', headerName: 'Delivery Time', width: 180 },
]

export const modules = [
    ClientSideRowModelModule,
    CsvExportModule,
    NumberEditorModule,
    QuickFilterModule,
    SelectEditorModule,
    TextEditorModule,
    TextFilterModule,
]

export const gridTheme = themeQuartz.withParams({
    accentColor: '#28a745',
    backgroundColor: 'var(--background)',
    borderColor: '#D9D9D9',
    borderRadius: 0,
    browserColorScheme: 'light',
    cellHorizontalPadding: 16,
    fontSize: 13,
    headerBackgroundColor: 'var(--background)',
    headerFontSize: 11,
    headerFontWeight: 700,
    headerTextColor: 'var(--foreground)',
    rowHoverColor: 'var(--accent)',
    textColor: 'var(--foreground)',
    wrapperBorder: true,
    columnBorder: {
        style: 'solid',
        width: 1,
        color: '#D9D9D9',
    },
    headerColumnBorder: {
        style: 'solid',
        width: 1,
        color: '#D9D9D9',
    },
})

export const defaultColDef: ColDef<ShippingOrder> = {
    editable: true,
    filter: true,
    resizable: true,
    sortable: true,
    useValueFormatterForExport: false,
    wrapHeaderText: true,
}

export const importColumns = [
    { header: 'Order Code', field: 'orderCode', type: 'text' },
    { header: 'Recipient Name', field: 'recipientName', type: 'text' },
    { header: 'Recipient Phone Number', field: 'recipientPhone', type: 'text' },
    { header: 'Recipient Address', field: 'recipientAddress', type: 'text' },
    { header: 'Item Name', field: 'itemName', type: 'text' },
    { header: 'Quantity', field: 'quantity', type: 'number' },
    { header: 'Weight (grams)', field: 'weight', type: 'number' },
    { header: 'Item Value (VND)', field: 'itemValue', type: 'number' },
    {
        header: 'COD Amount (VND)',
        field: 'codAmount',
        type: 'number'
    },
    {
        header: 'Item Type',
        field: 'itemType',
        type: 'text'
    },
    {
        header: 'Special Item Characteristics',
        field: 'specialCharacteristics',
        type: 'text',
    },
    {
        header: 'Service',
        field: 'service',
        type: 'text'
    },
    {
        header: 'Additional Services',
        field: 'additionalServices',
        type: 'text'
    },
    {
        header: 'Collect Payment on Inspection',
        field: 'collectOnInspection',
        type: 'text',
    },
    {
        header: 'Length (cm)',
        field: 'length',
        type: 'number'
    },
    {
        header: 'Width (cm)',
        field: 'width',
        type: 'number'
    },
    {
        header: 'Height (cm)',
        field: 'height',
        type: 'number'
    },
    {
        header: 'Shipping Fee Payer',
        field: 'shippingFeePayer',
        type: 'text'
    },
    {
        header: 'Other Requests',
        field: 'otherRequests',
        type: 'text'
    },
    {
        header: 'Pickup Appointment Time',
        field: 'pickupAppointment',
        type: 'text',
    },
    {
        header: 'Delivery Time',
        field: 'deliveryTime',
        type: 'text'
    },
] as const satisfies ReadonlyArray<{
    header: string
    field: keyof ShippingOrder
    type: 'text' | 'number'
}>

export const MAX_IMPORT_SIZE = 10 * 1024 * 1024
export const MAX_IMPORT_ROWS = 10_000

const createEmptyRow = (): ShippingOrder => ({
  orderCode: '',
  recipientName: '',
  recipientPhone: '',
  recipientAddress: '',
  itemName: '',
  quantity: null,
  weight: null,
  itemValue: null,
  codAmount: null,
  itemType: '',
  specialCharacteristics: '',
  service: '',
  additionalServices: '',
  collectOnInspection: '',
  length: null,
  width: null,
  height: null,
  shippingFeePayer: '',
  otherRequests: '',
  pickupAppointment: '',
  deliveryTime: '',
})

export const createEmptyRows = () => Array.from({ length: 50 }, createEmptyRow)