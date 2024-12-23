import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Webhook } from "lucide-react";

const WebhookInterface = () => {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [schedule, setSchedule] = useState("manual");
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const { toast } = useToast();

  const availableFields = [
    { id: "file_url", label: "File URL" },
    { id: "media_type", label: "Media Type" },
    { id: "caption", label: "Caption" },
    { id: "metadata", label: "Metadata" },
    { id: "created_at", label: "Created Date" }
  ];

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
          record_type: 'media',
          selected_fields: selectedFields
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
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <Webhook className="w-5 h-5 text-[#0088cc]" />
          <CardTitle className="text-white">Webhook Interface</CardTitle>
        </div>
        <CardDescription className="text-gray-400">
          Send media data to external webhooks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Input
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="Enter webhook URL..."
            className="flex-1 bg-white/5 border-white/10 text-white"
          />
          
          <div className="space-y-2">
            <Label className="text-white">Schedule</Label>
            <Select value={schedule} onValueChange={setSchedule}>
              <SelectTrigger className="w-full bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Select schedule" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/10">
                <SelectItem value="manual" className="text-white hover:bg-white/5">Manual</SelectItem>
                <SelectItem value="hourly" className="text-white hover:bg-white/5">Hourly</SelectItem>
                <SelectItem value="daily" className="text-white hover:bg-white/5">Daily</SelectItem>
                <SelectItem value="weekly" className="text-white hover:bg-white/5">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-white">Select Fields to Send</Label>
            <div className="grid grid-cols-2 gap-4">
              {availableFields.map((field) => (
                <div key={field.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={field.id}
                    checked={selectedFields.includes(field.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedFields([...selectedFields, field.id]);
                      } else {
                        setSelectedFields(selectedFields.filter(f => f !== field.id));
                      }
                    }}
                    className="border-white/10"
                  />
                  <Label htmlFor={field.id} className="text-white">{field.label}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Button 
          onClick={handleSendWebhook}
          disabled={isLoading}
          className="w-full bg-[#0088cc] hover:bg-[#0088cc]/80 text-white"
        >
          Send Data
        </Button>
      </CardContent>
    </Card>
  );
};

export default WebhookInterface;