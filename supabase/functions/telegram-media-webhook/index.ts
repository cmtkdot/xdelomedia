import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Received webhook request");
    
    // Get the authorization header and bot token
    const authHeader = req.headers.get("x-telegram-bot-api-secret-token");
    const botToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const webhookSecret = Deno.env.get("TELEGRAM_WEBHOOK_SECRET");
    
    console.log("Auth validation:", {
      hasAuthHeader: !!authHeader,
      hasBotToken: !!botToken,
      hasWebhookSecret: !!webhookSecret,
      headerMatches: authHeader === webhookSecret
    });

    // Basic validation of the request
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

    // Handle photo messages
    if (payload.message?.photo || payload.channel_post?.photo) {
      const message = payload.message || payload.channel_post;
      const photo = message.photo[message.photo.length - 1]; // Get the highest quality photo
      const caption = message.caption || "";
      const chat_id = message.chat.id;
      
      console.log("Processing photo message:", {
        photo_id: photo.file_id,
        chat_id,
        caption,
      });
      
      // Get file path from Telegram
      const fileResponse = await fetch(
        `https://api.telegram.org/bot${botToken}/getFile?file_id=${photo.file_id}`
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

      // Upload to Supabase Storage
      const fileName = `${photo.file_id}.jpg`;
      const { data: storageData, error: storageError } = await supabase.storage
        .from("telegram-media")
        .upload(fileName, mediaBlob, {
          contentType: "image/jpeg",
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
          chat_id: chat_id,
          file_name: fileName,
          file_url: publicUrl.publicUrl,
          media_type: "photo",
          caption: caption,
          metadata: {
            telegram_file_id: photo.file_id,
            width: photo.width,
            height: photo.height,
            file_size: photo.file_size,
          },
        });

      if (mediaError) {
        console.error("Database insert error:", mediaError);
        throw mediaError;
      }

      console.log("Successfully processed media message");

      // Log activity
      await supabase.from("bot_activities").insert({
        event_type: "media_saved",
        chat_id: chat_id,
        details: {
          media_type: "photo",
          file_name: fileName,
        },
      });

      return new Response(
        JSON.stringify({ success: true, message: "Media saved successfully" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Return success for other message types
    return new Response(
      JSON.stringify({ success: true, message: "Message processed" }),
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