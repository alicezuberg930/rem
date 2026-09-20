import { memo, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import type {
  NativeBarcodeDetectorConstructor,
  ScanResult,
  ScannerFormat,
  ScannerProps,
} from './types'
import { ZXingDecoder } from './zxing-decoder'

const defaultFormats: readonly ScannerFormat[] = [
  'aztec',
  'codabar',
  'code_39',
  'code_93',
  'code_128',
  'data_matrix',
  'ean_8',
  'ean_13',
  'itf',
  'pdf417',
  'qr_code',
  'upc_a',
  'upc_e',
  // 'maxicode',
  // 'rss_14',
  // 'rss_expanded',
  // 'micro_qr_code',
  // 'upc_ean_extension',
]

// The Scanner component streams the camera, crops the active scan region, and decodes barcodes from that crop.
export const Scanner = memo(({
  onScan,
  onError,
  onCameraReady,
  fps = 10,
  facingMode = 'environment',
  deviceId,
  formats = defaultFormats,
  className,
  qrbox,
}: ScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const qrboxRef = useRef<HTMLDivElement>(null)
  // Store callback functions in a ref so the scanning loop can access the latest ones without re-registering effects.
  const callbacksRef = useRef({ onScan, onError, onCameraReady })
  // Normalize a numeric QR box size into width and height so the UI can treat it consistently.
  // Expose primitive dimensions so effect deps avoid restarting when parent passes a new object reference.
  const boxWidth = typeof qrbox === 'object' && 'width' in qrbox ? qrbox.width : qrbox
  const boxHeight = typeof qrbox === 'object' && 'height' in qrbox ? qrbox.height : qrbox

  useEffect(() => {
    callbacksRef.current = { onScan, onError, onCameraReady }
  }, [onScan, onError, onCameraReady])

  // Start the camera, decode frames, and keep polling the video stream for new barcodes.
  useEffect(() => {
    // Get the live video element; the scanner cannot work without it.
    const video = videoRef.current
    if (!video) return
    // Track whether the scanner has been disposed so the async loop can stop cleanly.
    let disposed = false
    // Keep the active camera stream so it can be stopped during cleanup.
    let stream: MediaStream | undefined
    // Store the repeating timeout id used by the scan loop.
    let timer: number | undefined
    let decoder: ZXingDecoder | undefined
    // Store the decode function used to process each captured frame.
    let decode:
      | ((canvas: HTMLCanvasElement) => Promise<ScanResult | null>)
      | undefined
    // Create an offscreen canvas used for cropping and decoding only the scan region, not the whole camera frame.
    const canvas = document.createElement('canvas')
    // Get a 2D drawing context for the canvas so we can copy the selected area from the video.
    const context = canvas.getContext('2d', { willReadFrequently: true })
    // Calculate the interval between scans based on the requested FPS.
    const delay = 1000 / (Number.isFinite(fps) && fps > 0 ? fps : 10)
    // Configure the fallback ZXing reader and assign the decode function that reads from a canvas.
    const startZxing = () => {
      const reader = new ZXingDecoder(formats)
      decoder = reader
      decode = async (frame) => reader.decodeFromCanvas(frame)
      console.log('[Scanner] Using ZXing decoder')
      return reader
    }
    // Capture each video frame, crop to the active QR box, and attempt to decode it.
    const tick = async () => {
      // Stop processing as soon as the component is unmounted or replaced.
      if (disposed) return
      try {
        // Only attempt parsing when the canvas context and decoder are ready and video dimensions exist.
        if (context && decode && video.videoWidth && video.videoHeight) {
          // Read the visible video rectangle in the DOM so we can map the QR box onto the actual camera frame.
          const videoView = video.getBoundingClientRect()
          // Ignore empty frames while the camera is still initializing.
          if (videoView.width === 0 || videoView.height === 0) return
          // Get the visible bounds of the scan box, or fall back to the full video area if no custom box exists.
          const target = qrboxRef.current?.getBoundingClientRect() ?? videoView
          // Calculate the scale needed to fit the video frame into the visible viewport while preserving the source aspect ratio.
          const scale = Math.max(videoView.width / video.videoWidth, videoView.height / video.videoHeight)
          // Offset the camera frame so we can crop from the center when the video is letterboxed.
          const croppedX = (video.videoWidth * scale - videoView.width) / 2
          const croppedY = (video.videoHeight * scale - videoView.height) / 2
          // Map the crop area from the DOM coordinates to the actual source video coordinates.
          const sourceX = Math.max(0, (target.left - videoView.left + croppedX) / scale)
          const sourceY = Math.max(0, (target.top - videoView.top + croppedY) / scale)
          // Clamp crop width and height so they never exceed the real video dimensions.
          const sourceWidth = Math.min(target.width / scale, video.videoWidth - sourceX)
          const sourceHeight = Math.min(target.height / scale, video.videoHeight - sourceY)
          // Skip decoding when the computed crop would be empty.
          if (sourceWidth <= 0 || sourceHeight <= 0) return
          // Set the offscreen canvas to the crop size before drawing the selected area into it.
          canvas.width = Math.max(1, Math.round(sourceWidth))
          canvas.height = Math.max(1, Math.round(sourceHeight))
          // Copy only the selected scan region from the live video into the canvas so ZXing scans a small, relevant area.
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
          // Keep the last decode result in a scoped variable for the current frame.
          let result: ScanResult | null
          try {
            result = await decode(canvas)
          } catch (error) {
            // If the browser-native detector was installed but failed unexpectedly, fall back to ZXing.
            if (!decoder) {
              if (disposed) return
              result = startZxing().decodeFromCanvas(canvas)
            } else {
              throw error
            }
          }
          // Notify the parent when a valid barcode was found.
          if (!disposed && result) callbacksRef.current.onScan?.(result)
        }
      } catch (error) {
        // Surface scanner failures to the parent only if the component is still active.
        if (!disposed) callbacksRef.current.onError?.(error instanceof Error ? error : new Error(String(error)))
      } finally {
        // Schedule the next scan loop iteration unless the component was disposed.
        if (!disposed) timer = window.setTimeout(tick, delay)
      }
    }

    // Start the camera and initialize the decoder that will analyze each frame.
    const start = async () => {
      try {
        if (!context) throw new Error('Canvas 2D is unavailable')
        if (formats.length === 0)
          throw new Error('At least one barcode format is required')
        if (!navigator.mediaDevices?.getUserMedia)
          throw new Error('Camera access requires a supported browser and a secure context')
        // Request permission to access the camera and use the chosen facing mode or device ID.
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            ...(deviceId ? { deviceId: { exact: deviceId } } : { facingMode }),
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        })
        // If the component was torn down before the camera opened, stop the stream immediately.
        if (disposed) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }
        video.srcObject = stream
        await video.play()
        if (disposed) return
        // Let the parent know the camera is ready to scan.
        callbacksRef.current.onCameraReady?.()
        // Prefer the browser's native BarcodeDetector API when it exists and supports all requested formats.
        const NativeDetector = (window as Window & { BarcodeDetector?: NativeBarcodeDetectorConstructor }).BarcodeDetector
        if (typeof NativeDetector === 'function') {
          try {
            const supported = new Set(await NativeDetector.getSupportedFormats())
            // Keep only the formats the browser can actually decode.
            const nativeFormats = formats.filter((format) => supported.has(format))
            // Use native detection only when every requested format is supported.
            if (nativeFormats.length === formats.length) {
              const detector = new NativeDetector({ formats: nativeFormats })
              decode = async (frame) => {
                const [result] = await detector.detect(frame)
                return result ? { content: result.rawValue, format: result.format } : null
              }
            }
          } catch {
            // Continue with the installed ZXing decoder.
          }
        }
        if (disposed) return
        if (decode) {
          console.log('[Scanner] Using native BarcodeDetector API')
        } else {
          startZxing()
        }
        // Begin the repeated scan loop as soon as the decoder is ready.
        void tick()
      } catch (error) {
        stream?.getTracks().forEach((track) => track.stop())
        video.srcObject = null
        if (!disposed) callbacksRef.current.onError?.(error instanceof Error ? error : new Error(String(error)))
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
  }, [deviceId, facingMode, formats, fps, boxWidth, boxHeight])

  return (
    <div className={cn('relative h-full w-full overflow-hidden', className)}>
      <video
        ref={videoRef}
        playsInline
        muted
        className='block h-full w-full object-cover'
      />
      {qrbox && (
        <div
          aria-hidden='true'
          className='pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden'
        >
          <div
            ref={qrboxRef}
            className='relative'
            style={{
              width: Math.max(1, boxWidth ?? 1),
              height: Math.max(1, boxHeight ?? 1),
              maxWidth: '100%',
              maxHeight: '100%',
              boxShadow: '0 0 0 100vmax rgb(0 0 0 / 55%)',
            }}
          >
            {/* Draw a small white corner marker on each side of the scan box to mimic a target frame. */}
            <span className='absolute -left-[3px] -top-[3px] h-8 w-8 border-l-4 border-t-4 border-white' />
            <span className='absolute -right-[3px] -top-[3px] h-8 w-8 border-r-4 border-t-4 border-white' />
            <span className='absolute -bottom-[3px] -left-[3px] h-8 w-8 border-b-4 border-l-4 border-white' />
            <span className='absolute -bottom-[3px] -right-[3px] h-8 w-8 border-b-4 border-r-4 border-white' />
          </div>
        </div>
      )}
    </div>
  )
})