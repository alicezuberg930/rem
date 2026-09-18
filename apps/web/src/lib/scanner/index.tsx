import React, { useEffect, useRef } from "react";
import type { ScannerProps } from "./types";


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

// Import jsQR for QR-code fallback decoder
import jsQR from "jsqr";
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
        // @ts-ignore
        const detector = new (window as any).BarcodeDetector({ formats });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const interval = 1000 / fps;

        const tick = async () => {
          if (!mounted || !runningRef.current) return;
          try {
            if (video.videoWidth === 0 || video.videoHeight === 0) {
              rafRef.current = window.setTimeout(tick, interval) as any;
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
            rafRef.current = window.setTimeout(tick, interval) as any;
          }
        };

        runningRef.current = true;
        tick();
      } catch (err) {
        onError?.(err as Error);
        // fall through to jsQR fallback handled by start()
      }
    };

    const startWithJsQr = async (video: HTMLVideoElement) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const interval = 1000 / fps;

      const decoder = new ZXingDecoder();

      const tick = async () => {
        if (!mounted || !runningRef.current) return;
        try {
          if (video.videoWidth === 0 || video.videoHeight === 0) {
            intervalRef.current = window.setTimeout(tick, interval) as any;
            return;
          }
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          if (!ctx) return;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          // First try ZXing for 1D + 2D support
          try {
            const zres = await decoder.decodeFromCanvas(canvas);
            if (zres && zres.text) {
              onScan?.({ content: zres.text, format: zres.format ?? undefined });
              intervalRef.current = window.setTimeout(tick, interval) as any;
              return;
            }
          } catch (e) {
            // ignore ZXing errors and fall through to jsQR
          }

          // Fallback to jsQR for QR decoding (if ZXing didn't find it)
          try {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const result = jsQR(imageData.data, canvas.width, canvas.height, { inversionAttempts: "attemptBoth" });
            if (result) {
              onScan?.({ content: result.data, format: "qr_code" });
            }
          } catch (err) {
            // jsQR errors
            onError?.(err as Error);
          }
        } catch (err) {
          onError?.(err as Error);
        } finally {
          intervalRef.current = window.setTimeout(tick, interval) as any;
        }
      };

      runningRef.current = true;
      tick();

      return () => {
        try {
          decoder.reset();
        } catch (_e) {}
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

        const hasBarcodeDetector = typeof (window as any).BarcodeDetector === "function";
        if (hasBarcodeDetector) {
          await startWithBarcodeDetector(video);
          return;
        }

        // fallback to jsQR (qr-code only)
        await startWithJsQr(video);
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
};

export default Scanner;

