import React, { useState } from "react";
import { Home, FileText, Camera, Layout, Settings, FolderPlus, Folder } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const menuItems = [
  { title: "Home", icon: Home, url: "/" },
  { title: "My Documents", icon: FileText, url: "/documents" },
  { title: "New Scan", icon: Camera, url: "/scan" },
  { title: "Templates", icon: Layout, url: "/templates" },
  { title: "Settings", icon: Settings, url: "/settings" },
];

export function DashboardSidebar() {
  const location = useLocation();
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
    <Sidebar>
      <SidebarContent>
        {/* Navigation Menu */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={location.pathname === item.url}
                  >
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Folders Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Folders</SidebarGroupLabel>
          <SidebarGroupContent>
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
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}