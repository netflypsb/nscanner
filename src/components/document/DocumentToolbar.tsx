import React from 'react';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RotateCw, RotateCcw, Crop, Pen, Highlighter, FileText } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DocumentToolbarProps {
  onRotateLeft: () => void;
  onRotateRight: () => void;
  documentId?: string;
}

const DocumentToolbar = ({ onRotateLeft, onRotateRight, documentId }: DocumentToolbarProps) => {
  const { toast } = useToast();

  const handleOCR = async () => {
    if (!documentId) {
      toast({
        title: "Error",
        description: "No document selected",
        variant: "destructive",
      });
      return;
    }

    try {
      toast({
        title: "Processing",
        description: "Extracting text from document...",
      });

      const { data, error } = await supabase.functions.invoke('process-ocr', {
        body: { documentId },
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Text extracted successfully",
      });

      // Trigger a refresh of the document details
      // This will be implemented in the parent component
    } catch (error) {
      console.error('OCR processing error:', error);
      toast({
        title: "Error",
        description: "Failed to process document",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="border-b bg-background p-4">
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={onRotateLeft}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Rotate Left</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={onRotateRight}>
                <RotateCw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Rotate Right</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon">
                <Crop className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Crop</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon">
                <Pen className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Annotate</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon">
                <Highlighter className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Highlight</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleOCR}
              >
                <FileText className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Extract Text (OCR)</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default DocumentToolbar;