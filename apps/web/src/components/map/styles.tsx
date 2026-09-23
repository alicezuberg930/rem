import type { ComponentProps } from 'react'
import 'mapbox-gl/dist/mapbox-gl.css'
import '@/styles/map-box.css'
import { cn } from '@/lib/utils'

export function StyledControlPanel({
  className,
  ...props
}: ComponentProps<'div'>) {
  return <div className={cn('map-control-panel', className)} {...props} />
}
