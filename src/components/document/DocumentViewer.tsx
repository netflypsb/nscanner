import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DocumentToolbar from './DocumentToolbar';
import DocumentSidebar from './DocumentSidebar';
import ExportDialog from './ExportDialog';
import ZoomControls from './viewer/ZoomControls';
import DocumentPreview from './viewer/DocumentPreview';
import Pagination from './viewer/Pagination';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

const DocumentViewer = () => {
  const { id: documentId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [selectedTool, setSelectedTool] = useState<'highlight' | 'text' | 'drawing' | 'eraser' | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: document } = useQuery({
    queryKey: ['document', documentId],
    queryFn: async () => {
      if (!documentId) return null;
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', documentId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: annotations } = useQuery({
    queryKey: ['annotations', documentId],
    queryFn: async () => {
      if (!documentId) return [];
      const { data, error } = await supabase
        .from('annotations')
        .select('*')
        .eq('document_id', documentId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const addAnnotationMutation = useMutation({
    mutationFn: async (annotation: Omit<Annotation, 'id'>) => {
      const { data, error } = await supabase
        .from('annotations')
        .insert([
          {
            document_id: documentId,
            type: annotation.type,
            content: annotation.content,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['annotations', documentId] });
      toast({
        title: "Success",
        description: "Annotation added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add annotation",
        variant: "destructive",
      });
      console.error('Error adding annotation:', error);
    },
  });

  const deleteAnnotationMutation = useMutation({
    mutationFn: async (annotationId: string) => {
      const { error } = await supabase
        .from('annotations')
        .delete()
        .eq('id', annotationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['annotations', documentId] });
      toast({
        title: "Success",
        description: "Annotation deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete annotation",
        variant: "destructive",
      });
      console.error('Error deleting annotation:', error);
    },
  });

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));
  const handleRotateRight = () => setRotation(prev => (prev + 90) % 360);
  const handleRotateLeft = () => setRotation(prev => (prev - 90 + 360) % 360);

  const handleAddAnnotation = (annotation: Omit<Annotation, 'id'>) => {
    addAnnotationMutation.mutate(annotation);
  };

  const handleDeleteAnnotation = (annotationId: string) => {
    deleteAnnotationMutation.mutate(annotationId);
  };

  return (
    <div className="flex h-screen bg-background">
      <main className="flex-1 flex flex-col">
        <DocumentToolbar 
          onRotateLeft={handleRotateLeft}
          onRotateRight={handleRotateRight}
          onToolSelect={setSelectedTool}
          selectedTool={selectedTool}
          documentId={documentId}
        />

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col items-center p-4 overflow-auto">
            <ZoomControls 
              zoom={zoom}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
            />

            <DocumentPreview 
              zoom={zoom} 
              rotation={rotation}
              selectedTool={selectedTool}
              annotations={annotations}
              onAddAnnotation={handleAddAnnotation}
              onDeleteAnnotation={handleDeleteAnnotation}
            />

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