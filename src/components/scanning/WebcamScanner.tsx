import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { useToast } from '@/hooks/use-toast';
import BorderDetectionToggle from './BorderDetectionToggle';
import ScannerControls from './ScannerControls';
import CameraSelect from './CameraSelect';
import DocumentPreview from './DocumentPreview';
import { supabase } from '@/integrations/supabase/client';
import cv from 'opencv.js';

interface WebcamScannerProps {
  onCapture: (data: string) => void;
}

interface Corner {
  x: number;
  y: number;
}

const WebcamScanner = ({ onCapture }: WebcamScannerProps) => {
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isSmartDetectionEnabled, setIsSmartDetectionEnabled] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [corners, setCorners] = useState<Corner[]>([]);
  const [isAdjustingCorners, setIsAdjustingCorners] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const { toast } = useToast();

  const detectEdges = async (imageSrc: string) => {
    const img = new Image();
    img.src = imageSrc;
    await img.decode();

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx?.drawImage(img, 0, 0);

    const src = cv.imread(canvas);
    const gray = new cv.Mat();
    const edges = new cv.Mat();

    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
    cv.GaussianBlur(gray, gray, new cv.Size(5, 5), 0);
    cv.Canny(gray, edges, 50, 150);

    const contours = new cv.MatVector();
    const hierarchy = new cv.Mat();
    cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

    let largestContour = null;
    let maxArea = 0;

    for (let i = 0; i < contours.size(); i++) {
      const area = cv.contourArea(contours.get(i));
      if (area > maxArea) {
        maxArea = area;
        largestContour = contours.get(i);
      }
    }

    if (largestContour) {
      const approx = new cv.Mat();
      cv.approxPolyDP(largestContour, approx, 0.02 * cv.arcLength(largestContour, true), true);

      if (approx.rows === 4) {
        const detectedCorners = [];
        for (let i = 0; i < approx.rows; i++) {
          const point = approx.data32S.slice(i * 2, i * 2 + 2);
          detectedCorners.push({ x: (point[0] / src.cols) * 100, y: (point[1] / src.rows) * 100 });
        }
        setCorners(detectedCorners);
      }

      approx.delete();
    }

    src.delete();
    gray.delete();
    edges.delete();
    contours.delete();
    hierarchy.delete();
  };

  const enhanceImage = (imageSrc: string): string => {
    const img = new Image();
    img.src = imageSrc;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;

    ctx?.drawImage(img, 0, 0);
    const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);

    if (imageData && ctx) {
      for (let i = 0; i < imageData.data.length; i += 4) {
        imageData.data[i] = Math.min(imageData.data[i] * 1.2 + 30, 255);
        imageData.data[i + 1] = Math.min(imageData.data[i + 1] * 1.2 + 30, 255);
        imageData.data[i + 2] = Math.min(imageData.data[i + 2] * 1.2 + 30, 255);
      }
      ctx.putImageData(imageData, 0, 0);
    }

    return canvas.toDataURL();
  };

  const capture = async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setIsProcessing(true);
      setCapturedImage(imageSrc);

      if (isSmartDetectionEnabled) {
        await detectEdges(imageSrc);
        toast({
          title: "Border Detection Complete",
          description: "You can now adjust the corners manually if needed.",
        });
      }

      const enhancedImage = enhanceImage(imageSrc);
      setCapturedImage(enhancedImage);
      setIsProcessing(false);
    }
  };

  const retake = () => {
    setCapturedImage(null);
    setCorners([]);
    setIsAdjustingCorners(false);
  };

  const handleCornerDrag = (index: number, e: React.MouseEvent) => {
    if (!isAdjustingCorners) return;

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newCorners = [...corners];
    newCorners[index] = { x, y };
    setCorners(newCorners);
  };

  const handleCameraChange = (value: string) => {
    setFacingMode(value as "user" | "environment");
    if (capturedImage) {
      retake();
    }
  };

  const saveDocument = async () => {
    if (!capturedImage) return;

    try {
      setIsProcessing(true);

      const base64Data = capturedImage.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });
      const filename = `scan_${Date.now()}.jpg`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filename, blob);

      if (uploadError) throw uploadError;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error: dbError } = await supabase
        .from('documents')
        .insert({
          name: filename,
          file_path: filename,
          content_type: 'image/jpeg',
          size: blob.size,
          user_id: user.id,
        });

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Document saved successfully",
      });

      retake();
    } catch (error) {
      console.error('Error saving document:', error);
      toast({
        title: "Error",
        description: "Failed to save document",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-2xl mb-4 flex justify-between items-center">
        <BorderDetectionToggle
          enabled={isSmartDetectionEnabled}
          onToggle={setIsSmartDetectionEnabled}
        />
        <CameraSelect value={facingMode} onChange={handleCameraChange} />
      </div>

      <div className="relative w-full max-w-2xl aspect-video mb-4">
        <DocumentPreview
          webcamRef={webcamRef}
          capturedImage={capturedImage}
          corners={corners}
          isAdjustingCorners={isAdjustingCorners}
          isProcessing={isProcessing}
          facingMode={facingMode}
          onCornerDrag={handleCornerDrag}
        />
      </div>

      <ScannerControls
        hasImage={!!capturedImage}
        isProcessing={isProcessing}
        hasCorners={corners.length === 4}
        isAdjustingCorners={isAdjustingCorners}
        onCapture={capture}
        onRetake={retake}
        onToggleCornerAdjustment={() => setIsAdjustingCorners(!isAdjustingCorners)}
        onSave={saveDocument}
      />
    </div>
  );
};

export default WebcamScanner;
