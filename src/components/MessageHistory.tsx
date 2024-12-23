import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  text: string;
  sender_name: string;
  created_at: string;
}

const MessageHistory = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) throw error;
        setMessages(data || []);
      } catch (error: any) {
        toast({
          title: "Error fetching messages",
          description: error.message,
          variant: "destructive",
        });
      }
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel('messages')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages' 
        }, 
        (payload) => {
          setMessages(prev => [payload.new as Message, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-[#0088cc]">Message History</h2>
      <div className="space-y-4 max-h-[500px] overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-4 rounded-lg ${
              message.sender_name === "Bot"
                ? "bg-gray-100 ml-4"
                : "bg-[#0088cc] text-white mr-4"
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="font-semibold">{message.sender_name}</span>
              <span className="text-sm opacity-75">
                {new Date(message.created_at).toLocaleTimeString()}
              </span>
            </div>
            <p>{message.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageHistory;