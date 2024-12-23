import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const generateSafeFileName = (text: string, fileExt: string): string => {
  // Remove special characters and spaces, limit length
  const safeName = text
    .replace(/[^a-zA-Z0-9]/g, '_')
    .toLowerCase()
    .slice(0, 50);
  return `${safeName}_${Date.now()}.${fileExt}`;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Received webhook request");
    
    const authHeader = req.headers.get("x-telegram-bot-api-secret-token");
    const botToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const webhookSecret = Deno.env.get("TELEGRAM_WEBHOOK_SECRET");
    
    console.log("Auth validation:", {
      hasAuthHeader: !!authHeader,
      hasBotToken: !!botToken,
      hasWebhookSecret: !!webhookSecret,
      headerMatches: authHeader === webhookSecret
    });

    if (!authHeader || !webhookSecret || authHeader !== webhookSecret) {
      console.error("Authentication failed - invalid or missing webhook secret");
      return new Response(
        JSON.stringify({ error: "Unauthorized - Invalid webhook secret" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!botToken) {
      console.error("Missing bot token");
      return new Response(
        JSON.stringify({ error: "Unauthorized - Missing bot token" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const payload = await req.json();
    console.log("Received webhook payload:", JSON.stringify(payload, null, 2));

    const message = payload.message || payload.channel_post;
    if (!message) {
      console.log("No message content found in payload");
      return new Response(
        JSON.stringify({ success: true, message: "No message content to process" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    const chat = message.chat;
    console.log("Processing message from chat:", chat);

    // First, try to find an existing bot user
    const { data: botUser, error: botUserError } = await supabase
      .from('bot_users')
      .select('id')
      .eq('telegram_user_id', message.from?.id.toString())
      .single();

    if (botUserError) {
      console.error("Error finding bot user:", botUserError);
    }

    // Use the bot user's ID if found, otherwise create a default system user ID
    const userId = botUser?.id || '00000000-0000-0000-0000-000000000000'; // Default system user ID
    console.log("Using user ID:", userId);

    // Create or update channel record
    const { data: channelData, error: channelError } = await supabase
      .from("channels")
      .upsert({
        chat_id: chat.id,
        title: chat.title || `Chat ${chat.id}`,
        username: chat.username,
        is_active: true,
        user_id: userId,
      }, {
        onConflict: 'chat_id'
      })
      .select()
      .single();

    if (channelError) {
      console.error("Error saving channel:", channelError);
    } else {
      console.log("Channel saved/updated:", channelData);
    }

    // Save message to database
    const { data: messageData, error: messageError } = await supabase
      .from("messages")
      .insert({
        chat_id: chat.id,
        message_id: message.message_id,
        sender_name: message.from?.first_name || "Unknown",
        text: message.text || message.caption || null,
        user_id: userId,
      })
      .select()
      .single();

    if (messageError) {
      console.error("Error saving message:", messageError);
    } else {
      console.log("Message saved:", messageData);
    }

    // Handle media (photos, documents, etc.)
    if (message.photo || message.document) {
      const mediaItem = message.photo ? 
        message.photo[message.photo.length - 1] : // Get highest quality photo
        message.document;
      
      console.log("Processing media:", mediaItem);

      // Get file path from Telegram
      const fileResponse = await fetch(
        `https://api.telegram.org/bot${botToken}/getFile?file_id=${mediaItem.file_id}`
      );
      const fileData = await fileResponse.json();
      
      if (!fileData.ok) {
        console.error("Failed to get file path:", fileData);
        throw new Error("Failed to get file path from Telegram");
      }

      // Download file from Telegram
      const fileUrl = `https://api.telegram.org/file/bot${botToken}/${fileData.result.file_path}`;
      const mediaResponse = await fetch(fileUrl);
      const mediaBlob = await mediaResponse.blob();

      console.log("Downloaded media file, uploading to storage...");

      // Generate file name using message caption or text
      const fileExt = fileData.result.file_path.split('.').pop();
      const caption = message.caption || message.text || mediaItem.file_id;
      const fileName = generateSafeFileName(caption, fileExt);

      // Upload to Supabase Storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from("telegram-media")
        .upload(fileName, mediaBlob, {
          contentType: mediaItem.mime_type || 'application/octet-stream',
          upsert: true,
        });

      if (storageError) {
        console.error("Storage upload error:", storageError);
        throw storageError;
      }

      // Get public URL
      const { data: publicUrl } = supabase.storage
        .from("telegram-media")
        .getPublicUrl(fileName);

      console.log("File uploaded, saving metadata to database...");

      // Save media metadata to database
      const { data: mediaData, error: mediaError } = await supabase
        .from("media")
        .insert({
          chat_id: chat.id,
          file_name: fileName,
          file_url: publicUrl.publicUrl,
          media_type: message.photo ? "photo" : mediaItem.mime_type,
          caption: message.caption,
          user_id: userId, // Using the resolved user ID
          metadata: {
            telegram_file_id: mediaItem.file_id,
            width: mediaItem.width,
            height: mediaItem.height,
            file_size: mediaItem.file_size,
            mime_type: message.document?.mime_type,
            original_filename: message.document?.file_name,
          },
        })
        .select()
        .single();

      if (mediaError) {
        console.error("Database insert error:", mediaError);
        throw mediaError;
      }

      console.log("Successfully processed media message:", mediaData);

      // Log activity
      await supabase.from("bot_activities").insert({
        event_type: "media_saved",
        chat_id: chat.id,
        user_id: userId,
        details: {
          media_type: message.photo ? "photo" : mediaItem.mime_type,
          file_name: fileName,
        },
      });
    }

    return new Response(
      JSON.stringify({ success: true, message: "Webhook processed successfully" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});