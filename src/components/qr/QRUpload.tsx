import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useQRCode } from "@/hooks/useQRCode";
import { useToast } from "@/hooks/use-toast";
import { Upload, Copy } from "lucide-react";
import { Input } from "@/components/ui/input";

export function QRUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { decodeQRCode } = useQRCode();
  const { toast } = useToast();
  const [scannedUPI, setScannedUPI] = useState<string | null>(null);

  const extractUPIId = (text: string) => {
    try {
      const url = new URL(text);
      const pa = url.searchParams.get("pa");
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
    } catch {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      decodeQRCode(imageData)
        .then(({ text, isUPI }) => {
          if (isUPI) {
            const upiId = extractUPIId(text);
            setScannedUPI(upiId);
          } else {
            toast({
              title: "QR Code Detected",
              description: text,
            });
          }
        })
        .catch(() => {
          toast({
            title: "Error",
            description: "No QR code found in image",
            variant: "destructive",
          });
        });

      URL.revokeObjectURL(img.src);
    };

    img.onerror = () => {
      toast({
        title: "Error",
        description: "Failed to load image",
        variant: "destructive",
      });
      URL.revokeObjectURL(img.src);
    };
  };

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
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
          <Button onClick={() => setScannedUPI(null)} className="w-full">
            Upload Another
          </Button>
        </div>
      ) : (
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          className="w-full glass"
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload QR Code
        </Button>
      )}
    </div>
  );
}
