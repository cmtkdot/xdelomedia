import { supabase } from "@/integrations/supabase/client";
import BotInfo from "@/components/BotInfo";
import MessageHistory from "@/components/MessageHistory";
import CommandInterface from "@/components/CommandInterface";
import Stats from "@/components/Stats";
import MediaGallery from "@/components/media/MediaGallery";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-4 md:p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] rounded-full bg-purple-500/20 blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-[400px] h-[400px] rounded-full bg-blue-500/20 blur-3xl -bottom-32 -right-32 animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        <div className="flex justify-between items-center backdrop-blur-xl bg-white/5 p-4 rounded-lg border border-white/10 shadow-lg">
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
          <div className="backdrop-blur-xl bg-white/5 rounded-lg border border-white/10 p-6 shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
            <BotInfo />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Stats />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="backdrop-blur-xl bg-white/5 rounded-lg border border-white/10 p-6 shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
              <MessageHistory />
            </div>
            <div className="backdrop-blur-xl bg-white/5 rounded-lg border border-white/10 p-6 shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
              <CommandInterface />
            </div>
          </div>

          <div className="backdrop-blur-xl bg-white/5 rounded-lg border border-white/10 p-6 shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
            <MediaGallery />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;