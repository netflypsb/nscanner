import React from 'react';
import { ToggleLeft } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';

interface BorderDetectionToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

const BorderDetectionToggle = ({ enabled, onToggle }: BorderDetectionToggleProps) => {
  return (
    <div className="mb-4 flex items-center gap-2">
      <Toggle
        pressed={enabled}
        onPressedChange={onToggle}
      >
        <ToggleLeft className="mr-2 h-4 w-4" />
        Smart Border Detection
      </Toggle>
    </div>
  );
};

export default BorderDetectionToggle;