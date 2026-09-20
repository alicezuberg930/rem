import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ClockInButton } from '@/layout/clock-in-button'
import { Header } from '@/layout/header'
import { Main } from '@/layout/main'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/components/ui/toast'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Scanner as ScannerCamera } from '@/components/scanner'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Upload } from 'lucide-react'
import { ZXingDecoder } from '@/components/scanner/zxing-decoder'
import { fileToCanvas } from '@/lib/utils'
// import bwipjs from '@bwip-js/browser'

export function CodeScanner() {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const [deviceId, setDeviceId] = useState<string | undefined>(undefined)
  const [running, setRunning] = useState(false)
  const [requestingPermission, setRequestingPermission] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const readerRef = useRef<ZXingDecoder | null>(null)

  const refreshDevices = useCallback(async () => {
    try {
      const detectedDevices = await navigator.mediaDevices.enumerateDevices()
      const videoInputs = detectedDevices.filter((device) => device.kind === 'videoinput')
      setDevices(videoInputs)
      setDeviceId((current) => current && videoInputs.some((device) => device.deviceId === current)
        ? current
        : videoInputs[0]?.deviceId || undefined
      )
    } catch {
      setDevices([])
    }
  }, [])

  const requestCameraPermission = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('Camera access requires a supported browser and a secure connection')
    }
    let permissionState: PermissionState | undefined
    try {
      permissionState = (await navigator.permissions?.query({ name: 'camera' }))?.state
    } catch {
      // Some browsers do not support querying camera permission.
    }
    if (permissionState === 'denied') {
      throw new Error('Camera access is blocked. Allow it in your browser site settings.')
    }
    if (permissionState === 'granted') return
  }, [])

  const toggleScanner = async () => {
    if (running) {
      setRunning(false)
      return
    }
    setRequestingPermission(true)
    try {
      await requestCameraPermission()
      await refreshDevices()
      setRunning(true)
    } catch (error) {
      toast.error(error instanceof DOMException && error.name === 'NotAllowedError'
        ? 'Camera access was denied. Allow it in your browser site settings.'
        : error instanceof Error
          ? error.message
          : 'Camera access failed'
      )
    } finally {
      setRequestingPermission(false)
    }
  }

  const selectedDeviceIndex = useMemo(() => devices.findIndex((device) => device.deviceId === deviceId), [devices, deviceId])

  const selectedDeviceName = useMemo(() => {
    return selectedDeviceIndex >= 0 ? devices[selectedDeviceIndex].label || `Camera ${selectedDeviceIndex + 1}` : undefined
  }, [devices, selectedDeviceIndex])

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0]
    if (!file) return
    const canvas = await fileToCanvas(file)
    console.log(readerRef.current)
    const result = readerRef.current?.decodeFromCanvas(canvas)
    toast.message("Content: " + result?.content)
    toast.message("Format: " + result?.format)
  }

  // const handleGenerateCode = async () => {
  //   try {
  //     // The return value is the canvas element
  //     const canvas = document.createElement('canvas')
  //     bwipjs.toCanvas(canvas, {
  //       bcid: 'code93',       // Barcode type
  //       text: 'ergvqe-3483fhqjc34jf-4=32=4!*(',    // Text to encode
  //       scale: 3,               // 3x scaling factor
  //       height: 10,              // Bar height, in millimeters
  //       includetext: true,            // Show human-readable text
  //       textxalign: 'center',        // Always good to set this
  //     })
  //     console.log(canvas)
  //     const blob = await canvasToBlob(canvas)
  //     const url = URL.createObjectURL(blob)
  //     const link = document.createElement('a')
  //     link.href = url
  //     link.download = 'barcode.png'
  //     document.body.append(link)
  //     link.click()
  //     link.remove()
  //     URL.revokeObjectURL(url)
  //   } catch (e) {
  //     toast.error(e instanceof Error ? e.message : '')
  //     // `e` may be a string or Error object
  //   }
  // }

  useEffect(() => {
    const mediaDevices = navigator.mediaDevices
    if (!mediaDevices?.enumerateDevices) return
    refreshDevices()
    mediaDevices.addEventListener('devicechange', refreshDevices)
    const reader = new ZXingDecoder()
    readerRef.current = reader
    return () => {
      mediaDevices.removeEventListener('devicechange', refreshDevices)
      if (readerRef.current) readerRef.current.reset()
    }
  }, [refreshDevices])

  return (
    <>
      <Header fixed>
        <Search />
        <ClockInButton />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Scanner</h2>
            <p className='text-muted-foreground'>
              Demo scanner using BarcodeDetector with JS fallbacks.
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <Select
              value={deviceId ?? null}
              onValueChange={(value) => setDeviceId(value ?? undefined)}
            >
              <SelectTrigger
                aria-label='Camera'
                className='w-48'
                disabled={devices.length === 0}
              >
                <SelectValue
                  placeholder={
                    devices.length === 0 ? 'No cameras found' : 'Select camera'
                  }
                >
                  {selectedDeviceName}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {devices.map((device) => (
                  <SelectItem key={device.deviceId} value={device.deviceId}>
                    {device.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant={running ? 'outline' : 'default'}
              disabled={requestingPermission}
              onClick={toggleScanner}
            >
              {requestingPermission ? 'Checking camera…' : running ? 'Stop' : 'Start'}
            </Button>
            <Button onClick={() => fileInputRef.current?.click()}>
              <input
                ref={fileInputRef}
                type='file'
                className='sr-only'
                onChange={handleFileChange}
              />
              <Upload />
              Scan from image
            </Button>
          </div>
        </div>

        <div className='flex gap-4'>
          <div className='h-full w-full'>
            <div className='aspect-video w-full overflow-hidden rounded-md bg-black'>
              {running ? (
                <ScannerCamera
                  deviceId={deviceId}
                  onScan={(r) =>
                    toast.message(
                      `Scanned: ${r.content} (${r.format ?? 'unknown'})`
                    )
                  }
                  onError={(e) => toast.error(e.message)}
                  onCameraReady={refreshDevices}
                  fps={10}
                  qrbox={{ width: 400, height: 250 }}
                />
              ) : (
                <div className='flex h-full w-full items-center justify-center text-white'>
                  <span>Scanner stopped</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Main>
    </>
  )
}
