import { microsoftOfficeViewerUrl } from '@/lib/constants'
import { cn } from '@/lib/utils'

export type OfficeViewerProps = {
    url: string
    title?: string
}

const createOfficeViewerUrl = (sourceUrl: string) => {
    try {
        const parsedUrl = new URL(sourceUrl.trim())
        if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:')
            return null
        const viewerUrl = new URL(microsoftOfficeViewerUrl)
        viewerUrl.searchParams.set('src', parsedUrl.toString())
        return viewerUrl.toString()
    } catch {
        return null
    }
}

export const OfficeViewer = ({
    url,
    title = 'Microsoft Office document preview',
}: OfficeViewerProps) => {
    const viewerUrl = createOfficeViewerUrl(url)

    return (
        <div className={cn('h-full w-full overflow-hidden rounded-md bg-white')}>
            {viewerUrl ? (
                <iframe
                    src={viewerUrl}
                    title={title}
                    className='size-full border-0 bg-white'
                    loading='lazy'
                    allowFullScreen
                />
            ) : (
                <div className='flex size-full items-center justify-center p-6 text-center text-sm text-muted-foreground'>
                    A public HTTP or HTTPS document URL is required for Office preview.
                </div>
            )}
        </div>
    )
}
