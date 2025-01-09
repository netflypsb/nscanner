import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import DocumentDetails from './sidebar/DocumentDetails';
import ExtractedText from './sidebar/ExtractedText';

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
        <DocumentDetails document={document} />

        <div>
          <Label htmlFor="tags">Tags</Label>
          <Input id="tags" placeholder="Add tags..." value={document?.tags?.join(', ') || ''} />
        </div>

        {document?.ocr_text && (
          <ExtractedText 
            text={document.ocr_text}
            onCopy={handleCopyText}
            onDownload={handleDownloadText}
          />
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