import { Home, Settings, LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const menuItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // First clear any existing session
      const { error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      // Then perform the signOut
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Only show success and navigate if no errors occurred
      toast.success("Logged out successfully");
      navigate("/landing");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error(error.message || "Error logging out");
    }
  };

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
      <nav className="flex flex-col h-[calc(100%-4rem)] justify-between p-2">
        <div className="space-y-1">
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
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 hover:bg-destructive/10 text-destructive hover:text-destructive rounded-md transition-colors w-full"
        >
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>
      </nav>
    </div>
  );
}