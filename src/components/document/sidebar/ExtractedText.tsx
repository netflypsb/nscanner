import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExtractedTextProps {
  text: string;
  onCopy: () => void;
  onDownload: () => void;
}

const ExtractedText = ({ text, onCopy, onDownload }: ExtractedTextProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Label>Extracted Text</Label>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onCopy}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onDownload}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Textarea
        value={text}
        readOnly
        className="min-h-[200px]"
      />
    </div>
  );
};

export default ExtractedText;