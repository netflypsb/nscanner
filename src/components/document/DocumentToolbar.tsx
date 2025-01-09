import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RotateCw, RotateCcw, Crop, Pen, Highlighter, FileText, Eraser } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

interface DocumentToolbarProps {
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onToolSelect: (tool: 'highlight' | 'text' | 'drawing' | 'eraser' | null) => void;
  selectedTool: 'highlight' | 'text' | 'drawing' | 'eraser' | null;
  documentId?: string;
}

const DocumentToolbar = ({ 
  onRotateLeft, 
  onRotateRight, 
  onToolSelect,
  selectedTool,
  documentId 
}: DocumentToolbarProps) => {
  const { toast } = useToast();
  const [ocrProgress, setOcrProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

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
      setIsProcessing(true);
      setOcrProgress(0);

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
    } finally {
      setIsProcessing(false);
      setOcrProgress(0);
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

        <div className="h-6 w-px bg-border" />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={selectedTool === 'highlight' ? 'default' : 'outline'} 
                size="icon"
                onClick={() => onToolSelect(selectedTool === 'highlight' ? null : 'highlight')}
              >
                <Highlighter className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Highlight Text</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={selectedTool === 'text' ? 'default' : 'outline'} 
                size="icon"
                onClick={() => onToolSelect(selectedTool === 'text' ? null : 'text')}
              >
                <FileText className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add Text</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={selectedTool === 'drawing' ? 'default' : 'outline'} 
                size="icon"
                onClick={() => onToolSelect(selectedTool === 'drawing' ? null : 'drawing')}
              >
                <Pen className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Draw</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={selectedTool === 'eraser' ? 'default' : 'outline'} 
                size="icon"
                onClick={() => onToolSelect(selectedTool === 'eraser' ? null : 'eraser')}
              >
                <Eraser className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Erase</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="h-6 w-px bg-border" />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleOCR}
                disabled={isProcessing}
              >
                <FileText className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Extract Text (OCR)</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {isProcessing && (
          <div className="flex-1 max-w-xs ml-4">
            <Progress value={ocrProgress * 100} className="w-full" />
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentToolbar;