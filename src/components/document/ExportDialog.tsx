import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import { QRCodeSVG } from 'qrcode.react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generateShareableLink } from '@/utils/documentExport';

interface ExportDialogProps {
  documentId: string;
  documentText: string;
}

const ExportDialog = ({ documentId, documentText }: ExportDialogProps) => {
  const [shareableLink, setShareableLink] = React.useState<string | null>(null);
  const { toast } = useToast();

  const handleExport = async (format: 'pdf' | 'txt') => {
    try {
      const response = await fetch('/api/export-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: documentText,
          format,
        }),
      });

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `document.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Export Successful",
        description: `Document exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export document",
        variant: "destructive",
      });
    }
  };

  const handleGenerateLink = async () => {
    try {
      const link = await generateShareableLink(supabase, documentId);
      setShareableLink(link);
      toast({
        title: "Link Generated",
        description: "Shareable link created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate shareable link",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Document</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={() => handleExport('pdf')}>
              Export as PDF
            </Button>
            <Button onClick={() => handleExport('txt')}>
              Export as TXT
            </Button>
          </div>
          <div className="border-t pt-4">
            <Button
              className="w-full"
              variant="outline"
              onClick={handleGenerateLink}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Generate Shareable Link
            </Button>
          </div>
          {shareableLink && (
            <div className="space-y-4">
              <div className="p-2 bg-muted rounded-md">
                <p className="text-sm break-all">{shareableLink}</p>
              </div>
              <div className="flex justify-center p-4 bg-white rounded-md">
                <QRCodeSVG value={shareableLink} size={200} />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;