import { supabase } from "@/integrations/supabase/client";
import BotInfo from "@/components/BotInfo";
import MessageHistory from "@/components/MessageHistory";
import CommandInterface from "@/components/CommandInterface";
import Stats from "@/components/Stats";
import { useNavigate } from "react-router-dom";

const mockMessages = [
  {
    id: 1,
    text: "Hello! How can I help you today?",
    from: "Bot",
    timestamp: "10:00 AM",
  },
  {
    id: 2,
    text: "/start",
    from: "User",
    timestamp: "10:01 AM",
  },
  {
    id: 3,
    text: "Welcome! I'm your friendly Telegram bot.",
    from: "Bot",
    timestamp: "10:01 AM",
  },
];

const Index = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#0088cc]">Telegram Bot Interface</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
        
        <BotInfo
          name="Sample Bot"
          username="sample_bot"
          description="A friendly Telegram bot that helps you with various tasks."
        />
        
        <Stats users={100} messages={1234} uptime="99.9%" />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <MessageHistory messages={mockMessages} />
          <CommandInterface />
        </div>
      </div>
    </div>
  );
};

export default Index;