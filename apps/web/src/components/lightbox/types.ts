import type { ReactNode } from 'react'
import type { LightboxExternalProps } from 'yet-another-react-lightbox'

export interface LightBoxProps extends LightboxExternalProps {
  disabledZoom?: boolean
  disabledVideo?: boolean
  disabledTotal?: boolean
  disabledCaptions?: boolean
  disabledSlideshow?: boolean
  disabledThumbnails?: boolean
  disabledFullscreen?: boolean
  customSlide?: ReactNode
  onGetCurrentIndex?: (index: number) => void
}
