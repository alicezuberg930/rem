import { Media } from "@/@types"
import { useInView } from "@/hooks/use-in-view"
import { useEffect, useRef } from "react"
import { getMediaItemColorClassName, getMediaItemIcon } from "./media-utils"
import { cn } from "@/lib/utils"
import { MediaRowActions } from "./media-row-actions"
import { Archive } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

type MediaGridProps = {
    data: Media[]
    hasNextPage: boolean
    isFetchingNextPage: boolean
    isLoadMoreError: boolean
    onLoadMore: () => void
    onDoubleClick: (item: Media) => void
}

export const MediaGrid = ({
    data,
    hasNextPage,
    isFetchingNextPage,
    isLoadMoreError,
    onLoadMore,
    onDoubleClick
}: MediaGridProps) => {
    const loadMoreRef = useRef<HTMLDivElement>(null)
    const isLoadMoreInView = useInView(loadMoreRef, {
        margin: '10px',
        once: false,
    })

    useEffect(() => {
        if (isLoadMoreInView && hasNextPage && !isFetchingNextPage && !isLoadMoreError) {
            onLoadMore()
        }
    }, [hasNextPage, isFetchingNextPage, isLoadMoreError, isLoadMoreInView, onLoadMore])

    return (
        <div className='flex flex-col gap-3'>
            {data.length ? (
                <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                    {data.map((item) => {
                        const Icon = getMediaItemIcon(item)

                        return (
                            <button
                                key={item.id}
                                type='button'
                                onDoubleClick={() => onDoubleClick(item)}
                                className='aspect-square rounded-md border p-2 text-left shadow-xs transition-colors hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none'
                            >
                                <div className='mb-2 flex items-center justify-start gap-3'>
                                    <div
                                        className={cn(
                                            'flex size-6 shrink-0 items-center justify-center rounded-md',
                                            getMediaItemColorClassName(item)
                                        )}
                                    >
                                        <Icon className='size-6' />
                                    </div>
                                    <p className='flex-auto truncate'>{item.name}</p>
                                    {/* options icon */}
                                    <MediaRowActions item={item} />
                                </div>
                                <div className='h-full w-full rounded-md bg-foreground/10'></div>
                            </button>
                        )
                    })}
                </div>
            ) : (
                <div className='flex min-h-64 flex-col items-center justify-center rounded-md border border-dashed p-6 text-center'>
                    <Archive className='mb-3 size-10 text-muted-foreground' />
                    <p className='font-medium'>No items found</p>
                    <p className='mt-1 text-sm text-muted-foreground'>
                        Try another search or open a different folder.
                    </p>
                </div>
            )}
            {/* intersection observer for loading next page */}
            <div
                ref={loadMoreRef}
                className='flex min-h-8 items-center justify-center'
                aria-live='polite'
            >
                {isLoadMoreError ? (
                    <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => onLoadMore()}
                    >
                        Retry loading more
                    </Button>
                ) : (
                    isFetchingNextPage && <Spinner />
                )}
            </div>
        </div>
    )
}
