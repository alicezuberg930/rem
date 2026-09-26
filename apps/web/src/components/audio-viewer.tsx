import { useEffect, useRef, useState } from 'react'
import { useTheme } from '@/providers/theme-provider'
import { Pause, Play } from 'lucide-react'
import WaveSurfer from 'wavesurfer.js'
import { cn, formatDuration } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

export type AudioViewerProps = {
  audioUrl: string
  title?: string
  className?: string
  autoPlay?: boolean
}

type AudioViewerState = {
  url: string
  status: 'loading' | 'ready' | 'error'
  currentTime: number
  duration: number
  isPlaying: boolean
  error?: string
}

const initialState: AudioViewerState = {
  url: '',
  status: 'loading',
  currentTime: 0,
  duration: 0,
  isPlaying: false,
}

// Resolves an inherited shadcn CSS variable into a canvas-compatible color.
const resolveThemeColor = (
  element: HTMLElement,
  variable: string,
  fallback: string
) => getComputedStyle(element).getPropertyValue(variable).trim() || fallback

// Renders an interactive waveform player for a remote audio file.
export function AudioViewer({
  audioUrl,
  title,
  className,
  autoPlay = false,
}: AudioViewerProps) {
  // Tracks the active theme so an existing waveform can be recolored in place.
  const { resolvedTheme } = useTheme()

  // Holds the DOM element where WaveSurfer renders its waveform.
  const waveformRef = useRef<HTMLDivElement>(null)

  // Holds the WaveSurfer instance used by the playback controls.
  const waveSurferRef = useRef<WaveSurfer | null>(null)

  // Mirrors WaveSurfer playback events into the React interface.
  const [state, setState] = useState<AudioViewerState>(initialState)

  // Creates one WaveSurfer instance per URL and destroys it during cleanup.
  useEffect(() => {
    const container = waveformRef.current
    if (!container) return

    const waveColor = resolveThemeColor(
      container,
      '--muted-foreground',
      'oklch(0.554 0.046 257.417)'
    )
    const progressColor = resolveThemeColor(
      container,
      '--primary',
      'oklch(0.208 0.042 265.755)'
    )
    const waveSurfer = WaveSurfer.create({
      container,
      url: audioUrl,
      autoplay: autoPlay,
      waveColor,
      progressColor,
      cursorColor: progressColor,
      cursorWidth: 2,
      height: 72,
      barWidth: 2,
      barGap: 2,
      barRadius: 2,
      dragToSeek: true,
      normalize: true,
    })

    waveSurferRef.current = waveSurfer

    // Records the duration once the audio is decoded and ready to play.
    const unsubscribeReady = waveSurfer.on('ready', (duration) => {
      setState({
        url: audioUrl,
        status: 'ready',
        currentTime: 0,
        duration,
        isPlaying: waveSurfer.isPlaying(),
      })
    })

    // Keeps the elapsed-time label synchronized with playback and seeking.
    const unsubscribeTimeUpdate = waveSurfer.on('timeupdate', (currentTime) => {
      setState((current) => ({
        ...current,
        url: audioUrl,
        currentTime,
      }))
    })

    // Reflects the playing state after WaveSurfer starts the media element.
    const unsubscribePlay = waveSurfer.on('play', () => {
      setState((current) => ({
        ...current,
        url: audioUrl,
        isPlaying: true,
      }))
    })

    // Reflects the paused state after WaveSurfer pauses the media element.
    const unsubscribePause = waveSurfer.on('pause', () => {
      setState((current) => ({
        ...current,
        url: audioUrl,
        isPlaying: false,
      }))
    })

    // Resets the play control when playback reaches the end of the file.
    const unsubscribeFinish = waveSurfer.on('finish', () => {
      setState((current) => ({
        ...current,
        url: audioUrl,
        currentTime: current.duration,
        isPlaying: false,
      }))
    })

    // Exposes loading or decoding failures as an accessible inline message.
    const unsubscribeError = waveSurfer.on('error', (error) => {
      setState({
        url: audioUrl,
        status: 'error',
        currentTime: 0,
        duration: 0,
        isPlaying: false,
        error: error.message || 'Unable to load this audio file.',
      })
    })

    return () => {
      unsubscribeReady()
      unsubscribeTimeUpdate()
      unsubscribePlay()
      unsubscribePause()
      unsubscribeFinish()
      unsubscribeError()
      waveSurfer.destroy()
      if (waveSurferRef.current === waveSurfer) waveSurferRef.current = null
    }
  }, [audioUrl, autoPlay])

  // Recolors the waveform when shadcn switches between light and dark themes.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const container = waveformRef.current
      const waveSurfer = waveSurferRef.current
      if (!container || !waveSurfer) return

      const progressColor = resolveThemeColor(
        container,
        '--primary',
        'oklch(0.208 0.042 265.755)'
      )
      waveSurfer.setOptions({
        waveColor: resolveThemeColor(
          container,
          '--muted-foreground',
          'oklch(0.554 0.046 257.417)'
        ),
        progressColor,
        cursorColor: progressColor,
      })
    })

    return () => cancelAnimationFrame(frame)
  }, [resolvedTheme])

  const activeState = state.url === audioUrl ? state : initialState
  const isLoading = activeState.status === 'loading'

  // Toggles playback and reports browser playback-policy failures inline.
  const togglePlayback = async () => {
    try {
      await waveSurferRef.current?.playPause()
    } catch {
      setState((current) => ({
        ...current,
        url: audioUrl,
        status: 'error',
        isPlaying: false,
        error: 'Playback could not be started.',
      }))
    }
  }

  return (
    <div
      className={cn(
        'w-full rounded-md border bg-card p-4 text-card-foreground',
        className
      )}
    >
      {title && <p className='mb-3 truncate text-sm font-medium'>{title}</p>}

      <div className='flex min-w-0 items-center gap-3'>
        <Button
          type='button'
          variant='outline'
          size='icon'
          aria-label={activeState.isPlaying ? 'Pause audio' : 'Play audio'}
          disabled={isLoading || activeState.status === 'error'}
          onClick={togglePlayback}
        >
          {isLoading ? (
            <Spinner />
          ) : activeState.isPlaying ? (
            <Pause />
          ) : (
            <Play />
          )}
        </Button>

        <div className='min-w-0 flex-1'>
          <div
            ref={waveformRef}
            className='min-h-18 w-full overflow-hidden'
            aria-label='Audio waveform'
          />
          <div className='mt-1 flex justify-between text-xs text-muted-foreground tabular-nums'>
            <span>{formatDuration(Math.floor(activeState.currentTime))}</span>
            <span>{formatDuration(Math.floor(activeState.duration))}</span>
          </div>
        </div>
      </div>

      {activeState.error && (
        <p className='mt-3 text-sm text-destructive' role='alert'>
          {activeState.error}
        </p>
      )}
    </div>
  )
}
