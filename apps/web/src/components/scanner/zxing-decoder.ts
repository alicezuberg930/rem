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
}

const scannerFormats = new Map<BarcodeFormat, ScannerFormat>()
for (const format of Object.keys(zxingFormats) as ScannerFormat[]) {
  scannerFormats.set(zxingFormats[format], format)
}

export class ZXingDecoder {
  private readonly reader: BrowserMultiFormatReader

  constructor(formats: readonly ScannerFormat[]) {
    const hints = new Map<DecodeHintType, BarcodeFormat[]>()
    hints.set(
      DecodeHintType.POSSIBLE_FORMATS,
      formats.map((format) => zxingFormats[format])
    )
    this.reader = new BrowserMultiFormatReader(hints)
  }

  decodeFromCanvas(canvas: HTMLCanvasElement): ScanResult | null {
    const source = new HTMLCanvasElementLuminanceSource(canvas)
    const bitmap = new BinaryBitmap(new HybridBinarizer(source))

    try {
      const result = this.reader.decodeBitmap(bitmap)
      const format = scannerFormats.get(result.getBarcodeFormat())
      if (!format) throw new Error('ZXing returned an unexpected barcode format')
      return {
        content: result.getText(),
        format,
      }
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ChecksumException || error instanceof FormatException) {
        return null
      }
      throw error
    }
  }

  reset(): void {
    this.reader.reset()
  }
}
