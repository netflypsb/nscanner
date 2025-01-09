import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DocumentSidebarProps {
  document: any;
}

const DocumentSidebar = ({ document }: DocumentSidebarProps) => {
  const { toast } = useToast();

  const handleCopyText = async () => {
    if (!document?.ocr_text) return;
    
    try {
      await navigator.clipboard.writeText(document.ocr_text);
      toast({
        title: "Copied",
        description: "Text copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy text",
        variant: "destructive",
      });
    }
  };

  const handleDownloadText = () => {
    if (!document?.ocr_text) return;

    const blob = new Blob([document.ocr_text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${document.name || 'document'}_text.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-80 border-l bg-background p-4 overflow-y-auto">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-4">Document Details</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="filename">File Name</Label>
              <Input id="filename" value={document?.name || ''} readOnly />
            </div>
            <div>
              <Label htmlFor="uploadDate">Upload Date</Label>
              <Input 
                id="uploadDate" 
                value={document?.created_at ? new Date(document.created_at).toLocaleDateString() : ''} 
                readOnly 
              />
            </div>
            <div>
              <Label htmlFor="fileSize">File Size</Label>
              <Input 
                id="fileSize" 
                value={document?.size ? `${Math.round(document.size / 1024)} KB` : ''} 
                readOnly 
              />
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="tags">Tags</Label>
          <Input id="tags" placeholder="Add tags..." value={document?.tags?.join(', ') || ''} />
        </div>

        {document?.ocr_text && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Extracted Text</Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyText}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleDownloadText}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Textarea
              value={document.ocr_text}
              readOnly
              className="min-h-[200px]"
            />
          </div>
        )}

        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            placeholder="Add notes about this document..."
            className="min-h-[150px]"
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentSidebar;