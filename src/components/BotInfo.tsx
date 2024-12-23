import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot } from "lucide-react";

interface BotInfoProps {
  name: string;
  username: string;
  description: string;
}

const BotInfo = ({ name, username, description }: BotInfoProps) => {
  return (
    <Card className="bg-transparent border-0 shadow-none">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="p-2 bg-purple-500/20 rounded-full backdrop-blur-md border border-purple-500/30 animate-pulse">
          <Bot className="w-8 h-8 text-purple-400" />
        </div>
        <div>
          <CardTitle className="text-xl font-bold text-white">{name}</CardTitle>
          <p className="text-sm text-purple-300">@{username}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300">{description}</p>
      </CardContent>
    </Card>
  );
};

export default BotInfo;