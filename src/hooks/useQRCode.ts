
import { useState, useCallback } from 'react';
import QRCode from 'qrcode';
import jsQR from 'jsqr';

interface QRCodeResult {
  text: string;
  isUPI: boolean;
}

export function useQRCode() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQRCode = useCallback(async (upiId: string): Promise<string> => {
    setLoading(true);
    setError(null);
    try {
      const upiUrl = `upi://pay?pa=${upiId}&pn=UPI%20Payment&am=0`;
      const qrCode = await QRCode.toDataURL(upiUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
      return qrCode;
    } catch (err) {
      setError('Failed to generate QR code');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const decodeQRCode = useCallback(async (imageData: ImageData): Promise<QRCodeResult> => {
    const code = jsQR(imageData.data, imageData.width, imageData.height);
    if (code) {
      const isUPI = code.data.startsWith('upi://');
      return { text: code.data, isUPI };
    }
    throw new Error('No QR code found');
  }, []);

  return {
    generateQRCode,
    decodeQRCode,
    loading,
    error,
  };
}
