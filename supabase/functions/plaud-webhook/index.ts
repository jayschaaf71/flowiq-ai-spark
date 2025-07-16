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
    //   "created_at": "...",
    //   "tenant_name": "..." // Added for multi-tenant support
    // }

    if (webhookData.recording_id || webhookData.download_url) {
      console.log('Processing Plaud recording:', webhookData.recording_id);

      // Find the tenant configuration based on tenant_name or default to first active one
      let tenantConfig = null;
      if (webhookData.tenant_name) {
        const { data: configs } = await supabase
          .from('plaud_configurations')
          .select(`
            *,
            tenants!inner(id, name, specialty)
          `)
          .eq('tenants.name', webhookData.tenant_name)
          .eq('is_active', true)
          .single();
        
        tenantConfig = configs;
        console.log('Found tenant config for:', webhookData.tenant_name);
      } else {
        // Fallback to first active configuration
        const { data: configs, error: configError } = await supabase
          .from('plaud_configurations')
          .select(`
            *,
            tenants!inner(id, name, specialty)
          `)
          .eq('is_active', true)
          .limit(1)
          .maybeSingle();
        
        if (configError) {
          console.error('Error fetching plaud configurations:', configError);
        }
        
        tenantConfig = configs;
        console.log('Using fallback tenant config:', tenantConfig?.tenants?.name);
      }

      if (!tenantConfig) {
        console.error('No active Plaud configuration found');
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: 'No active Plaud integration found for this tenant',
            receivedData: webhookData 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400 
          }
        );
      }

      // Download the audio file if URL provided
      let audioData = null;
      let fileSize = 0;
      if (webhookData.download_url) {
        try {
          const audioResponse = await fetch(webhookData.download_url);
          if (audioResponse.ok) {
            const audioBlob = await audioResponse.blob();
            fileSize = audioBlob.size;
            const arrayBuffer = await audioBlob.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);
            audioData = btoa(String.fromCharCode(...uint8Array));
            console.log('Audio file downloaded successfully, size:', fileSize);
          }
        } catch (error) {
          console.error('Failed to download audio:', error);
        }
      }

      // Create the recording record first
      const { data: recording, error: recordingError } = await supabase
        .from('voice_recordings')
        .insert({
          tenant_id: tenantConfig.tenant_id,
          recording_id: webhookData.recording_id,
          original_filename: webhookData.filename,
          source: 'plaud',
          status: audioData ? 'processing' : 'failed',
          duration_seconds: webhookData.duration ? parseInt(webhookData.duration) : null,
          file_size_bytes: fileSize,
          audio_url: webhookData.download_url,
          metadata: {
            zapier_data: webhookData,
            tenant_name: tenantConfig.tenants.name,
            received_at: new Date().toISOString()
          }
        })
        .select()
        .single();

      if (recordingError) {
        console.error('Failed to create recording record:', recordingError);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Failed to store recording data',
            details: recordingError.message 
          }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      console.log('Recording record created:', recording.id);

      // If we have audio data, send it for transcription
      if (audioData) {
        try {
          const { data: transcriptionData, error: transcriptionError } = await supabase.functions.invoke('ai-voice-transcription', {
            body: {
              audio: audioData,
              userId: tenantConfig.user_id || 'webhook-user',
              tenantId: tenantConfig.tenant_id,
              recordingId: recording.id,
              source: 'plaud',
              metadata: {
                filename: webhookData.filename,
                duration: webhookData.duration,
                originalUrl: webhookData.download_url,
                created_at: webhookData.created_at,
                tenant_name: tenantConfig.tenants.name
              }
            }
          });

          if (transcriptionError) {
            console.error('Transcription error:', transcriptionError);
            // Update recording status to failed
            await supabase
              .from('voice_recordings')
              .update({ 
                status: 'failed',
                metadata: { 
                  ...recording.metadata, 
                  transcription_error: transcriptionError.message 
                }
              })
              .eq('id', recording.id);
          } else {
            console.log('Transcription completed for recording:', recording.id);
            // Update recording with transcription data
            await supabase
              .from('voice_recordings')
              .update({ 
                status: 'completed',
                transcription: transcriptionData?.transcription,
                ai_summary: transcriptionData?.summary,
                soap_notes: transcriptionData?.soap_notes,
                processed_at: new Date().toISOString()
              })
              .eq('id', recording.id);
          }
        } catch (error) {
          console.error('Failed to process transcription:', error);
          await supabase
            .from('voice_recordings')
            .update({ 
              status: 'failed',
              metadata: { 
                ...recording.metadata, 
                processing_error: error.message 
              }
            })
            .eq('id', recording.id);
        }
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Plaud recording processed successfully',
          recordingId: recording.id,
          tenantName: tenantConfig.tenants.name,
          status: audioData ? 'processing' : 'stored'
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