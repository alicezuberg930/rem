import { memo } from 'react'
import type { LngLat } from 'react-map-gl/mapbox'
import { StyledControlPanel } from '@/components/map'

const EVENT_NAMES = ['onDragStart', 'onDrag', 'onDragEnd'] as const

function round5(value: number) {
  return (Math.round(value * 1e5) / 1e5).toFixed(5)
}

type Props = {
  events: Record<string, LngLat>
}

function ControlPanel({ events = {} }: Props) {
  return (
    <StyledControlPanel>
      <p className='text-sm font-medium'>Marker events</p>
      {EVENT_NAMES.map((event) => {
        const lngLat = events[event]

        return (
          <div key={event} className='flex items-center justify-between gap-4'>
            <span className='text-xs text-muted-foreground'>
              {event.replace('onDrag', '') || 'Drag'}
            </span>
            <span className='font-mono text-xs tabular-nums'>
              {lngLat ? `${round5(lngLat.lng)}, ${round5(lngLat.lat)}` : '--'}
            </span>
          </div>
        )
      })}
    </StyledControlPanel>
  )
}
export default memo(ControlPanel)
