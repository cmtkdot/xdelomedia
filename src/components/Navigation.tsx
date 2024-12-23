import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { 
  Home,
  MessageSquare,
  Image,
  Settings,
  LogOut,
  Webhook,
  Menu
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const navItems = [
    { path: "/", icon: Home, label: "Dashboard" },
    { path: "/messages", icon: MessageSquare, label: "Messages" },
    { path: "/media", icon: Image, label: "Media" },
    { path: "/webhooks", icon: Webhook, label: "Webhooks" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 md:hidden text-white p-2 hover:bg-white/10 rounded-lg"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar Navigation */}
      <nav className={cn(
        "fixed top-0 left-0 h-full w-64 bg-black/90 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-200 ease-in-out z-40",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-4">
            <Link to="/" className="text-white font-semibold text-lg block py-4">
              Telegram Manager
            </Link>
          </div>

          <div className="flex-1 px-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-white hover:bg-white/10 mb-1",
                    location.pathname === item.path && "bg-white/10"
                  )}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>

          <div className="p-4">
            <Button 
              onClick={handleLogout}
              variant="ghost" 
              className="w-full justify-start text-red-400 hover:bg-red-500/10 hover:text-red-300"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navigation;