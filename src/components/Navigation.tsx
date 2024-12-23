import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { 
  Home,
  MessageSquare,
  Image,
  Settings,
  LogOut,
  Webhook
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/20 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-white font-semibold text-lg">
              Telegram Manager
            </Link>
            
            <div className="hidden md:flex space-x-4">
              <Link to="/">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  <Home className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/messages">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Messages
                </Button>
              </Link>
              <Link to="/media">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  <Image className="w-4 h-4 mr-2" />
                  Media
                </Button>
              </Link>
              <Link to="/webhooks">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  <Webhook className="w-4 h-4 mr-2" />
                  Webhooks
                </Button>
              </Link>
              <Link to="/settings">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </Link>
            </div>
          </div>
          
          <Button 
            onClick={handleLogout}
            variant="ghost" 
            className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;