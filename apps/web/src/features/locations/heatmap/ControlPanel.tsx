import { memo } from 'react'
import { format } from 'date-fns'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { StyledControlPanel } from '@/components/map'

type Props = {
  startTime: number
  endTime: number
  allDays: boolean
  selectedTime: number
  onChangeTime: (value: number) => void
  onChangeAllDays: (value: boolean) => void
}

function ControlPanel({
  startTime,
  endTime,
  allDays,
  selectedTime,
  onChangeTime,
  onChangeAllDays,
}: Props) {
  const day = 24 * 60 * 60 * 1000
  const days = Math.round((endTime - startTime) / day)
  const selectedDay = Math.round((selectedTime - startTime) / day)
  const isReady = startTime > 0 && endTime > startTime

  const handleChangeDays = (value: number) => {
    const daysToAdd = value
    const newTime = startTime + daysToAdd * day
    onChangeTime(newTime)
  }

  return (
    <StyledControlPanel>
      <div className='flex w-full items-center justify-between'>
        <span className='text-sm font-medium'>All days</span>

        <Switch checked={allDays} onCheckedChange={(v) => onChangeAllDays(v)} />
      </div>

      <div className='flex items-center justify-between gap-4 text-xs'>
        <span className='text-muted-foreground'>Selected date</span>
        <span className='font-medium tabular-nums'>
          {isReady ? format(selectedTime, 'dd MMM yyyy') : 'Loading...'}
        </span>
      </div>

      <Slider
        aria-label='Earthquake date'
        min={0}
        step={1}
        max={Math.max(days, 1)}
        disabled={allDays || !isReady}
        value={Math.max(selectedDay, 0)}
        onValueChange={(value) => {
          if (typeof value === 'number') handleChangeDays(value)
        }}
      />
    </StyledControlPanel>
  )
}

export default memo(ControlPanel)
