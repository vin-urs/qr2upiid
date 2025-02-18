
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { useQRCode } from "@/hooks/useQRCode";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

export function QRUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { decodeQRCode } = useQRCode();
  const { toast } = useToast();

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
          toast({
            title: isUPI ? "UPI QR Code Detected" : "QR Code Detected",
            description: text,
          });
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
      <Button
        onClick={() => fileInputRef.current?.click()}
        variant="outline"
        className="w-full glass"
      >
        <Upload className="mr-2 h-4 w-4" />
        Upload QR Code
      </Button>
    </div>
  );
}
