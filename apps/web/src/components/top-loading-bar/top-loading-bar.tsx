import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { cn } from '@/lib/utils'
import type { LoadingBarProps, LoadingBarRef } from './types'

const MIN_PROGRESS = 0
const MAX_PROGRESS = 100

// Keeps all progress updates within the visible loading-bar range.
const clampProgress = (value: number) =>
  Math.min(MAX_PROGRESS, Math.max(MIN_PROGRESS, value))

// Simulates natural loading by slowing progress as it nears completion.
const getNextTrickleProgress = (currentProgress: number) => {
  if (currentProgress < 20) return currentProgress + 10
  if (currentProgress < 50) return currentProgress + 4
  if (currentProgress < 80) return currentProgress + 2
  if (currentProgress < 95) return currentProgress + 0.5
  return currentProgress
}

const LoadingBar = forwardRef<LoadingBarRef, LoadingBarProps>(
  (
    {
      color = 'var(--primary)',
      height = 3,
      shadow = true,
      className,
      style,
      loaderSpeed = 500,
      waitingTime = 150,
      transitionTime = 300,
      initialProgress = MIN_PROGRESS,
      onLoaderFinished,
    },
    ref
  ) => {
    const initialClampedProgress = clampProgress(initialProgress)
    // Stores the rendered progress percentage.
    const [progress, setProgressState] = useState(initialClampedProgress)
    // Controls opacity while completion and reset transitions run.
    const [isVisible, setIsVisibleState] = useState(initialClampedProgress > 0)

    // Mirrors progress state for timer callbacks and imperative reads.
    const progressRef = useRef(initialClampedProgress)
    // Mirrors visibility state so complete() can skip idle work.
    const isVisibleRef = useRef(initialClampedProgress > 0)
    // Holds the trickle interval started by continuousStart().
    const intervalRef = useRef<number | undefined>(undefined)
    // Holds completion/reset timers so new starts can cancel stale timeouts.
    const resetTimeoutRef = useRef<number | undefined>(undefined)

    // Stops the automatic trickle timer.
    const clearIntervalTimer = useCallback(() => {
      if (intervalRef.current !== undefined) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = undefined
      }
    }, [])

    // Stops any queued fade-out or reset timer.
    const clearResetTimer = useCallback(() => {
      if (resetTimeoutRef.current !== undefined) {
        window.clearTimeout(resetTimeoutRef.current)
        resetTimeoutRef.current = undefined
      }
    }, [])

    // Keeps visibility state and its synchronous ref mirror in lockstep.
    const setVisible = useCallback((nextVisible: boolean) => {
      isVisibleRef.current = nextVisible
      setIsVisibleState(nextVisible)
    }, [])

    // Applies progress updates from direct values or updater functions.
    const setProgress = useCallback((nextProgress: number | ((currentProgress: number) => number)) => {
      const computedProgress = typeof nextProgress === 'function'
        ? nextProgress(progressRef.current)
        : nextProgress
      const clampedProgress = clampProgress(computedProgress)
      progressRef.current = clampedProgress
      setProgressState(clampedProgress)
    }, [])

    // Starts a fresh loading cycle from the provided value.
    const start = useCallback(
      (startingValue = 10) => {
        clearIntervalTimer()
        clearResetTimer()
        setVisible(true)
        setProgress(startingValue)
      },
      [clearIntervalTimer, clearResetTimer, setProgress, setVisible]
    )

    // Completes the bar, lets the fill animation finish, then fades and resets.
    const complete = useCallback(() => {
      clearIntervalTimer()
      clearResetTimer()
      if (!isVisibleRef.current && progressRef.current === MIN_PROGRESS) {
        return
      }
      setVisible(true)
      setProgress(MAX_PROGRESS)

      resetTimeoutRef.current = window.setTimeout(() => {
        setVisible(false)
        resetTimeoutRef.current = window.setTimeout(() => {
          setProgress(MIN_PROGRESS)
          onLoaderFinished?.()
          resetTimeoutRef.current = undefined
        }, transitionTime)
      }, waitingTime + loaderSpeed)
    }, [clearIntervalTimer, clearResetTimer, loaderSpeed, onLoaderFinished, setProgress, setVisible, transitionTime, waitingTime])

    // Exposes the loading-bar commands through the forwarded ref.
    useImperativeHandle(
      ref,
      () => ({
        // Starts the bar and keeps nudging it forward on an interval.
        continuousStart(startingValue = 10, refreshRate = 800) {
          start(startingValue)
          intervalRef.current = window.setInterval(() => {
            setProgress(getNextTrickleProgress)
          }, refreshRate)
        },
        // Starts the bar without scheduling automatic progress updates.
        staticStart(startingValue = 30) {
          start(startingValue)
        },
        complete,
        // Increases progress while keeping the bar visible.
        increase(value) {
          clearResetTimer()
          setVisible(true)
          setProgress((currentProgress) => currentProgress + value)
        },
        // Decreases progress while respecting the 0-100 clamp.
        decrease(value) {
          setProgress((currentProgress) => currentProgress - value)
        },
        // Returns the latest progress value synchronously.
        getProgress() {
          return progressRef.current
        },
      }),
      [clearResetTimer, complete, setProgress, setVisible, start]
    )

    // Cleans up timers when the component unmounts.
    useEffect(() => {
      return () => {
        clearIntervalTimer()
        clearResetTimer()
      }
    }, [clearIntervalTimer, clearResetTimer])

    return (
      <div
        aria-hidden='true'
        className='pointer-events-none fixed inset-x-0 top-0 z-9999'
        style={{ height }}
      >
        <div
          className={cn('h-full origin-left', className)}
          style={{
            backgroundColor: color,
            boxShadow: shadow ? `0 0 10px ${color}, 0 0 5px ${color}` : 'none',
            opacity: isVisible ? 1 : 0,
            transform: `scaleX(${progress / MAX_PROGRESS})`,
            transition: `transform ${loaderSpeed}ms ease, opacity ${transitionTime}ms ease`,
            ...style,
          }}
        />
      </div>
    )
  }
)

export default LoadingBar
