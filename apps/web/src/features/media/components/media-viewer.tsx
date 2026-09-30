import { useEffect, useRef, useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { CsvViewer } from '@/components/csv-viewer'
import { buttonVariants } from '@/components/ui/button'
import Lightbox, { type Slide } from '@/components/lightbox'
import { ModelViewer } from '@/components/model-viewer'
import { OfficeViewer } from '@/components/office-viewer'
import { VideoPlayer } from '@/components/video-player/video-player'
import { highlightCodeElement } from '@/lib/utils'
import type { MediaFileKind } from '@/lib/media'
import { AudioViewer } from '@/components/audio-viewer'
import { CodeViewer } from '@/components/code-viewer'

export type MediaViewerItem = {
    url: string
    kind: MediaFileKind
    name?: string
}

type MediaViewerProps = {
    item: MediaViewerItem | null
    onClose: () => void
}

// Creates the single slide that gives the lightbox its navigation state.
const getLightboxSlides = (item: MediaViewerItem | null): Slide[] => {
    if (!item) return []

    return [
        {
            src: item.url,
            alt: item.name,
            title: item.name,
        },
    ]
}

// Renders custom lightbox content for every non-image media type.
const CustomSlide = (item: MediaViewerItem) => {
    if (item.kind === 'image') return null
    if (item.kind === 'video') {
        return (
            <div className='w-[min(90vw,72rem)]'>
                <VideoPlayer videoUrl={item.url} />
            </div>
        )
    }
    if (item.kind === 'model') {
        return (
            <div className='h-[80dvh] w-[min(90vw,72rem)]'>
                <ModelViewer modelUrl={item.url} />
            </div>
        )
    }
    if (item.kind === 'pdf') {
        return (
            <iframe
                src={item.url}
                title={item.name ?? `${item.kind} preview`}
                className='h-[80dvh] w-[min(90vw,72rem)] rounded-md border-0 bg-white'
            />
        )
    }
    if (item.kind === 'csv') {
        return (
            <CsvViewer
                url={item.url}
                title={item.name ?? 'CSV preview'}
                className='h-[80dvh] w-[min(90vw,72rem)]'
            />
        )
    }
    if (item.kind === 'document' || item.kind === 'spreadsheet' || item.kind === 'slideshow') {
        return (
            <div className='h-[80dvh] w-[min(90vw,72rem)]'>
                <OfficeViewer
                    url={item.url}
                    title={item.name ?? 'Microsoft Office document preview'}
                />
            </div>
        )
    }
    if (item.kind === 'text' || item.kind === 'code') {
        return (
            <div className='h-[80dvh] w-[min(90vw,72rem)] overflow-y-auto'>
                <CodeViewer markdownUrl={item.url} />
            </div>
        )
    }
    if (item.kind === 'audio') {
        return (
            <div className='w-[min(90vw,72rem)]'>
                <AudioViewer audioUrl={item.url} />
            </div>
        )
    }
    return (
        <div className='flex min-h-48 w-[min(90vw,36rem)] flex-col items-center justify-center gap-4 rounded-md border border-dashed bg-background p-6 text-center text-foreground'>
            <p className='max-w-md text-sm text-muted-foreground'>
                Download or open the file in a new tab to view it with a compatible
                application.
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
    )
}

// Opens the selected media item in the shared lightbox.
export function MediaViewer({ item, onClose }: MediaViewerProps) {
    if (!item) return null
    const disabledPrint = item.kind === 'video' || item.kind === 'archive' || item.kind === 'audio' || item.kind === 'model'
    return (
        <Lightbox
            disabledTotal
            open
            close={onClose}
            slides={getLightboxSlides(item)}
            customSlide={CustomSlide(item)}
            disabledSlideshow
            disabledThumbnails
            disabledPrint={disabledPrint}
            disabledZoom={item.kind !== 'image'}
        />
    )
}
