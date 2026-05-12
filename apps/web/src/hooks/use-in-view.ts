import React from 'react'

interface UseIsInViewOptions {
  root?: React.RefObject<Element | null>
  margin?: string
  amount?: 'some' | 'all' | number
  once?: boolean
}

export const useInView = (
  ref: React.RefObject<HTMLElement | null>,
  { root, margin, amount = 0.01, once = true }: UseIsInViewOptions = {}
) => {
  const [isInView, setIsInView] = React.useState(false)

  React.useEffect(() => {
    if (!ref.current) return
    // Convert amount to threshold
    let threshold: number | number[]
    if (amount === 'some') {
      threshold = 0.01
    } else if (amount === 'all') {
      threshold = 0.99
    } else {
      threshold = amount
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting
        setIsInView(isIntersecting)
        if (once && isIntersecting) observer.disconnect()
      },
      {
        root: root?.current ?? null,
        rootMargin: margin ?? '50px',
        threshold,
      }
    )
    observer.observe(ref.current)
    return () => {
      observer.disconnect()
    }
  }, [ref, root, margin, amount, once])

  return isInView
}
