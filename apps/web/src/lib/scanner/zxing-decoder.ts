// Lightweight ZXing-based 1D barcode decoder wrapper using @zxing/library
import { BrowserBarcodeReader, BarcodeFormat, DecodeHintType } from '@zxing/library';

export interface ZXingDecodeResult {
  text: string;
  format?: string;
}

export class ZXingDecoder {
  private reader: BrowserBarcodeReader;

  constructor(timeBetweenScansMillis = 100) {
    this.reader = new BrowserBarcodeReader(undefined, timeBetweenScansMillis);
  }

  async decodeFromCanvas(canvas: HTMLCanvasElement): Promise<ZXingDecodeResult | null> {
    try {
      const luminanceSource = canvas; // BrowserBarcodeReader can read from canvas via DOM
      const result = await this.reader.decodeFromCanvasElement(canvas as any);
      if (result) {
        return { text: result.getText(), format: result.getBarcodeFormat() } as ZXingDecodeResult;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  reset() {
    try {
      this.reader.reset();
    } catch (e) {
      // ignore
    }
  }
}
