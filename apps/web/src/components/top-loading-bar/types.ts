import type { CSSProperties } from 'react'

/** Imperative controls exposed by the top loading bar ref. */
export type LoadingBarRef = {
  /** Starts the bar and keeps nudging progress until complete() is called. */
  continuousStart: (startingValue?: number, refreshRate?: number) => void
  /** Starts the bar at a fixed progress value without automatic trickling. */
  staticStart: (startingValue?: number) => void
  /** Fills the bar, fades it out, and resets it for the next load. */
  complete: () => void
  /** Moves the bar forward by the provided percentage value. */
  increase: (value: number) => void
  /** Moves the bar backward by the provided percentage value. */
  decrease: (value: number) => void
  /** Reads the latest progress value without waiting for React state. */
  getProgress: () => number
}

/** Visual and timing options for the top loading bar. */
export type LoadingBarProps = {
  color?: string
  height?: number
  shadow?: boolean
  className?: string
  style?: CSSProperties
  loaderSpeed?: number
  waitingTime?: number
  transitionTime?: number
  initialProgress?: number
  onLoaderFinished?: () => void
}
