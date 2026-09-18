import React, { useEffect, useRef } from "react";
import type { ScannerProps } from "./types";

interface BarcodeDetectorResult {
  rawValue: string;
  format: string;
}

interface BarcodeDetector {
  detect(bitmap: ImageBitmap): Promise<BarcodeDetectorResult[]>;
}

interface BarcodeDetectorConstructor {
  new (options?: { formats?: string[] }): BarcodeDetector;
}

declare global {
  interface Window {
    BarcodeDetector?: BarcodeDetectorConstructor;
  }
}

const defaultFormats = [
  // Common barcode formats; BarcodeDetector will filter unsupported ones
  "qr_code",
  "ean_13",
  "ean_8",
  "code_128",
  "code_39",
  "upc_a",
  "upc_e",
];

import { ZXingDecoder } from "./zxing-decoder";

export const Scanner: React.FC<ScannerProps> = ({
  onScan,
  onError,
  fps = 10,
  facingMode = "environment",
  formats = defaultFormats,
  className,
  qrbox,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const runningRef = useRef(false);

  useEffect(() => {
    let mounted = true;

    const startWithBarcodeDetector = async (video: HTMLVideoElement) => {
      try {
        const BarcodeDetectorCtor = window.BarcodeDetector;
        if (!BarcodeDetectorCtor) {
          throw new Error("BarcodeDetector is not supported in this browser");
        }

        const detector = new BarcodeDetectorCtor({ formats });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const interval = 1000 / fps;

        const tick = async () => {
          if (!mounted || !runningRef.current) return;
          try {
            if (video.videoWidth === 0 || video.videoHeight === 0) {
              rafRef.current = window.setTimeout(tick, interval)
              return;
            }
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            if (ctx) ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const bitmap = await createImageBitmap(canvas);
            const results = await detector.detect(bitmap);
            bitmap.close();
            if (results && results.length > 0) {
              const r = results[0];
              onScan?.({ content: r.rawValue, format: r.format });
            }
          } catch (err) {
            onError?.(err as Error);
          } finally {
            rafRef.current = window.setTimeout(tick, interval);
          }
        };

        runningRef.current = true;
        tick();
      } catch (err) {
        onError?.(err as Error);
        // fall through to ZXing fallback handled by start()
      }
    };

    const startWithZxing = async (video: HTMLVideoElement) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const interval = 1000 / fps;

      const decoder = new ZXingDecoder();

      const tick = async () => {
        if (!mounted || !runningRef.current) return;
        try {
          if (video.videoWidth === 0 || video.videoHeight === 0) {
            intervalRef.current = window.setTimeout(tick, interval);
            return;
          }
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          if (!ctx) return;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          const zres = await decoder.decodeFromCanvas(canvas);
          if (zres && zres.text) {
            onScan?.({ content: zres.text, format: zres.format });
            intervalRef.current = window.setTimeout(tick, interval);
            return;
          }
        } catch (err) {
          onError?.(err as Error);
        } finally {
          intervalRef.current = window.setTimeout(tick, interval);
        }
      };

      runningRef.current = true;
      tick();

      return () => {
        try {
          decoder.reset();
        } catch (_e) {
          // ignore
        }
      };
    };

    const start = async () => {
      if (!containerRef.current) return;

      const video = document.createElement("video");
      video.setAttribute("playsInline", "true");
      video.style.width = "100%";
      video.style.height = "100%";
      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(video);

      const constraints: MediaStreamConstraints = {
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      };

      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;
        video.srcObject = stream;
        await video.play();

        const hasBarcodeDetector = typeof window.BarcodeDetector === "function";
        if (hasBarcodeDetector) {
          await startWithBarcodeDetector(video);
          return;
        }

        // fallback to ZXing for QR and 1D barcode decoding
        await startWithZxing(video);
      } catch (err) {
        onError?.(err as Error);
      }
    };

    start();

    return () => {
      mounted = false;
      runningRef.current = false;
      if (rafRef.current) {
        clearTimeout(rafRef.current);
        rafRef.current = null;
      }
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
        intervalRef.current = null;
      }

      // stop tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }

      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [fps, facingMode, formats, qrbox, onScan, onError]);

  return <div ref={containerRef} className={className} />;
}