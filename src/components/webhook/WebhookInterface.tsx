import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const WebhookInterface = () => {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendWebhook = async () => {
    if (!webhookUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a webhook URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await supabase.functions.invoke('webhook-forwarder', {
        body: { 
          webhook_url: webhookUrl,
          record_type: 'media'
        }
      });

      if (response.error) throw response.error;

      toast({
        title: "Success",
        description: "Data sent to webhook successfully",
      });
    } catch (error) {
      console.error('Error sending webhook:', error);
      toast({
        title: "Error",
        description: "Failed to send data to webhook",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-transparent border border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Webhook Interface</CardTitle>
        <CardDescription className="text-gray-400">
          Send media data to external webhooks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <Input
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="Enter webhook URL..."
            className="flex-1 bg-white/5 border-white/10 text-white"
          />
          <Button 
            onClick={handleSendWebhook}
            disabled={isLoading}
            className="bg-[#0088cc] hover:bg-[#0088cc]/80 text-white"
          >
            Send Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebhookInterface;