import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CameraSelectProps {
  value: "user" | "environment";
  onChange: (value: string) => void;
}

const CameraSelect = ({ value, onChange }: CameraSelectProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Camera" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="environment">Back Camera</SelectItem>
        <SelectItem value="user">Front Camera</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default CameraSelect;