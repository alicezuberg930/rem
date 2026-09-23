import { Popup, type PopupProps } from 'react-map-gl/mapbox'
import { cn } from '@/lib/utils'

export default function MapPopup({
  className,
  children,
  ...other
}: PopupProps) {
  return (
    <Popup anchor='bottom' className={cn('map-popup', className)} {...other}>
      {children}
    </Popup>
  )
}
