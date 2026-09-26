import { useEffect, useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import Lightbox, { type Slide } from '@/components/lightbox'
import { Markdown } from '@/components/markdown'
import { VideoPlayer } from '@/components/video-player/video-player'
import type { MediaFileKind } from './media-utils'

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

// Builds custom lightbox content for every non-image media type.
const getCustomSlide = (item: MediaViewerItem, text: string) => {
    if (item.kind === 'image') return undefined

    if (item.kind === 'video') {
        return (
            <div className='w-[min(90vw,72rem)]'>
                <VideoPlayer videoUrl={item.url} />
            </div>
        )
    }

    if (item.kind === 'pdf' || item.kind === 'web') {
        return (
            <iframe
                src={item.url}
                title={item.name ?? `${item.kind} preview`}
                className='h-[80dvh] w-[min(90vw,72rem)] rounded-md border-0 bg-white'
            />
        )
    }

    if (item.kind === 'markdown') {
        return (
            <article className='max-h-[80dvh] w-[min(90vw,72rem)] overflow-auto rounded-md bg-background p-6 text-foreground'>
                <Markdown string={text} />
            </article>
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
    const markdownUrl = item?.kind === 'markdown' ? item.url : undefined
    // Stores fetched markdown together with the URL that produced it.
    const [markdown, setMarkdown] = useState({ url: '', content: '' })

    // Fetches markdown content and ignores stale responses when the item changes.
    useEffect(() => {
        const controller = new AbortController()

        if (markdownUrl) {
            fetch(markdownUrl, { signal: controller.signal })
                .then((response) => response.text())
                .then((content) => setMarkdown({ url: markdownUrl, content }))
                .catch((error: unknown) => {
                    if (error instanceof DOMException && error.name === 'AbortError') return
                    setMarkdown({
                        url: markdownUrl,
                        content: 'Unable to load this file.',
                    })
                })
        }

        return () => controller.abort()
    }, [markdownUrl])

    if (!item) return null

    const markdownContent = markdown.url === item.url ? markdown.content : ''

    return (
        <Lightbox
            open
            close={onClose}
            slides={getLightboxSlides(item)}
            customSlide={getCustomSlide(item, markdownContent)}
            disabledSlideshow
            disabledThumbnails
            disabledZoom={item.kind !== 'image'}
        />
    )
}
