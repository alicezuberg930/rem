import { useEffect, useRef } from 'react'
import { useRouterState } from '@tanstack/react-router'
import LoadingBar, { type LoadingBarRef } from '@/components/top-loading-bar'

export function NavigationProgress() {
  // Holds the imperative loading-bar controls.
  const ref = useRef<LoadingBarRef>(null)
  // Reads router status so navigation transitions can drive progress.
  const state = useRouterState()

  // Starts progress during pending navigations and completes it afterward.
  useEffect(() => {
    if (state.status === 'pending') {
      ref.current?.continuousStart()
    } else {
      ref.current?.complete()
    }
  }, [state.status])

  return (
    <LoadingBar
      color='var(--muted-foreground)'
      ref={ref}
      shadow={true}
      height={2}
    />
  )
}
