import React from 'react';
import { cn } from '@/lib/utils';

interface DocumentPreviewProps {
  zoom: number;
  rotation: number;
}

const DocumentPreview = ({ zoom, rotation }: DocumentPreviewProps) => {
  return (
    <div 
      className={cn(
        "w-[21cm] h-[29.7cm] bg-white shadow-lg",
        "transform transition-transform duration-200"
      )}
      style={{ 
        transform: `scale(${zoom/100}) rotate(${rotation}deg)`,
        transformOrigin: 'center center'
      }}
    >
      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
        Document Preview
      </div>
    </div>
  );
};

export default DocumentPreview;