
import { QRUpload } from "@/components/qr/QRUpload";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { QrCode, Camera } from "lucide-react";

const Upload = () => {
  return (
    <div className="min-h-screen p-4 space-y-8">
      <ThemeToggle />
      
      <div className="max-w-md mx-auto space-y-8 pt-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Upload QR Code</h1>
          <p className="text-muted-foreground">Upload and decode UPI QR codes</p>
        </div>

        <div className="flex gap-2 justify-center">
          <Button variant="outline" className="glass" asChild>
            <Link to="/generate">
              <QrCode className="mr-2 h-4 w-4" />
              Generate QR
            </Link>
          </Button>
          <Button variant="outline" className="glass" asChild>
            <Link to="/scan">
              <Camera className="mr-2 h-4 w-4" />
              Scan QR
            </Link>
          </Button>
        </div>

        <QRUpload />
      </div>
    </div>
  );
};

export default Upload;
