import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const DocumentSidebar = () => {
  return (
    <div className="w-80 border-l bg-background p-4 overflow-y-auto">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-4">Document Details</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="filename">File Name</Label>
              <Input id="filename" value="document.pdf" readOnly />
            </div>
            <div>
              <Label htmlFor="uploadDate">Upload Date</Label>
              <Input id="uploadDate" value="2024-03-14" readOnly />
            </div>
            <div>
              <Label htmlFor="fileSize">File Size</Label>
              <Input id="fileSize" value="2.4 MB" readOnly />
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="tags">Tags</Label>
          <Input id="tags" placeholder="Add tags..." />
        </div>

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