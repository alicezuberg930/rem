import '@/styles/lightbox.css'
import {
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  Pause,
  Play,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import ReactLightbox from 'yet-another-react-lightbox'
import { useLightboxState } from 'yet-another-react-lightbox/core'
import Captions from 'yet-another-react-lightbox/plugins/captions'
import 'yet-another-react-lightbox/plugins/captions.css'
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen'
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import 'yet-another-react-lightbox/plugins/thumbnails.css'
import Video from 'yet-another-react-lightbox/plugins/video'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'
import { cn } from '@/lib/utils'
import type { LightBoxProps } from './types'

export default function Lightbox({
  slides,
  disabledZoom,
  disabledVideo,
  disabledTotal,
  disabledCaptions,
  disabledSlideshow,
  disabledThumbnails,
  disabledFullscreen,
  onGetCurrentIndex,
  ...other
}: LightBoxProps) {
  const totalItems = slides ? slides.length : 0

  return (
    <ReactLightbox
      slides={slides}
      animation={{ swipe: 240 }}
      carousel={{ finite: totalItems < 5 }}
      controller={{ closeOnBackdropClick: true }}
      plugins={getPlugins({
        disabledZoom,
        disabledVideo,
        disabledCaptions,
        disabledSlideshow,
        disabledThumbnails,
        disabledFullscreen,
      })}
      on={{
        view: ({ index }) => {
          if (onGetCurrentIndex) {
            onGetCurrentIndex(index)
          }
        },
      }}
      toolbar={{
        buttons: [
          <DisplayTotal
            key={0}
            totalItems={totalItems}
            disabledTotal={disabledTotal}
            disabledCaptions={disabledCaptions}
          />,
          'close',
        ],
      }}
      render={{
        iconClose: () => <X className='size-6' />,
        iconZoomIn: () => <ZoomIn className='size-6' />,
        iconZoomOut: () => <ZoomOut className='size-6' />,
        iconSlideshowPlay: () => <Play className='size-6' />,
        iconSlideshowPause: () => <Pause className='size-6' />,
        iconPrev: () => <ChevronLeft className='size-8' />,
        iconNext: () => <ChevronRight className='size-8' />,
        iconExitFullscreen: () => <Minimize className='size-6' />,
        iconEnterFullscreen: () => <Maximize className='size-6' />,
      }}
      {...other}
    />
  )
}

function getPlugins({
  disabledZoom,
  disabledVideo,
  disabledCaptions,
  disabledSlideshow,
  disabledThumbnails,
  disabledFullscreen,
}: LightBoxProps) {
  let plugins = [Captions, Fullscreen, Slideshow, Thumbnails, Video, Zoom]

  if (disabledThumbnails) {
    plugins = plugins.filter((plugin) => plugin !== Thumbnails)
  }
  if (disabledCaptions) {
    plugins = plugins.filter((plugin) => plugin !== Captions)
  }
  if (disabledFullscreen) {
    plugins = plugins.filter((plugin) => plugin !== Fullscreen)
  }
  if (disabledSlideshow) {
    plugins = plugins.filter((plugin) => plugin !== Slideshow)
  }
  if (disabledZoom) {
    plugins = plugins.filter((plugin) => plugin !== Zoom)
  }
  if (disabledVideo) {
    plugins = plugins.filter((plugin) => plugin !== Video)
  }

  return plugins
}

type DisplayTotalProps = {
  totalItems: number
  disabledTotal?: boolean
  disabledCaptions?: boolean
}

export function DisplayTotal({
  totalItems,
  disabledTotal,
  disabledCaptions,
}: DisplayTotalProps) {
  const { currentIndex } = useLightboxState()

  if (disabledTotal) {
    return null
  }

  return (
    <span
      className={cn(
        'yarl__button lightbox-total',
        !disabledCaptions && 'lightbox-total-with-captions'
      )}
    >
      <strong>{currentIndex + 1}</strong> / {totalItems}
    </span>
  )
}
