
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
      // Handle webhook from Zapier/Plaud
      const webhook = await req.json();
      
      console.log('Plaud/Zapier webhook received:', webhook);
      
      // Handle both direct Plaud webhooks and Zapier-formatted data
      let recordingData;
      
      if (webhook.recording_id || webhook.filename || webhook.transcript) {
        // This is Zapier-formatted data
        recordingData = {
          id: webhook.recording_id || `zapier_${Date.now()}`,
          filename: webhook.filename || 'Unknown Recording',
          transcript: webhook.transcript || '',
          created_at: webhook.created_at || new Date().toISOString(),
          duration: webhook.duration || 0,
          source: 'zapier'
        };
      } else if (webhook.event_type === 'recording.created' && webhook.recording) {
        // This is a direct Plaud Cloud webhook
        const { recording } = webhook;
        recordingData = {
          id: recording.id,
          filename: recording.filename,
          transcript: recording.transcript || '',
          created_at: recording.created_at,
          duration: recording.duration,
          download_url: recording.download_url,
          source: 'plaud_direct'
        };
      } else {
        // Handle test webhooks or simple data
        recordingData = {
          id: `test_${Date.now()}`,
          filename: webhook.title || webhook.filename || 'Test Recording',
          transcript: webhook.transcript || webhook.message || 'Test transcript',
          created_at: new Date().toISOString(),
          duration: 0,
          source: 'test'
        };
      }

      console.log('Processed recording data:', recordingData);

      // Find active Plaud integrations to determine which user to associate this with
      const { data: userConfigs, error: configError } = await supabase
        .from('integration_settings')
        .select('user_id, settings')
        .eq('provider', 'plaud')
        .eq('is_active', true);

      if (configError) {
        console.error('Error fetching user configs:', configError);
        throw new Error('Failed to find active Plaud integrations');
      }

      if (!userConfigs || userConfigs.length === 0) {
        console.log('No active Plaud integrations found, creating test entry');
        // For testing purposes, we'll still process but log it differently
      }

      // Use the first active integration or create a test user entry
      const flowiqUserId = userConfigs?.[0]?.user_id || '00000000-0000-0000-0000-000000000000';
      
      // If we have a transcript, process it for SOAP generation
      if (recordingData.transcript && recordingData.transcript.length > 10) {
        try {
          // Call our AI transcription service for SOAP generation
          const transcriptionResponse = await supabase.functions.invoke('ai-voice-transcription', {
            body: {
              transcription: recordingData.transcript,
              userId: flowiqUserId,
              source: recordingData.source,
              metadata: {
                recordingId: recordingData.id,
                filename: recordingData.filename,
                duration: recordingData.duration,
                originalTimestamp: recordingData.created_at
              }
            }
          });

          if (transcriptionResponse.error) {
            console.error('AI transcription service error:', transcriptionResponse.error);
          } else {
            console.log('AI transcription service success:', transcriptionResponse.data);
          }
        } catch (aiError) {
          console.error('Failed to call AI transcription service:', aiError);
          // Continue processing even if AI service fails
        }
      }
      
      // Store the processed recording in our database
      const { error: dbError } = await supabase
        .from('voice_recordings')
        .insert({
          user_id: flowiqUserId,
          source: recordingData.source,
          external_id: recordingData.id,
          filename: recordingData.filename,
          duration: recordingData.duration || 0,
          transcription: recordingData.transcript,
          processed_at: new Date().toISOString(),
          metadata: {
            originalTimestamp: recordingData.created_at,
            webhookSource: recordingData.source,
            zapierProcessed: true
          }
        });
      
      if (dbError) {
        console.error('Database error:', dbError);
        // Don't throw error for duplicate entries
        if (!dbError.message.includes('duplicate')) {
          throw dbError;
        }
      }
      
      console.log(`Successfully processed recording ${recordingData.id} from ${recordingData.source}`);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          recordingId: recordingData.id,
          source: recordingData.source,
          transcriptionLength: recordingData.transcript?.length || 0,
          message: 'Recording processed successfully'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
      
    } else if (req.method === 'GET') {
      // Health check endpoint
      return new Response(
        JSON.stringify({ 
          status: 'healthy',
          timestamp: new Date().toISOString(),
          service: 'plaud-webhook',
          message: 'Webhook is ready to receive Plaud/Zapier data'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    
  } catch (error) {
    console.error('Plaud webhook error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
