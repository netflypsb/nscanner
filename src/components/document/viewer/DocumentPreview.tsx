import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface Annotation {
  id: string;
  type: 'highlight' | 'text' | 'drawing';
  content: {
    text?: string;
    coordinates?: { x: number; y: number }[];
    color: string;
    pathData?: string;
  };
}

interface DocumentPreviewProps {
  zoom: number;
  rotation: number;
  selectedTool: 'highlight' | 'text' | 'drawing' | 'eraser' | null;
  annotations?: Annotation[];
  onAddAnnotation: (annotation: Omit<Annotation, 'id'>) => void;
  onDeleteAnnotation: (id: string) => void;
}

const DocumentPreview = ({ 
  zoom, 
  rotation,
  selectedTool,
  annotations = [],
  onAddAnnotation,
  onDeleteAnnotation,
}: DocumentPreviewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (selectedTool !== 'drawing') return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) / (zoom / 100);
    const y = (e.clientY - rect.top) / (zoom / 100);

    setIsDrawing(true);
    setCurrentPath([{ x, y }]);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || selectedTool !== 'drawing') return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) / (zoom / 100);
    const y = (e.clientY - rect.top) / (zoom / 100);

    setCurrentPath(prev => [...prev, { x, y }]);
  };

  const handleMouseUp = () => {
    if (!isDrawing || selectedTool !== 'drawing') return;

    if (currentPath.length > 1) {
      const pathData = currentPath
        .map((point, i) => `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
        .join(' ');

      onAddAnnotation({
        type: 'drawing',
        content: {
          pathData,
          color: 'blue',
        },
      });
    }

    setIsDrawing(false);
    setCurrentPath([]);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (selectedTool === 'text') {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = (e.clientX - rect.left) / (zoom / 100);
      const y = (e.clientY - rect.top) / (zoom / 100);

      const text = window.prompt('Enter text annotation:');
      if (text) {
        onAddAnnotation({
          type: 'text',
          content: {
            text,
            coordinates: [{ x, y }],
            color: 'black',
          },
        });
      }
    } else if (selectedTool === 'eraser') {
      // Handle eraser tool click on annotations
      // This would need hit detection for annotations
    }
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "w-[21cm] h-[29.7cm] bg-white shadow-lg relative",
        "transform transition-transform duration-200"
      )}
      style={{ 
        transform: `scale(${zoom/100}) rotate(${rotation}deg)`,
        transformOrigin: 'center center',
        cursor: selectedTool ? 'crosshair' : 'default',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleClick}
    >
      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
        Document Preview
      </div>

      <svg className="absolute inset-0 pointer-events-none">
        {/* Render existing drawings */}
        {annotations
          .filter(a => a.type === 'drawing')
          .map(annotation => (
            <path
              key={annotation.id}
              d={annotation.content.pathData}
              stroke={annotation.content.color}
              strokeWidth="2"
              fill="none"
            />
          ))}
        
        {/* Render current drawing */}
        {isDrawing && currentPath.length > 1 && (
          <path
            d={currentPath
              .map((point, i) => `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
              .join(' ')}
            stroke="blue"
            strokeWidth="2"
            fill="none"
          />
        )}
      </svg>

      {/* Render text annotations */}
      {annotations
        .filter(a => a.type === 'text')
        .map(annotation => (
          <div
            key={annotation.id}
            className="absolute pointer-events-none"
            style={{
              left: annotation.content.coordinates?.[0].x,
              top: annotation.content.coordinates?.[0].y,
              color: annotation.content.color,
            }}
          >
            {annotation.content.text}
          </div>
        ))}
    </div>
  );
};

export default DocumentPreview;