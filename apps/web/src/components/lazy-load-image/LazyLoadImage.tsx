import React from 'react'
import { cn } from '@/lib/utils'
import { useInView } from '@/hooks/use-in-view'
import type { LazyLoadImageProps } from './types'

export default function LazyLoadImage({
  placeholderSrc,
  effect,
  wrapperClassName,
  responsiveSizes,
  widths,
  ...props
}: LazyLoadImageProps) {
  const [isLoaded, setIsLoaded] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { margin: '50px' })

  const handleLoad = () => setIsLoaded(true)

  // Generate srcset from widths array if provided
  const generateSrcSet = (
    src: string | undefined,
    widths: { screenWidth: number; imageWidth: number }[] | undefined
  ) => {
    if (!src || !widths || widths.length === 0) return undefined
    const isCloudinary = src.includes('cloudinary.com')
    if (isCloudinary) {
      const urlParts = src.split('/upload/')
      if (urlParts.length !== 2) return undefined
      const baseUrl = urlParts[0] + '/upload'
      const imagePath = urlParts[1]
      // Generate srcset with Cloudinary transformations
      return widths
        .map(
          (width) =>
            `${baseUrl}/w_${width.imageWidth},f_auto,q_auto,dpr_1.0/${imagePath} ${width.screenWidth}w`
        )
        .join(', ')
    } else {
      // For non-Cloudinary URLs just return nothing or a basic srcset
      return undefined
    }
  }

  const srcSet = widths
    ? generateSrcSet(props.src as string, widths)
    : undefined
  const sizes = responsiveSizes || props.sizes || '100vw'

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden h-full', wrapperClassName)}
    >
      {/* Placeholder */}
      {!isLoaded && placeholderSrc && (
        <img
          src={placeholderSrc}
          alt='placeholder'
          className={cn(
            'absolute inset-0 h-full w-full object-cover',
            props.className,
          )}
          aria-hidden='true'
        />
      )}
      {/* Skeleton fallback when there is no placeholder */}
      {!isLoaded && !placeholderSrc && (
        <div
          className={cn(
            'absolute inset-0 h-full w-full animate-pulse bg-gray-200 dark:bg-gray-800',
            props.className
          )}
        />
      )}
      {isInView && (
        <img
          {...props}
          loading='lazy'
          srcSet={srcSet}
          sizes={sizes}
          fetchPriority='high'
          decoding='async'
          onLoad={handleLoad}
          alt={props.alt}
          className={cn(
            props.className,
            'transition-opacity duration-500 ease-in-out h-full w-full',
            isLoaded ? 'opacity-100' : 'opacity-0',
            effect === 'blur' && !isLoaded && 'blur-sm',
            effect === 'black-and-white' && !isLoaded && 'grayscale'
          )}
        />
      )}
    </div>
  )
}
