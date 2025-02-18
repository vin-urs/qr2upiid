
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQRCode } from "@/hooks/useQRCode";
import { useToast } from "@/hooks/use-toast";
import { Download, Loader2 } from "lucide-react";

export function QRGenerator() {
  const [upiId, setUpiId] = useState("");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const { generateQRCode, loading } = useQRCode();
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!upiId) {
      toast({
        title: "Error",
        description: "Please enter a UPI ID",
        variant: "destructive",
      });
      return;
    }

    if (!upiId.includes("@")) {
      toast({
        title: "Error",
        description: "Invalid UPI ID format",
        variant: "destructive",
      });
      return;
    }

    try {
      const code = await generateQRCode(upiId);
      setQrCode(code);
      toast({
        title: "Success",
        description: "QR code generated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate QR code",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    if (!qrCode) return;
    const link = document.createElement("a");
    link.href = qrCode;
    link.download = `upi-qr-${upiId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 w-full max-w-md mx-auto animate-fade-in">
      <div className="space-y-2">
        <Input
          placeholder="Enter UPI ID (e.g., user@bank)"
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
          className="glass"
        />
        <Button
          onClick={handleGenerate}
          className="w-full"
          disabled={loading}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Generate QR Code
        </Button>
      </div>

      {qrCode && (
        <div className="space-y-4">
          <div className="glass p-4 rounded-lg">
            <img
              src={qrCode}
              alt="Generated QR Code"
              className="w-full h-auto"
            />
          </div>
          <Button
            onClick={handleDownload}
            variant="outline"
            className="w-full glass"
          >
            <Download className="mr-2 h-4 w-4" />
            Download QR Code
          </Button>
        </div>
      )}
    </div>
  );
}
