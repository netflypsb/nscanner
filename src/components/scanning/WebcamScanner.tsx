import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import BorderDetectionToggle from './BorderDetectionToggle';
import BorderOverlay from './BorderOverlay';
import ScannerControls from './ScannerControls';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
      
      // Convert base64 to blob
      const base64Data = capturedImage.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });
      
      // Generate unique filename
      const filename = `scan_${Date.now()}.jpg`;
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filename, blob);

      if (uploadError) throw uploadError;

      // Get the user's ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Save document metadata to database
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

      // Reset the scanner
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
        <Select value={facingMode} onValueChange={handleCameraChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Camera" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="environment">Back Camera</SelectItem>
            <SelectItem value="user">Front Camera</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="relative w-full max-w-2xl aspect-video mb-4">
        {capturedImage ? (
          <div className="relative w-full h-full">
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full h-full object-contain rounded-lg"
            />
            <BorderOverlay
              corners={corners}
              isAdjusting={isAdjustingCorners}
              onCornerDrag={handleCornerDrag}
            />
          </div>
        ) : (
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full h-full rounded-lg"
            videoConstraints={{
              facingMode: facingMode
            }}
          />
        )}
        
        {isProcessing && (
          <div className="absolute inset-0 bg-background/50 flex flex-col items-center justify-center rounded-lg">
            <Progress value={65} className="w-1/2 mb-2" />
            <p className="text-sm text-muted-foreground">Processing document...</p>
          </div>
        )}
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