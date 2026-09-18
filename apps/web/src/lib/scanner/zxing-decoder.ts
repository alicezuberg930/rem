// Lightweight ZXing-based 1D barcode decoder wrapper using @zxing/library
import { BrowserBarcodeReader } from '@zxing/library';

export interface ZXingDecodeResult {
  text: string;
  format?: string;
}

export class ZXingDecoder {
  private reader: BrowserBarcodeReader;

  constructor(timeBetweenScansMillis = 100) {
    this.reader = new BrowserBarcodeReader(timeBetweenScansMillis);
  }

  async decodeFromCanvas(canvas: HTMLCanvasElement): Promise<ZXingDecodeResult | null> {
    try {
      // Convert canvas to data URL and decode via image element helper
      const dataUrl = canvas.toDataURL('image/png');
      const img = new Image();
      const loaded = new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load canvas image'));
      });
      img.src = dataUrl;
      await loaded;

      const result = await this.reader.decodeFromImageElement(img as any);
      if (result) {
        // result.getBarcodeFormat() may be an enum value; stringify it
        const format = typeof result.getBarcodeFormat === 'function'
          ? String((result as any).getBarcodeFormat())
          : undefined;
        return { text: result.getText(), format } as ZXingDecodeResult;
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
