import { Home, LineChart, Settings, Menu } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: LineChart, label: "Trading", href: "/trading" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className={cn(
      "h-screen bg-card border-r border-border transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && <span className="font-bold text-lg">TradingApp</span>}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-secondary rounded-md"
        >
          <Menu size={20} />
        </button>
      </div>
      <nav className="p-2">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            to={item.href}
            className={cn(
              "flex items-center gap-3 p-3 hover:bg-secondary rounded-md text-foreground/80 hover:text-foreground transition-colors",
              location.pathname === item.href && "bg-secondary text-foreground"
            )}
          >
            <item.icon size={20} />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
}