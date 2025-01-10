import React from "react";
import { Home, FileText, Camera, Layout, Settings, Folder } from "lucide-react";
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

const menuItems = [
  { title: "Home", icon: Home, url: "/" },
  { title: "My Documents", icon: FileText, url: "/documents" },
  { title: "New Scan", icon: Camera, url: "/scan" },
  { title: "Templates", icon: Layout, url: "/templates" },
  { title: "Settings", icon: Settings, url: "/settings" },
];

const folders = [
  { id: "1", name: "Work" },
  { id: "2", name: "Personal" },
  { id: "3", name: "Archived" },
];

export function DashboardSidebar() {
  const location = useLocation();

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

        {/* Folder Sidebar */}
        <SidebarGroup>
          <SidebarGroupLabel>Folders</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {folders.map((folder) => (
                <SidebarMenuItem key={folder.id}>
                  <SidebarMenuButton asChild tooltip={folder.name}>
                    <Link to={`/folders/${folder.id}`} className="flex items-center gap-2">
                      <Folder className="h-4 w-4" />
                      <span>{folder.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
