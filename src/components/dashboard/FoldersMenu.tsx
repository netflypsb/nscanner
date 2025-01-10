import React, { useState } from 'react';
import { Folder, FolderPlus } from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const FoldersMenu = () => {
  const [folders, setFolders] = useState<string[]>([]);
  const [newFolderName, setNewFolderName] = useState<string>("");
  const [showInput, setShowInput] = useState<boolean>(false);

  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      setFolders((prev) => [...prev, newFolderName.trim()]);
      setNewFolderName("");
      setShowInput(false);
    }
  };

  return (
    <SidebarMenu>
      {folders.map((folder, index) => (
        <SidebarMenuItem key={index}>
          <SidebarMenuButton asChild tooltip={folder}>
            <div className="flex items-center gap-2">
              <Folder className="h-4 w-4" />
              <span>{folder}</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
      {showInput ? (
        <div className="flex items-center gap-2">
          <Input
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Folder name"
            className="w-full"
            onKeyDown={(e) => e.key === "Enter" && handleAddFolder()}
          />
          <Button variant="ghost" onClick={handleAddFolder}>
            Add
          </Button>
        </div>
      ) : (
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={() => setShowInput(true)}
            tooltip="Add Folder"
          >
            <div className="flex items-center gap-2">
              <FolderPlus className="h-4 w-4" />
              <span>Add Folder</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}
    </SidebarMenu>
  );
};

export default FoldersMenu;