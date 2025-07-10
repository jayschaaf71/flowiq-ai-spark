import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Plaud webhook received:', req.method);
    
    const webhookData = await req.json();
    console.log('Webhook payload:', JSON.stringify(webhookData, null, 2));

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if this is a test webhook or actual Plaud data
    if (webhookData.test || webhookData.timestamp) {
      console.log('Test webhook received successfully');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Plaud webhook endpoint is working!',
          receivedData: webhookData 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    // Process actual Plaud recording data
    // Expected format from Plaud via Zapier:
    // {
    //   "recording_id": "...",
    //   "filename": "...",
    //   "duration": "...",
    //   "download_url": "...",
    //   "created_at": "..."
    // }

    if (webhookData.recording_id || webhookData.download_url) {
      console.log('Processing Plaud recording:', webhookData.recording_id);

      // Download the audio file if URL provided
      let audioData = null;
      if (webhookData.download_url) {
        try {
          const audioResponse = await fetch(webhookData.download_url);
          if (audioResponse.ok) {
            const audioBlob = await audioResponse.blob();
            const arrayBuffer = await audioBlob.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);
            audioData = btoa(String.fromCharCode(...uint8Array));
            console.log('Audio file downloaded successfully');
          }
        } catch (error) {
          console.error('Failed to download audio:', error);
        }
      }

      // If we have audio data, send it for transcription
      if (audioData) {
        try {
          const { data: transcriptionData, error: transcriptionError } = await supabase.functions.invoke('ai-voice-transcription', {
            body: {
              audio: audioData,
              userId: 'webhook-user', // You might want to associate with a specific user
              source: 'plaud',
              recordingId: webhookData.recording_id,
              metadata: {
                filename: webhookData.filename,
                duration: webhookData.duration,
                originalUrl: webhookData.download_url,
                created_at: webhookData.created_at
              }
            }
          });

          if (transcriptionError) {
            console.error('Transcription error:', transcriptionError);
          } else {
            console.log('Transcription completed:', transcriptionData.transcription);
          }
        } catch (error) {
          console.error('Failed to process transcription:', error);
        }
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Plaud recording processed successfully',
          recordingId: webhookData.recording_id 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    // If we get here, the webhook data format is unexpected
    console.log('Unexpected webhook data format:', webhookData);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Unexpected webhook data format',
        receivedData: webhookData 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );

  } catch (error) {
    console.error('Plaud webhook error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});