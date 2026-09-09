import { useState } from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from './ui/input'

type DatePickerProps = {
  value: Date | undefined
  onChange: (date: Date | undefined) => void
  placeholder?: string
  withTime?: boolean
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Pick a date',
  withTime = true,
}: DatePickerProps) {
  const [month, setMonth] = useState<Date>(value ?? new Date())
  const [open, setOpen] = useState(false)
  const date = value

  const handleDateChange = (selectedDate: Date | undefined) => {
    if (!selectedDate) return
    const updated = new Date(selectedDate)
    // preserve existing time if already set
    if (date) {
      updated.setHours(date.getHours())
      updated.setMinutes(date.getMinutes())
    }
    setMonth(updated)
    onChange(updated)
    if (!withTime) setOpen(false)
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(':').map(Number)
    const updated = new Date(date ?? new Date())
    updated.setHours(hours)
    updated.setMinutes(minutes)
    onChange(updated)
  }

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (nextOpen) setMonth(value ?? new Date())
      }}
    >
      <PopoverTrigger
        render={
          <Button
            variant='outline'
            data-empty={!date}
            className='w-37.5 justify-start text-start font-normal data-[empty=true]:text-muted-foreground lg:w-62.5'
          >
            {date ? format(date, 'dd/MM/yyyy') : <span>{placeholder}</span>}
            <CalendarIcon className='ms-auto h-4 w-4 opacity-50' />
          </Button>
        }
      />
      <PopoverContent className='w-auto p-0'>
        <Calendar
          mode='single'
          captionLayout='dropdown'
          month={month}
          selected={date}
          onMonthChange={setMonth}
          onSelect={handleDateChange}
          disabled={(date: Date) =>
            date > new Date('2100-01-01') || date < new Date('1900-01-01')
          }
        />
        {withTime && (
          <div className='flex items-center gap-2 border-t p-3'>
            <Input
              type='time'
              className='w-full'
              value={date ? format(date, 'HH:mm') : ''}
              onChange={handleTimeChange}
            />
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
