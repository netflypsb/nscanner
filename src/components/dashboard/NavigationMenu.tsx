import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, Camera, Layout, Settings } from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Home", icon: Home, url: "/" },
  { title: "My Documents", icon: FileText, url: "/documents" },
  { title: "New Scan", icon: Camera, url: "/scan" },
  { title: "Templates", icon: Layout, url: "/templates" },
  { title: "Settings", icon: Settings, url: "/settings" },
];

const NavigationMenu = () => {
  const location = useLocation();

  return (
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
  );
};

export default NavigationMenu;