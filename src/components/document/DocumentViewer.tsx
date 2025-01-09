import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ZoomIn, ZoomOut } from 'lucide-react';
import DocumentToolbar from './DocumentToolbar';
import DocumentSidebar from './DocumentSidebar';
import ExportDialog from './ExportDialog';
import { cn } from '@/lib/utils';
import { supabase } from "@/integrations/supabase/client";

const DocumentViewer = () => {
  const { id: documentId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [document, setDocument] = useState<any>(null);

  useEffect(() => {
    const fetchDocument = async () => {
      if (!documentId) return;

      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', documentId)
        .single();

      if (error) {
        console.error('Error fetching document:', error);
        return;
      }

      setDocument(data);
    };

    fetchDocument();
  }, [documentId]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));
  const handleRotateRight = () => setRotation(prev => (prev + 90) % 360);
  const handleRotateLeft = () => setRotation(prev => (prev - 90 + 360) % 360);

  return (
    <div className="flex h-screen bg-background">
      <main className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <DocumentToolbar 
          onRotateLeft={handleRotateLeft}
          onRotateRight={handleRotateRight}
          documentId={documentId}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Document Viewer */}
          <div className="flex-1 flex flex-col items-center p-4 overflow-auto">
            <div className="flex gap-2 mb-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={handleZoomOut}>
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Zoom Out</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span className="flex items-center px-2">{zoom}%</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={handleZoomIn}>
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Zoom In</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Document Preview */}
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
              {/* Placeholder for actual document content */}
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                Document Preview
              </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center gap-4 mt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span>Page {currentPage}</span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                Next
              </Button>
            </div>
          </div>

          {/* Right Sidebar */}
          <DocumentSidebar document={document} />
        </div>

        {/* Bottom Bar */}
        <div className="border-t bg-background p-4 flex justify-between items-center">
          <div className="flex gap-2">
            <ExportDialog 
              documentId={documentId || ''} 
              documentText={document?.ocr_text || ''}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DocumentViewer;