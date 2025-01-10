import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ProcessingOverlayProps {
  isVisible: boolean;
}

const ProcessingOverlay = ({ isVisible }: ProcessingOverlayProps) => {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 bg-background/50 flex flex-col items-center justify-center rounded-lg">
      <Progress value={65} className="w-1/2 mb-2" />
      <p className="text-sm text-muted-foreground">Processing document...</p>
    </div>
  );
};

export default ProcessingOverlay;