import {
  BarcodeFormat,
  BinaryBitmap,
  BrowserMultiFormatReader,
  ChecksumException,
  DecodeHintType,
  FormatException,
  HTMLCanvasElementLuminanceSource,
  HybridBinarizer,
  NotFoundException,
} from '@zxing/library'
import type { ScanResult, ScannerFormat } from './types'

// Map each app-specific format name to the corresponding ZXing enum value.
// This keeps the scanner API readable while still using the library's internal barcode identifiers.
const zxingFormats: Record<ScannerFormat, BarcodeFormat> = {
  aztec: BarcodeFormat.AZTEC,
  codabar: BarcodeFormat.CODABAR,
  code_39: BarcodeFormat.CODE_39,
  code_93: BarcodeFormat.CODE_93,
  code_128: BarcodeFormat.CODE_128,
  data_matrix: BarcodeFormat.DATA_MATRIX,
  ean_8: BarcodeFormat.EAN_8,
  ean_13: BarcodeFormat.EAN_13,
  itf: BarcodeFormat.ITF,
  pdf417: BarcodeFormat.PDF_417,
  qr_code: BarcodeFormat.QR_CODE,
  upc_a: BarcodeFormat.UPC_A,
  upc_e: BarcodeFormat.UPC_E,
  // maxicode: BarcodeFormat.MAXICODE,
  // rss_14: BarcodeFormat.RSS_14,
  // rss_expanded: BarcodeFormat.RSS_EXPANDED,
  // micro_qr_code: BarcodeFormat.MICRO_QR_CODE,
  // upc_ean_extension: BarcodeFormat.UPC_EAN_EXTENSION,
}

// Build a reverse lookup so ZXing can tell us which app format name corresponds to the detected barcode.
const scannerFormats = new Map<BarcodeFormat, ScannerFormat>()
for (const format of Object.keys(zxingFormats) as ScannerFormat[]) {
  scannerFormats.set(zxingFormats[format], format)
}

// Wrap ZXing in a small class that exposes the minimal API required by the scanner component.
export class ZXingDecoder {
  // Store the configured reader instance so it can decode multiple frames without recreating itself.
  public readonly reader: BrowserMultiFormatReader
  private decodeHints = new Map<DecodeHintType, BarcodeFormat[]>()

  // Create a reader that only tries the barcode types the app is configured to accept.
  constructor(formats?: readonly ScannerFormat[]) {
    if (!formats) formats = Array.from(scannerFormats.values())
    // ZXing accepts optional decode hints, and POSSIBLE_FORMATS tells it which barcode families to test.
    this.decodeHints.set(
      DecodeHintType.POSSIBLE_FORMATS,
      formats.map((format) => zxingFormats[format])
    )
    // Initialize the actual browser-based reader with the supported barcode list.
    this.reader = new BrowserMultiFormatReader(this.decodeHints)
  }

  // Decode a barcode from an HTML canvas and return a normalised app result object.
  decodeFromCanvas(canvas: HTMLCanvasElement): ScanResult | null {
    // Convert the canvas pixels into the luminance source ZXing expects for decoding.
    const source = new HTMLCanvasElementLuminanceSource(canvas)
    // Turn that source into a binary bitmap using a hybrid binarizer to separate dark and light pixels.
    const bitmap = new BinaryBitmap(new HybridBinarizer(source))
    try {
      const result = this.reader.decodeBitmap(bitmap)
      // Convert the library's enum back into the app's supported format names.
      const format = scannerFormats.get(result.getBarcodeFormat())
      // Guard against unexpected or unsupported barcode types.
      if (!format) throw new Error('ZXing returned an unexpected barcode format')
      return {
        content: result.getText(),
        format,
      }
    } catch (error) {
      // If no barcode is detected or the data is unreadable, treat it as a normal scan miss instead of an app error.
      if (error instanceof NotFoundException || error instanceof ChecksumException || error instanceof FormatException) {
        return null
      }
      throw error
    }
  }

  // Reset the reader state between runs to avoid stale decoder state.
  reset(): void {
    this.reader.reset()
  }
}
