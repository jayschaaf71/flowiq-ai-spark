
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
      // Handle webhook from Plaud Cloud when new recording is available
      const webhook = await req.json();
      
      console.log('Plaud webhook received:', webhook);
      
      // Real Plaud webhook structure
      const { 
        event_type,
        recording: {
          id: recordingId,
          filename,
          duration,
          created_at,
          download_url,
          device_id,
          user_id: plaudUserId
        }
      } = webhook;

      if (event_type !== 'recording.created') {
        return new Response(JSON.stringify({ message: 'Event ignored' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Find the FlowIQ user associated with this Plaud device
      const { data: userConfig, error: configError } = await supabase
        .from('integration_settings')
        .select('user_id, settings')
        .eq('provider', 'plaud')
        .eq('is_active', true);

      if (configError || !userConfig || userConfig.length === 0) {
        throw new Error('No active Plaud integration found');
      }

      // Find matching user (you might need to store device_id mapping)
      const flowiqUserId = userConfig[0].user_id;
      const plaudConfig = userConfig[0].settings;
      
      // Download the audio file from Plaud Cloud
      const audioResponse = await fetch(download_url, {
        headers: { 
          'Authorization': `Bearer ${plaudConfig.apiKey}`,
          'X-API-Version': '2024-01'
        }
      });
      
      if (!audioResponse.ok) {
        throw new Error('Failed to download recording from Plaud Cloud');
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
          userId: flowiqUserId,
          source: 'plaud',
          metadata: {
            recordingId,
            filename,
            duration,
            deviceId: device_id,
            originalUrl: download_url
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
          user_id: flowiqUserId,
          source: 'plaud',
          external_id: recordingId,
          filename: filename,
          duration: duration,
          transcription: transcriptionResult.transcription,
          processed_at: new Date().toISOString(),
          metadata: {
            originalUrl: download_url,
            plaudRecordingId: recordingId,
            deviceId: device_id,
            plaudUserId: plaudUserId
          }
        });
      
      if (dbError) {
        throw dbError;
      }
      
      console.log(`Successfully processed recording ${recordingId} for user ${flowiqUserId}`);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          recordingId,
          transcriptionLength: transcriptionResult.transcription.length 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
      
    } else if (req.method === 'GET') {
      // Health check endpoint
      return new Response(
        JSON.stringify({ 
          status: 'healthy',
          timestamp: new Date().toISOString(),
          service: 'plaud-webhook'
        }),
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
