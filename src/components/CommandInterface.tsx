import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const CommandInterface = () => {
  const [command, setCommand] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase.functions.invoke('process-message', {
        body: { message: command, userId: user.id }
      });

      if (error) throw error;

      toast({
        title: "Message sent",
        description: "Bot has processed your message",
      });

      setCommand("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-[#0088cc]">Command Interface</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Type a command or message..."
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          className="w-full bg-[#0088cc] hover:bg-[#006699]"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Send"}
        </Button>
      </form>
    </div>
  );
};

export default CommandInterface;