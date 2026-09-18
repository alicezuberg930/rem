// Minimal typing for the scanner wrapper

export interface ScanResult {
  content: string;
  // format may be vendor specific (BarcodeDetector returns format string)
  format?: string;
}

export interface ScannerProps {
  onScan?: (result: ScanResult) => void;
  onError?: (err: Error) => void;
  fps?: number; // frames per second to scan (when using BarcodeDetector path)
  facingMode?: "user" | "environment" | "left" | "right";
  deviceId?: string | undefined; // optional exact deviceId to use instead of facingMode
  formats?: string[]; // list of format strings to request
  className?: string;
  qrbox?: number | { width: number; height: number } | undefined;
}
