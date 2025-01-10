import React from 'react';
import Webcam from 'react-webcam';
import BorderOverlay from './BorderOverlay';
import ProcessingOverlay from './ProcessingOverlay';

interface DocumentPreviewProps {
  webcamRef: React.RefObject<Webcam>;
  capturedImage: string | null;
  corners: Array<{ x: number; y: number }>;
  isAdjustingCorners: boolean;
  isProcessing: boolean;
  facingMode: "user" | "environment";
  onCornerDrag: (index: number, e: React.MouseEvent) => void;
}

const DocumentPreview = ({
  webcamRef,
  capturedImage,
  corners,
  isAdjustingCorners,
  isProcessing,
  facingMode,
  onCornerDrag,
}: DocumentPreviewProps) => {
  return (
    <div className="relative w-full h-full">
      {capturedImage ? (
        <>
          {/* Display captured image */}
          <img
            src={capturedImage}
            alt="Captured"
            className="w-full h-full object-contain rounded-lg"
          />
          {/* Overlay the border for edge detection */}
          <BorderOverlay
            corners={corners}
            isAdjusting={isAdjustingCorners}
            onCornerDrag={onCornerDrag}
          />
        </>
      ) : (
        <>
          {/* Display live webcam feed if no captured image */}
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full h-full rounded-lg"
            videoConstraints={{
              facingMode,
            }}
          />
        </>
      )}
      {/* Show processing overlay when processing */}
      <ProcessingOverlay isVisible={isProcessing} />
    </div>
  );
};

export default DocumentPreview;
