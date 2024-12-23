import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, Activity } from "lucide-react";

interface StatsProps {
  users: number;
  messages: number;
  uptime: string;
}

const Stats = ({ users, messages, uptime }: StatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
      <Card className="bg-white shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="w-4 h-4 text-telegram-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{users}</div>
        </CardContent>
      </Card>
      <Card className="bg-white shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Messages</CardTitle>
          <MessageSquare className="w-4 h-4 text-telegram-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{messages}</div>
        </CardContent>
      </Card>
      <Card className="bg-white shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Uptime</CardTitle>
          <Activity className="w-4 h-4 text-telegram-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{uptime}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Stats;