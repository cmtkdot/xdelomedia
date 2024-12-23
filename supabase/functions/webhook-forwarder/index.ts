import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { webhook_url, record_type, selected_fields } = await req.json();
    console.log('Received webhook request:', { webhook_url, record_type, selected_fields });
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch the media data with channel information
    const { data: mediaData, error } = await supabase
      .from('media')
      .select(`
        *,
        channel:channels(title, username)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching media data:', error);
      throw error;
    }

    console.log('Fetched media data:', mediaData);

    // Filter the data based on selected fields
    const filteredData = mediaData.map(item => {
      const filtered: Record<string, any> = {};
      
      selected_fields.forEach((field: string) => {
        switch (field) {
          case 'file_url':
            filtered.file_url = item.file_url;
            break;
          case 'media_type':
            filtered.media_type = item.media_type;
            break;
          case 'caption':
            filtered.caption = item.caption;
            break;
          case 'metadata':
            filtered.metadata = item.metadata;
            break;
          case 'created_at':
            filtered.created_at = item.created_at;
            break;
          default:
            // Handle any additional fields
            if (item[field] !== undefined) {
              filtered[field] = item[field];
            }
        }
      });

      // Add channel information if available
      if (item.channel) {
        filtered.channel = item.channel;
      }

      return filtered;
    });

    console.log('Filtered data to send:', filteredData);

    // Forward to webhook
    const response = await fetch(webhook_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: filteredData,
        timestamp: new Date().toISOString(),
        total_records: filteredData.length
      }),
    });

    if (!response.ok) {
      console.error('Webhook response not OK:', response.statusText);
      throw new Error(`Webhook forwarding failed: ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log('Webhook response:', responseData);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Data sent successfully',
        records_sent: filteredData.length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error in webhook forwarder:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});