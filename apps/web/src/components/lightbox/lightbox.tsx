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

// Renders the shared lightbox chrome and optionally replaces its slide content.
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
  customSlide,
  render,
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
        ...render,
        slide: customSlide === undefined ? render?.slide : () => customSlide,
        iconClose: render?.iconClose ?? (() => <X className='size-6' />),
        iconZoomIn: render?.iconZoomIn ?? (() => <ZoomIn className='size-6' />),
        iconZoomOut: render?.iconZoomOut ?? (() => <ZoomOut className='size-6' />),
        iconSlideshowPlay: render?.iconSlideshowPlay ?? (() => <Play className='size-6' />),
        iconSlideshowPause: render?.iconSlideshowPause ?? (() => <Pause className='size-6' />),
        iconPrev: render?.iconPrev ?? (() => <ChevronLeft className='size-8' />),
        iconNext: render?.iconNext ?? (() => <ChevronRight className='size-8' />),
        iconExitFullscreen: render?.iconExitFullscreen ?? (() => <Minimize className='size-6' />),
        iconEnterFullscreen: render?.iconEnterFullscreen ?? (() => <Maximize className='size-6' />),
      }}
      {...other}
    />
  )
}

// Removes plugins that the caller explicitly disabled.
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

// Displays the current one-based slide position in the toolbar.
export function DisplayTotal({
  totalItems,
  disabledTotal,
  disabledCaptions,
}: DisplayTotalProps) {
  // Reads the active slide index from the lightbox context.
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
