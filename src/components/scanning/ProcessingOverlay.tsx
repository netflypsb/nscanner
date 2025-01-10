import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ProcessingOverlayProps {
  isVisible: boolean;
  progressValue?: number; // Optional progress value (0-100)
}

const ProcessingOverlay = ({ isVisible, progressValue }: ProcessingOverlayProps) => {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 bg-background/50 flex flex-col items-center justify-center rounded-lg">
      {/* Progress bar */}
      <Progress
        value={progressValue ?? 50} // Default to 50% if no progressValue is provided
        className="w-1/2 mb-2"
      />
      {/* Processing message */}
      <p className="text-sm text-muted-foreground">
        {progressValue !== undefined
          ? `Processing... ${progressValue}% complete`
          : "Processing document..."}
      </p>
    </div>
  );
};

export default ProcessingOverlay;
