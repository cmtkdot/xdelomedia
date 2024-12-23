import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GLIDEAPPS_WEBHOOK_URL = 'https://go.glideapps.com/api/container/plugin/webhook-trigger/5XJos60qGtkJzQUb5cJq/5ca16d70-c07f-4d49-a5fb-0c847a550fcc';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { record_type, record_id } = await req.json();
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch the record based on type
    let data;
    switch (record_type) {
      case 'media':
        const { data: mediaData } = await supabase
          .from('media')
          .select(`
            *,
            chat:channels(title, username)
          `)
          .eq('id', record_id)
          .single();
        data = mediaData;
        break;
      case 'messages':
        const { data: messageData } = await supabase
          .from('messages')
          .select('*')
          .eq('id', record_id)
          .single();
        data = messageData;
        break;
      default:
        throw new Error(`Unsupported record type: ${record_type}`);
    }

    if (!data) {
      throw new Error(`Record not found: ${record_type} ${record_id}`);
    }

    // Forward to Glideapps webhook
    const response = await fetch(GLIDEAPPS_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Webhook forwarding failed: ${response.statusText}`);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});