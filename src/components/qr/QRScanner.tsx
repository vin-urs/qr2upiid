import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useQRCode } from "@/hooks/useQRCode";
import { useToast } from "@/hooks/use-toast";
import { Camera, CameraOff, Copy } from "lucide-react";
import { Input } from "@/components/ui/input";

export function QRScanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanning, setScanning] = useState(false);
  const [scannedUPI, setScannedUPI] = useState<string | null>(null);
  const { decodeQRCode } = useQRCode();
  const { toast } = useToast();

  const extractUPIId = (text: string) => {
    try {
      const url = new URL(text);
      const pa = url.searchParams.get('pa');
      return pa || text;
    } catch {
      return text;
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "UPI ID copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    let stream: MediaStream | null = null;
    let animationFrame: number;

    const startScanning = async () => {
      try {
        // Try to access the rear camera (environment) first
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });

        // If the rear camera fails, try the default camera
        if (!stream) {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          scan();
        }
      } catch (error) {
        console.error("Camera access error:", error);
        toast({
          title: "Error",
          description: "Failed to access camera. Please ensure you have granted camera permissions.",
          variant: "destructive",
        });
        setScanning(false);
      }
    };

    const scan = () => {
      if (!videoRef.current || !canvasRef.current || !scanning) return;

      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext("2d");
      if (!context) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

      decodeQRCode(imageData)
        .then(({ text, isUPI }) => {
          if (isUPI) {
            setScanning(false);
            const upiId = extractUPIId(text);
            setScannedUPI(upiId);
          }
        })
        .catch(() => {
          // Continue scanning
        });

      animationFrame = requestAnimationFrame(scan);
    };

    if (scanning) {
      startScanning();
    } else {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [scanning, decodeQRCode, toast]);

  return (
    <div className="space-y-4 w-full max-w-md mx-auto animate-fade-in">
      {scannedUPI ? (
        <div className="space-y-4">
          <div className="relative">
            <Input value={scannedUPI} readOnly className="pr-12 glass" />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-1 top-1 h-8 w-8"
              onClick={() => copyToClipboard(scannedUPI)}
              aria-label="Copy UPI ID"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <Button
            onClick={() => {
              setScannedUPI(null);
              setScanning(true);
            }}
            className="w-full"
          >
            Scan Another
          </Button>
        </div>
      ) : (
        <Button
          onClick={() => setScanning(!scanning)}
          className="w-full"
          aria-label={scanning ? "Stop Scanning" : "Start Scanning"}
        >
          {scanning ? (
            <>
              <CameraOff className="mr-2 h-4 w-4" />
              Stop Scanning
            </>
          ) : (
            <>
              <Camera className="mr-2 h-4 w-4" />
              Start Scanning
            </>
          )}
        </Button>
      )}

      {scanning && (
        <div className="relative aspect-video rounded-lg overflow-hidden glass">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            aria-label="Camera feed for QR code scanning"
          />
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </div>
  );
}