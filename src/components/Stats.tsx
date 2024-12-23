import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, Activity } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Stats = () => {
  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const [usersCount, messagesCount, channelsCount] = await Promise.all([
        supabase.from('bot_users').select('id', { count: 'exact' }),
        supabase.from('messages').select('id', { count: 'exact' }),
        supabase.from('channels').select('id', { count: 'exact' })
      ]);
      
      return {
        users: usersCount.count || 0,
        messages: messagesCount.count || 0,
        channels: channelsCount.count || 0
      };
    }
  });

  return (
    <>
      <Card className="backdrop-blur-xl bg-white/5 border-purple-500/20 hover:shadow-purple-500/10 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-purple-300">Total Users</CardTitle>
          <Users className="w-4 h-4 text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{stats?.users || '...'}</div>
        </CardContent>
      </Card>
      <Card className="backdrop-blur-xl bg-white/5 border-purple-500/20 hover:shadow-purple-500/10 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-purple-300">Messages</CardTitle>
          <MessageSquare className="w-4 h-4 text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{stats?.messages || '...'}</div>
        </CardContent>
      </Card>
      <Card className="backdrop-blur-xl bg-white/5 border-purple-500/20 hover:shadow-purple-500/10 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-purple-300">Active Channels</CardTitle>
          <Activity className="w-4 h-4 text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {stats?.channels || '...'}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Stats;