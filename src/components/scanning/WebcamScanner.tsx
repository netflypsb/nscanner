import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Camera, RotateCcw, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WebcamScannerProps {
  onCapture: (data: string) => void;
}

const WebcamScanner = ({ onCapture }: WebcamScannerProps) => {
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      onCapture(imageSrc);
    }
  };

  const retake = () => {
    setCapturedImage(null);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-2xl aspect-video mb-4">
        {capturedImage ? (
          <img
            src={capturedImage}
            alt="Captured"
            className="w-full h-full object-contain rounded-lg"
          />
        ) : (
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full h-full rounded-lg"
          />
        )}
        {/* Edge Detection Overlay */}
        <div className="absolute inset-0 border-2 border-primary/50 rounded-lg pointer-events-none" />
      </div>

      <div className="flex gap-4">
        {!capturedImage ? (
          <Button onClick={capture}>
            <Camera className="mr-2" />
            Capture
          </Button>
        ) : (
          <>
            <Button variant="outline" onClick={retake}>
              <RotateCcw className="mr-2" />
              Retake
            </Button>
            <Button onClick={() => onCapture(capturedImage)}>
              <Save className="mr-2" />
              Save
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default WebcamScanner;