import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
  try {
    const { webhook_url, selected_fields } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: mediaData, error } = await supabase
      .from('media')
      .select(`
        *,
        chat:channels(title, username)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const filteredData = mediaData.map(item => {
      const filtered: Record<string, any> = {};
      selected_fields.forEach((field: string) => {
        filtered[field] = item[field];
      });
      return filtered;
    });

    const response = await fetch(webhook_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filteredData),
    });

    if (!response.ok) {
      throw new Error(`Webhook forwarding failed: ${response.statusText}`);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 },
    );
  } catch (error) {
    console.error('Error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400 },
    );
  }
});