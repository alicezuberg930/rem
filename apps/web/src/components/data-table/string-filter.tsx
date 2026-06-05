import { type Column } from '@tanstack/react-table'
import { Input } from '@/components/ui/input'

type DataTableStringFilterProps<TData, TValue> = {
  column?: Column<TData, TValue>
  title?: string
  placeholder?: string
}

export function DataTableStringFilter<TData, TValue>({
  column,
  title,
  placeholder = `Filter ${title?.toLowerCase()}...`,
}: DataTableStringFilterProps<TData, TValue>) {
  const value = (column?.getFilterValue() as string) ?? ''

  return (
    <Input
      placeholder={placeholder}
      value={value}
      onChange={(event) => column?.setFilterValue(event.target.value)}
      className='w-37.5 lg:w-62.5'
    />
  )
}
