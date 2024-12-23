import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const CommandInterface = () => {
  const [command, setCommand] = useState("");
  const { toast } = useToast();

  const handleSendCommand = () => {
    if (!command.trim()) {
      toast({
        title: "Error",
        description: "Please enter a command",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Command sent",
      description: `Sent command: ${command}`,
    });
    setCommand("");
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader>
        <CardTitle>Send Command</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Input
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="Enter command..."
            className="flex-1"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSendCommand();
              }
            }}
          />
          <Button
            onClick={handleSendCommand}
            className="bg-telegram-primary hover:bg-telegram-secondary"
          >
            <Send className="w-4 h-4 mr-2" /> Send
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommandInterface;