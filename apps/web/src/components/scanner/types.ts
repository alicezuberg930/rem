export type ScannerFormat =
  | 'aztec'
  | 'codabar'
  | 'code_39'
  | 'code_93'
  | 'code_128'
  | 'data_matrix'
  | 'ean_8'
  | 'ean_13'
  | 'itf'
  | 'pdf417'
  | 'qr_code'
  | 'upc_a'
  | 'upc_e'
  // | 'micro_qr_code'
  // | 'upc_ean_extension'
  // | 'rss_expanded'
  // | 'rss_14'
  // | 'maxicode'

export interface ScanResult {
  content: string
  format: ScannerFormat | 'unknown'
}

export interface ScannerProps {
  onScan?: (result: ScanResult) => void
  onError?: (error: Error) => void
  onCameraReady?: () => void
  fps?: number
  facingMode?: 'user' | 'environment' | 'left' | 'right'
  deviceId?: string
  formats?: readonly ScannerFormat[]
  className?: string
  qrbox?: number | { width: number; height: number }
}

// Barcode Detection is experimental and is not included in TypeScript's DOM lib.
// Keep the optional browser surface local instead of declaring it on every Window.
export interface NativeBarcodeDetector {
  detect(image: ImageBitmapSource): Promise<
    readonly {
      rawValue: string
      format: ScannerFormat | 'unknown'
    }[]
  >
}

export interface NativeBarcodeDetectorConstructor {
  new(options?: { formats?: ScannerFormat[] }): NativeBarcodeDetector
  getSupportedFormats(): Promise<string[]>
}
