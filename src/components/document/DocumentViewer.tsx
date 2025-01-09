import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DocumentToolbar from './DocumentToolbar';
import DocumentSidebar from './DocumentSidebar';
import ExportDialog from './ExportDialog';
import ZoomControls from './viewer/ZoomControls';
import DocumentPreview from './viewer/DocumentPreview';
import Pagination from './viewer/Pagination';
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
        <DocumentToolbar 
          onRotateLeft={handleRotateLeft}
          onRotateRight={handleRotateRight}
          documentId={documentId}
        />

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col items-center p-4 overflow-auto">
            <ZoomControls 
              zoom={zoom}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
            />

            <DocumentPreview zoom={zoom} rotation={rotation} />

            <Pagination 
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>

          <DocumentSidebar document={document} />
        </div>

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