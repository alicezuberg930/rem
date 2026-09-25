import { ExternalLink } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import Lightbox, { type Slide } from '@/components/lightbox'
import type { MediaFileKind } from './media-utils'
import { useEffect, useState } from 'react'
import { VideoPlayer } from '@/components/video/video-player'

export type MediaViewerItem = {
  url: string
  kind: MediaFileKind
  name?: string
  mimeType?: string
}

type MediaViewerProps = {
  item: MediaViewerItem | null
  onClose: () => void
}

const canPreviewInLightbox = (kind: MediaFileKind) => kind === 'image'

const getLightboxSlides = (item: MediaViewerItem | null): Slide[] => {
  if (!item) return []

  if (item.kind === 'image') {
    return [
      {
        src: item.url,
        alt: item.name,
        title: item.name,
      },
    ]
  }

  if (item.kind === 'video') {
    return [
      {
        type: 'video',
        title: item.name,
        controls: true,
        playsInline: true,
        sources: [
          {
            src: item.url,
            type: item.mimeType || 'video/mp4',
          },
        ],
      },
    ]
  }

  return []
}

export function MediaViewer({ item, onClose }: MediaViewerProps) {
  if (!item) return null

  const isLightboxPreview = canPreviewInLightbox(item.kind)
  const [text, setText] = useState<string>('')

  useEffect(() => {
    if (item.kind === 'markdown') {
      fetch(item.url).then(res => res.text()).then((data) => setText(data))
    }
  }, [])

  if (isLightboxPreview) {
    return (
      <Lightbox
        open
        close={onClose}
        slides={getLightboxSlides(item)}
        disabledSlideshow
        disabledThumbnails
        video={{
          autoPlay: true,
          controls: true,
          playsInline: true,
        }}
      />
    )
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent className='flex max-h-[90dvh] flex-col overflow-y-auto sm:max-w-5xl'>
        <DialogHeader className='text-start'>
          <DialogTitle>{item.name ?? 'Media preview'}</DialogTitle>
          <DialogDescription>
            {item.kind === 'pdf'
              ? 'Previewing the selected PDF.'
              : 'This file type cannot be previewed inline.'}
          </DialogDescription>
        </DialogHeader>
        {item.kind === 'video' && (
          <VideoPlayer videoUrl={item.url}/>
        )}
        {item.kind === 'web' ? (
          <div dangerouslySetInnerHTML={{ __html: text }}></div>
        ) : item.kind === 'pdf' ? (
          <iframe
            src={item.url}
            title={item.name ?? 'PDF preview'}
            className='h-[70dvh] w-full rounded-md border bg-background'
          />
        ) : (
          <div className='flex min-h-48 flex-col items-center justify-center gap-4 rounded-md border border-dashed p-6 text-center'>
            <p className='max-w-md text-sm text-muted-foreground'>
              Download or open the file in a new tab to view it with a
              compatible application.
            </p>
            <a
              href={item.url}
              target='_blank'
              rel='noreferrer'
              className={buttonVariants({ variant: 'outline' })}
            >
              <ExternalLink data-icon='inline-start' />
              Open file
            </a>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
