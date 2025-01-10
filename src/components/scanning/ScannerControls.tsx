import React from 'react';
import { Camera, RotateCcw, Save, CornerUpLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScannerControlsProps {
  hasImage: boolean;
  isProcessing: boolean;
  hasCorners: boolean;
  isAdjustingCorners: boolean;
  onCapture: () => void;
  onRetake: () => void;
  onToggleCornerAdjustment: () => void;
  onSave: () => void;
}

const ScannerControls = ({
  hasImage,
  isProcessing,
  hasCorners,
  isAdjustingCorners,
  onCapture,
  onRetake,
  onToggleCornerAdjustment,
  onSave,
}: ScannerControlsProps) => {
  return (
    <div className="flex gap-4">
      {!hasImage ? (
        // Show the Capture button if no image is captured
        <Button onClick={onCapture} disabled={isProcessing}>
          <Camera className="mr-2 h-4 w-4" />
          Capture
        </Button>
      ) : (
        <>
          {/* Retake button */}
          <Button variant="outline" onClick={onRetake} disabled={isProcessing}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Retake
          </Button>

          {/* Adjust Corners button */}
          {hasCorners && (
            <Button
              variant="outline"
              onClick={onToggleCornerAdjustment}
              disabled={isProcessing}
            >
              {isAdjustingCorners ? (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Confirm Corners
                </>
              ) : (
                <>
                  <CornerUpLeft className="mr-2 h-4 w-4" />
                  Adjust Corners
                </>
              )}
            </Button>
          )}

          {/* Save button */}
          <Button onClick={onSave} disabled={isProcessing}>
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        </>
      )}
    </div>
  );
};

export default ScannerControls;
