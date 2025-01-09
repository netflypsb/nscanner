import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DocumentDetailsProps {
  document: any;
}

const DocumentDetails = ({ document }: DocumentDetailsProps) => {
  return (
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
  );
};

export default DocumentDetails;