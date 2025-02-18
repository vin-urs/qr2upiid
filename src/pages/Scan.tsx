
import { QRScanner } from "@/components/qr/QRScanner";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { QrCode, Upload } from "lucide-react";

const Scan = () => {
  return (
    <div className="min-h-screen p-4 space-y-8">
      <ThemeToggle />
      
      <div className="max-w-md mx-auto space-y-8 pt-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Scan QR Code</h1>
          <p className="text-muted-foreground">Scan UPI QR codes with your camera</p>
        </div>

        <div className="flex gap-2 justify-center">
          <Button variant="outline" className="glass" asChild>
            <Link to="/">
              <QrCode className="mr-2 h-4 w-4" />
              Generate QR
            </Link>
          </Button>
          <Button variant="outline" className="glass" asChild>
            <Link to="/upload">
              <Upload className="mr-2 h-4 w-4" />
              Upload QR
            </Link>
          </Button>
        </div>

        <QRScanner />
      </div>
    </div>
  );
};

export default Scan;
