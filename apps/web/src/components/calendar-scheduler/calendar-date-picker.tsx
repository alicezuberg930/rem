import { useState } from 'react'
import { format, startOfMonth } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { DatePicker } from '@/components/date-picker'
import type { DatePickerValue, View } from './types'
import { formatDateLabel, getWeekRange } from './utils'

type CalendarDatePickerProps = {
  mode?: View
  value?: DatePickerValue
  onChange?: (value: DatePickerValue) => void
}

const getDateValue = (value: DatePickerValue | undefined, fallback: Date) => {
  if (!value) return fallback
  return value instanceof Date ? value : value.from
}

export const CalendarDatePicker = ({
  mode = 'month',
  value,
  onChange,
}: CalendarDatePickerProps) => {
  const [open, setOpen] = useState(false)
  const [fallbackDate] = useState(() => new Date())
  const selectedDate = getDateValue(value, fallbackDate)
  const [pickerMonth, setPickerMonth] = useState(selectedDate)
  const selectedWeek =
    value && !(value instanceof Date) ? value : getWeekRange(selectedDate)

  if (mode === 'day' || mode === 'list') {
    return (
      <DatePicker
        value={selectedDate}
        onChange={(date) => {
          if (date) onChange?.(date)
        }}
        placeholder='Pick day'
        withTime={false}
      />
    )
  }

  const displayValue =
    mode === 'week'
      ? `${formatDateLabel(selectedWeek.from)} - ${formatDateLabel(selectedWeek.to)}`
      : format(startOfMonth(selectedDate), 'MM/yyyy')

  const handleSelect = (date: Date | undefined) => {
    if (!date) return
    onChange?.(date)
    setOpen(false)
  }

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (nextOpen) setPickerMonth(selectedDate)
      }}
    >
      <PopoverTrigger
        render={
          <Button
            variant='outline'
            className='w-full justify-start text-start font-normal'
          >
            <span className='truncate'>{displayValue}</span>
            <CalendarIcon className='ms-auto size-4 opacity-50' />
          </Button>
        }
      />
      <PopoverContent align='start' className='w-auto p-0'>
        <Calendar
          mode='single'
          captionLayout='dropdown'
          month={pickerMonth}
          selected={selectedDate}
          onMonthChange={setPickerMonth}
          onSelect={handleSelect}
        />
      </PopoverContent>
    </Popover>
  )
}
