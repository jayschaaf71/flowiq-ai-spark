import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Process base64 in chunks to prevent memory issues
function processBase64Chunks(base64String: string, chunkSize = 32768) {
  const chunks: Uint8Array[] = [];
  let position = 0;
  
  while (position < base64String.length) {
    const chunk = base64String.slice(position, position + chunkSize);
    const binaryChunk = atob(chunk);
    const bytes = new Uint8Array(binaryChunk.length);
    
    for (let i = 0; i < binaryChunk.length; i++) {
      bytes[i] = binaryChunk.charCodeAt(i);
    }
    
    chunks.push(bytes);
    position += chunkSize;
  }
  
  // Combine all chunks into a single Uint8Array
  const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  
  return result;
}

// Anonymize PII in text
function anonymizeTranscription(text: string): { anonymized: string; keyMap: Map<string, string> } {
  const keyMap = new Map<string, string>();
  let anonymized = text;
  let counter = 1;

  // Phone numbers
  const phoneRegex = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g;
  anonymized = anonymized.replace(phoneRegex, (match) => {
    const token = `[PHONE_${counter++}]`;
    keyMap.set(token, match);
    return token;
  });

  // Email addresses
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  anonymized = anonymized.replace(emailRegex, (match) => {
    const token = `[EMAIL_${counter++}]`;
    keyMap.set(token, match);
    return token;
  });

  // Names (basic pattern - capitalize words)
  const nameRegex = /\b[A-Z][a-z]{2,}\s+[A-Z][a-z]{2,}\b/g;
  anonymized = anonymized.replace(nameRegex, (match) => {
    const token = `[NAME_${counter++}]`;
    keyMap.set(token, match);
    return token;
  });

  return { anonymized, keyMap };
}

// Restore anonymized data
function restoreTranscription(text: string, keyMap: Map<string, string>): string {
  let restored = text;
  keyMap.forEach((original, token) => {
    restored = restored.replace(new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), original);
  });
  return restored;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { audioData, language = 'en' } = await req.json();

    if (!audioData) {
      throw new Error('Audio data is required');
    }

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Processing audio data...');
    
    // Convert base64 to audio file using chunked processing
    const audioBuffer = processBase64Chunks(audioData);
    
    console.log(`Converted audio buffer size: ${audioBuffer.length} bytes`);

    // Create form data for OpenAI Whisper API
    const formData = new FormData();
    const audioBlob = new Blob([audioBuffer], { type: 'audio/webm' });
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('model', 'whisper-1');
    formData.append('language', language);

    console.log('Sending request to OpenAI Whisper API...');

    // Call OpenAI Whisper API
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Transcription successful');

    // Anonymize PII before storing/returning
    const { anonymized, keyMap } = anonymizeTranscription(result.text);
    
    // Store the anonymized version in database
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Log the transcription request
    await supabase.from('voice_call_transcriptions').insert({
      original_text: anonymized, // Store anonymized version
      confidence_score: result.confidence || 0.9,
      language: language,
      created_at: new Date().toISOString(),
    });

    // Return the restored (de-anonymized) text to the client
    const restoredText = restoreTranscription(anonymized, keyMap);

    return new Response(
      JSON.stringify({ 
        text: restoredText,
        language: language,
        confidence: result.confidence || 0.9
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error processing transcription:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to process transcription' 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});