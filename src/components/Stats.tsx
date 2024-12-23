import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, Activity } from "lucide-react";

interface StatsProps {
  users: number;
  messages: number;
  uptime: string;
}

const Stats = ({ users, messages, uptime }: StatsProps) => {
  return (
    <>
      <Card className="backdrop-blur-lg bg-black/30 border-purple-500/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-purple-300">Total Users</CardTitle>
          <Users className="w-4 h-4 text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-100">{users}</div>
        </CardContent>
      </Card>
      <Card className="backdrop-blur-lg bg-black/30 border-purple-500/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-purple-300">Messages</CardTitle>
          <MessageSquare className="w-4 h-4 text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-100">{messages}</div>
        </CardContent>
      </Card>
      <Card className="backdrop-blur-lg bg-black/30 border-purple-500/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-purple-300">Uptime</CardTitle>
          <Activity className="w-4 h-4 text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-100">{uptime}</div>
        </CardContent>
      </Card>
    </>
  );
};

export default Stats;