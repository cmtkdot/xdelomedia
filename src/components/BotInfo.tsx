import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot } from "lucide-react";

interface BotInfoProps {
  name: string;
  username: string;
  description: string;
}

const BotInfo = ({ name, username, description }: BotInfoProps) => {
  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="p-2 bg-telegram-light rounded-full">
          <Bot className="w-8 h-8 text-telegram-primary" />
        </div>
        <div>
          <CardTitle className="text-xl font-bold">{name}</CardTitle>
          <p className="text-sm text-gray-500">@{username}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700">{description}</p>
      </CardContent>
    </Card>
  );
};

export default BotInfo;