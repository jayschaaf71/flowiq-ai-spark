import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { CORS_HEADERS, AI_CONFIG } from './config.ts';
import { callOpenAI, getFollowUpResponse } from './openai-service.ts';
import { executeFunctions } from './function-executor.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  try {
    const { message, context, conversationHistory } = await req.json();
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    if (!message) {
      throw new Error('Message is required');
    }

    console.log('Processing help request:', message);
    console.log('Current context:', context);

    // Call OpenAI with message and context
    const aiResponse = await callOpenAI(
      message, 
      context, 
      conversationHistory?.slice(-AI_CONFIG.maxHistoryMessages) || []
    );
    
    const choice = aiResponse.choices[0];
    const assistantMessage = choice.message;
    
    let finalResponse = assistantMessage.content || '';
    let functionResults: any[] = [];

    // Handle function calls if any
    if (assistantMessage.tool_calls) {
      functionResults = await executeFunctions(supabase, assistantMessage.tool_calls);
      
      // If functions were called, get a follow-up response from the AI
      if (functionResults.length > 0) {
        const followUpData = await getFollowUpResponse(
          message,
          context,
          conversationHistory?.slice(-AI_CONFIG.maxHistoryMessages) || [],
          assistantMessage,
          functionResults
        );
        
        if (followUpData) {
          finalResponse = followUpData.choices[0].message.content;
        }
      }
    }
    
    console.log('AI Help response generated successfully');

    return new Response(
      JSON.stringify({ 
        response: finalResponse,
        context: context,
        timestamp: new Date().toISOString(),
        actions_performed: functionResults
      }),
      { headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('AI help assistant error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      }
    );
  }
});