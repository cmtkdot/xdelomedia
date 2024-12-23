import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Message {
  id: number;
  text: string;
  from: string;
  timestamp: string;
}

interface MessageHistoryProps {
  messages: Message[];
}

const MessageHistory = ({ messages }: MessageHistoryProps) => {
  return (
    <Card className="w-full h-[400px] bg-white shadow-md">
      <CardHeader>
        <CardTitle>Message History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] w-full rounded-md">
          {messages.map((message) => (
            <div
              key={message.id}
              className="p-4 mb-2 rounded-lg bg-telegram-light animate-slideIn"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-telegram-primary">
                  {message.from}
                </span>
                <span className="text-sm text-gray-500">{message.timestamp}</span>
              </div>
              <p className="text-gray-700">{message.text}</p>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default MessageHistory;