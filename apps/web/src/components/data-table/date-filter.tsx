import { type Column } from '@tanstack/react-table'
import { DatePicker } from '../date-picker'
import { format } from 'date-fns'

type DataTableDateFilterProps<TData, TValue> = {
    column?: Column<TData, TValue>
}

export function DataTableDateFilter<TData, TValue>({
    column,
}: DataTableDateFilterProps<TData, TValue>) {
    const value = column?.getFilterValue() as Date | undefined

    const handleSelect = (date: Date | undefined) => {
        if (!date) return
        column?.setFilterValue(format(date, "dd-MM-yyyy"))
    }

    return (
        <DatePicker
            withTime={false}
            value={value}
            onChange={handleSelect}
        />
    )
}
