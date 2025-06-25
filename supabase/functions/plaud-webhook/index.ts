
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    if (req.method === 'POST') {
      // Handle webhook from Plaud when new recording is available
      const webhook = await req.json();
      
      console.log('Plaud webhook received:', webhook);
      
      // Process the new recording
      const { recordingId, userId, downloadUrl, filename, duration } = webhook;
      
      // Download the audio file
      const audioResponse = await fetch(downloadUrl);
      if (!audioResponse.ok) {
        throw new Error('Failed to download recording from Plaud');
      }
      
      const audioBlob = await audioResponse.blob();
      const audioBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));
      
      // Send to our AI transcription service
      const transcriptionResponse = await fetch(`${supabaseUrl}/functions/v1/ai-voice-transcription`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          audio: base64Audio,
          userId: userId,
          source: 'plaud',
          metadata: {
            recordingId,
            filename,
            duration,
            originalUrl: downloadUrl
          }
        })
      });
      
      if (!transcriptionResponse.ok) {
        throw new Error('Failed to transcribe audio');
      }
      
      const transcriptionResult = await transcriptionResponse.json();
      
      // Store the processed recording in our database
      const { error: dbError } = await supabase
        .from('voice_recordings')
        .insert({
          user_id: userId,
          source: 'plaud',
          external_id: recordingId,
          filename: filename,
          duration: duration,
          transcription: transcriptionResult.transcription,
          processed_at: new Date().toISOString(),
          metadata: {
            originalUrl: downloadUrl,
            plaudRecordingId: recordingId
          }
        });
      
      if (dbError) {
        throw dbError;
      }
      
      // Optionally trigger notification to user
      // You could send a real-time notification here
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          recordingId,
          transcriptionLength: transcriptionResult.transcription.length 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
      
    } else if (req.method === 'GET') {
      // Handle polling requests from frontend
      const url = new URL(req.url);
      const userId = url.searchParams.get('userId');
      const since = url.searchParams.get('since');
      
      if (!userId) {
        throw new Error('userId parameter required');
      }
      
      // Get recent recordings for the user
      let query = supabase
        .from('voice_recordings')
        .select('*')
        .eq('user_id', userId)
        .eq('source', 'plaud')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (since) {
        query = query.gt('created_at', since);
      }
      
      const { data: recordings, error } = await query;
      
      if (error) {
        throw error;
      }
      
      return new Response(
        JSON.stringify({ recordings: recordings || [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    
  } catch (error) {
    console.error('Plaud webhook error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
