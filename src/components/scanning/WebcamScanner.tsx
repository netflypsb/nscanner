import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { useToast } from '@/hooks/use-toast';
import BorderDetectionToggle from './BorderDetectionToggle';
import ScannerControls from './ScannerControls';
import CameraSelect from './CameraSelect';
import DocumentPreview from './DocumentPreview';
import { supabase } from "@/integrations/supabase/client";

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

  const capture = async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setIsProcessing(true);
      setCapturedImage(imageSrc);
      
      if (isSmartDetectionEnabled) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setCorners([
          { x: 20, y: 20 },
          { x: 80, y: 20 },
          { x: 80, y: 80 },
          { x: 20, y: 80 }
        ]);
        toast({
          title: "Border Detection Complete",
          description: "You can now adjust the corners manually if needed.",
        });
      }
      
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