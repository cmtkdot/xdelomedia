import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Send, Bot } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender_name: string;
  created_at: string;
  media_url?: string;
  media_type?: string;
}

const Messages = () => {
  const [newMessage, setNewMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const { data: messages, isLoading } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as Message[];
    },
  });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isProcessing) return;

    setIsProcessing(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to send messages",
          variant: "destructive",
        });
        return;
      }

      const messageId = Date.now();

      // Insert user message
      const { error: messageError } = await supabase.from("messages").insert({
        user_id: user.id,
        sender_name: "User",
        text: newMessage,
        message_id: messageId,
      });

      if (messageError) throw messageError;

      // Process with AI
      const { data, error } = await supabase.functions.invoke("process-message", {
        body: { message: newMessage },
      });

      if (error) throw error;

      if (data?.response) {
        const { error: botMessageError } = await supabase.from("messages").insert({
          user_id: user.id,
          sender_name: "Bot",
          text: data.response,
          message_id: messageId + 1,
        });

        if (botMessageError) throw botMessageError;
      }

      setNewMessage("");
      toast({
        title: "Success",
        description: "Message sent successfully",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="bg-black/20 backdrop-blur-xl rounded-lg p-6 border border-white/10">
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare className="w-6 h-6 text-[#0088cc]" />
          <h1 className="text-2xl font-semibold text-white">Messages</h1>
        </div>

        <ScrollArea className="h-[500px] rounded-lg border border-white/10 bg-black/30 p-4 mb-4">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-20 bg-white/5" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {messages?.map((message) => (
                <div
                  key={message.id}
                  className={`p-4 rounded-lg ${
                    message.sender_name === "Bot"
                      ? "bg-[#0088cc] text-white ml-8"
                      : "bg-white/5 border border-white/10 text-white mr-8"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {message.sender_name === "Bot" ? (
                      <Bot className="w-4 h-4" />
                    ) : (
                      <MessageSquare className="w-4 h-4" />
                    )}
                    <span className="font-medium">{message.sender_name}</span>
                    <span className="text-xs opacity-50">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm">{message.text}</p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={isProcessing}
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
          />
          <Button
            type="submit"
            disabled={isProcessing}
            className="bg-[#0088cc] hover:bg-[#0088cc]/80 text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Messages;