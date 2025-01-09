import React from 'react';

interface Corner {
  x: number;
  y: number;
}

interface BorderOverlayProps {
  corners: Corner[];
  isAdjusting: boolean;
  onCornerDrag: (index: number, e: React.MouseEvent) => void;
}

const BorderOverlay = ({ corners, isAdjusting, onCornerDrag }: BorderOverlayProps) => {
  if (corners.length !== 4) return null;

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ filter: isAdjusting ? 'none' : 'drop-shadow(0 0 2px rgba(0,0,0,0.5))' }}
    >
      <path
        d={`M ${corners[0].x}% ${corners[0].y}% L ${corners[1].x}% ${corners[1].y}% L ${corners[2].x}% ${corners[2].y}% L ${corners[3].x}% ${corners[3].y}% Z`}
        fill="none"
        stroke="rgb(var(--primary))"
        strokeWidth="2"
        className="transition-all duration-200"
      />
      {isAdjusting && corners.map((corner, index) => (
        <circle
          key={index}
          cx={`${corner.x}%`}
          cy={`${corner.y}%`}
          r="6"
          fill="rgb(var(--primary))"
          className="cursor-move"
          onMouseDown={(e) => onCornerDrag(index, e)}
        />
      ))}
    </svg>
  );
};

export default BorderOverlay;