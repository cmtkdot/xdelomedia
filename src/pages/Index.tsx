import { supabase } from "@/integrations/supabase/client";
import BotInfo from "@/components/BotInfo";
import MessageHistory from "@/components/MessageHistory";
import CommandInterface from "@/components/CommandInterface";
import Stats from "@/components/Stats";
import MediaGallery from "@/components/MediaGallery";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center backdrop-blur-lg bg-black/30 p-4 rounded-lg border border-purple-500/20">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
            Telegram Bot Interface
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500/20 text-red-400 rounded-md hover:bg-red-500/30 transition-colors border border-red-500/50"
          >
            Logout
          </button>
        </div>
        
        <div className="grid gap-8 animate-fade-in">
          <div className="backdrop-blur-lg bg-black/30 rounded-lg border border-purple-500/20 p-6">
            <BotInfo
              name="System Bot"
              username="system_bot"
              description="A powerful AI-driven Telegram bot that helps manage your media and messages."
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Stats users={100} messages={1234} uptime="99.9%" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="backdrop-blur-lg bg-black/30 rounded-lg border border-purple-500/20 p-6">
              <MessageHistory />
            </div>
            <div className="backdrop-blur-lg bg-black/30 rounded-lg border border-purple-500/20 p-6">
              <CommandInterface />
            </div>
          </div>

          <div className="backdrop-blur-lg bg-black/30 rounded-lg border border-purple-500/20 p-6">
            <MediaGallery />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;