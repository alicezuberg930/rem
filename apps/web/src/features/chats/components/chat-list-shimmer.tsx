import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { Fragment } from "react/jsx-runtime"

const chatListSkeletonClassName = cn(
    'relative overflow-hidden animate-none',
    "before:absolute before:inset-0 before:content-['']",
    'before:animate-[shimmer_1.6s_linear_infinite]',
    'before:bg-[linear-gradient(90deg,transparent,var(--background),transparent)]'
)

export const ChatListShimmer = () => {
    return (
        <>
            {Array.from({ length: 6 }, (_, index) => index).map((row) => (
                <Fragment key={row}>
                    <div
                        aria-hidden='true'
                        className='flex w-full rounded-md px-2 py-2 text-start text-sm'
                    >
                        <div className='flex min-w-0 gap-2'>
                            <Skeleton
                                className={cn(
                                    'size-8 shrink-0 rounded-full',
                                    chatListSkeletonClassName
                                )}
                            />
                            <div className='min-w-0 space-y-2 py-0.5'>
                                <Skeleton
                                    className={cn(
                                        'h-4 w-28',
                                        chatListSkeletonClassName
                                    )}
                                />
                                <Skeleton
                                    className={cn(
                                        'h-3.5 w-40',
                                        chatListSkeletonClassName
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                    <Separator className='my-1' />
                </Fragment>
            ))}
        </>
    )
}