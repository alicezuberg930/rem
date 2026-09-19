import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import type {
  NativeBarcodeDetectorConstructor,
  ScanResult,
  ScannerFormat,
  ScannerProps,
} from './types'
import { ZXingDecoder } from './zxing-decoder'

const defaultFormats: readonly ScannerFormat[] = [
  'qr_code',
  'ean_13',
  'ean_8',
  'code_128',
  'code_39',
  'upc_a',
  'upc_e',
]

export function Scanner({
  onScan,
  onError,
  onCameraReady,
  fps = 10,
  facingMode = 'environment',
  deviceId,
  formats = defaultFormats,
  className,
  qrbox,
}: ScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const qrboxRef = useRef<HTMLDivElement>(null)
  const callbacksRef = useRef({ onScan, onError, onCameraReady })
  const box = typeof qrbox === 'number' ? { width: qrbox, height: qrbox } : qrbox

  useEffect(() => {
    callbacksRef.current = { onScan, onError, onCameraReady }
  }, [onScan, onError, onCameraReady])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let disposed = false
    let stream: MediaStream | undefined
    let timer: number | undefined
    let decoder: ZXingDecoder | undefined
    let decode:
      | ((canvas: HTMLCanvasElement) => Promise<ScanResult | null>)
      | undefined

    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d', { willReadFrequently: true })
    const delay = 1000 / (Number.isFinite(fps) && fps > 0 ? fps : 10)

    const startZxing = () => {
      const reader = new ZXingDecoder(formats)
      decoder = reader
      decode = async (frame) => reader.decodeFromCanvas(frame)
      // eslint-disable-next-line no-console -- Report which scanner backend is active.
      console.log('[Scanner] Using ZXing decoder')
      return reader
    }

    const tick = async () => {
      if (disposed) return

      try {
        if (context && decode && video.videoWidth && video.videoHeight) {
          const view = video.getBoundingClientRect()
          if (view.width === 0 || view.height === 0) return
          const target = qrboxRef.current?.getBoundingClientRect() ?? view
          const scale = Math.max(view.width / video.videoWidth, view.height / video.videoHeight)
          const croppedX = (video.videoWidth * scale - view.width) / 2
          const croppedY = (video.videoHeight * scale - view.height) / 2
          const sourceX = Math.max(0, (target.left - view.left + croppedX) / scale)
          const sourceY = Math.max(0, (target.top - view.top + croppedY) / scale)
          const sourceWidth = Math.min(target.width / scale, video.videoWidth - sourceX)
          const sourceHeight = Math.min(target.height / scale, video.videoHeight - sourceY)
          if (sourceWidth <= 0 || sourceHeight <= 0) return
          canvas.width = Math.max(1, Math.round(sourceWidth))
          canvas.height = Math.max(1, Math.round(sourceHeight))
          context.drawImage(
            video,
            sourceX,
            sourceY,
            sourceWidth,
            sourceHeight,
            0,
            0,
            canvas.width,
            canvas.height
          )

          let result: ScanResult | null
          try {
            result = await decode(canvas)
          } catch (error) {
            if (!decoder) {
              // Native detection can be present but fail on this device.
              if (disposed) return
              result = startZxing().decodeFromCanvas(canvas)
            } else {
              throw error
            }
          }
          if (!disposed && result) callbacksRef.current.onScan?.(result)
        }
      } catch (error) {
        if (!disposed)
          callbacksRef.current.onError?.(
            error instanceof Error ? error : new Error(String(error))
          )
      } finally {
        if (!disposed) timer = window.setTimeout(tick, delay)
      }
    }

    const start = async () => {
      try {
        if (!context) throw new Error('Canvas 2D is unavailable')
        if (formats.length === 0)
          throw new Error('At least one barcode format is required')
        if (!navigator.mediaDevices?.getUserMedia)
          throw new Error(
            'Camera access requires a supported browser and a secure context'
          )

        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            ...(deviceId ? { deviceId: { exact: deviceId } } : { facingMode }),
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        })
        if (disposed) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }
        video.srcObject = stream
        await video.play()
        if (disposed) return
        callbacksRef.current.onCameraReady?.()

        const NativeDetector = (
          window as Window & {
            BarcodeDetector?: NativeBarcodeDetectorConstructor
          }
        ).BarcodeDetector
        if (typeof NativeDetector === 'function') {
          try {
            const supported = new Set(
              await NativeDetector.getSupportedFormats()
            )
            const nativeFormats = formats.filter((format) =>
              supported.has(format)
            )
            if (nativeFormats.length === formats.length) {
              const detector = new NativeDetector({ formats: nativeFormats })
              decode = async (frame) => {
                const [result] = await detector.detect(frame)
                return result
                  ? { content: result.rawValue, format: result.format }
                  : null
              }
            }
          } catch {
            // Continue with the installed ZXing decoder.
          }
        }
        if (disposed) return
        if (decode) {
          // eslint-disable-next-line no-console -- Report which scanner backend is active.
          console.log('[Scanner] Using native BarcodeDetector API')
        } else {
          startZxing()
        }
        void tick()
      } catch (error) {
        stream?.getTracks().forEach((track) => track.stop())
        video.srcObject = null
        if (!disposed)
          callbacksRef.current.onError?.(
            error instanceof Error ? error : new Error(String(error))
          )
      }
    }

    void start()

    return () => {
      disposed = true
      if (timer !== undefined) window.clearTimeout(timer)
      stream?.getTracks().forEach((track) => track.stop())
      decoder?.reset()
      video.srcObject = null
    }
  }, [deviceId, facingMode, formats, fps, qrbox])

  return (
    <div className={cn('relative h-full w-full overflow-hidden', className)}>
      <video
        ref={videoRef}
        playsInline
        muted
        className='block h-full w-full object-cover'
      />
      {box && (
        <div
          aria-hidden='true'
          className='pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden'
        >
          <div
            ref={qrboxRef}
            className='rounded-md border-2 border-white'
            style={{
              width: Math.max(1, box.width),
              height: Math.max(1, box.height),
              maxWidth: '100%',
              maxHeight: '100%',
              boxShadow: '0 0 0 100vmax rgb(0 0 0 / 55%)',
            }}
          />
        </div>
      )}
    </div>
  )
}
