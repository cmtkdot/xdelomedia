import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const BotInfo = () => {
  const { data: botInfo } = useQuery({
    queryKey: ['botInfo'],
    queryFn: async () => {
      const { data: channels } = await supabase
        .from('channels')
        .select('title, username')
        .eq('is_active', true)
        .single();
      return channels;
    }
  });

  return (
    <Card className="bg-transparent border-0 shadow-none">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="p-2 bg-purple-500/20 rounded-full backdrop-blur-md border border-purple-500/30 animate-pulse">
          <Bot className="w-8 h-8 text-purple-400" />
        </div>
        <div>
          <CardTitle className="text-xl font-bold text-white">{botInfo?.title || 'Loading...'}</CardTitle>
          {botInfo?.username && (
            <p className="text-sm text-purple-300">@{botInfo.username}</p>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300">Telegram Bot Interface for managing media and messages</p>
      </CardContent>
    </Card>
  );
};

export default BotInfo;