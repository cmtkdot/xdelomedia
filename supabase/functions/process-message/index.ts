import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.1.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log("Processing message request");
    const { message } = await req.json();
    
    // Validate message
    if (!message || typeof message !== "string") {
      console.error("Invalid message format received:", message);
      return new Response(
        JSON.stringify({ error: "Invalid message format" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get OpenAI API key
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      console.error("OpenAI API key not configured");
      return new Response(
        JSON.stringify({ error: "OpenAI API key not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Initialize OpenAI
    const configuration = new Configuration({
      apiKey: openaiApiKey,
    });
    const openai = new OpenAIApi(configuration);

    console.log("Sending request to OpenAI");
    
    // Process message with OpenAI
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful Telegram bot assistant. Keep responses concise and friendly.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const response = completion.data.choices[0]?.message?.content || "I'm sorry, I couldn't process that request.";
    console.log("Successfully processed message");

    return new Response(
      JSON.stringify({ response }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error processing message:", error);
    // Return a more detailed error response
    return new Response(
      JSON.stringify({ 
        error: "Internal server error",
        details: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});