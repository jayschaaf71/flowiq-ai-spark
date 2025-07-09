import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { CORS_HEADERS, AI_CONFIG } from './config.ts';
import { callOpenAI, callOpenAISimple, getFollowUpResponse } from './openai-service.ts';
import { executeFunctions } from './function-executor.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  try {
    console.log('=== AI Help Assistant Request ===');
    console.log('Request method:', req.method);
    console.log('Request headers:', Object.fromEntries(req.headers.entries()));
    
    const body = await req.json();
    console.log('Request body:', body);
    
    const { message, context, conversationHistory } = body;
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    console.log('Environment check:');
    console.log('- SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
    console.log('- SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? 'Set' : 'Missing');
    console.log('- OPENAI_API_KEY:', openaiApiKey ? 'Set' : 'Missing');
    
    if (!supabaseUrl || !supabaseKey || !openaiApiKey) {
      throw new Error('Missing required environment variables');
    }
    
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
      console.log('Processing function calls:', assistantMessage.tool_calls.length);
      functionResults = await executeFunctions(supabase, assistantMessage.tool_calls);
      
      // If functions were called, get a follow-up response from the AI
      if (functionResults.length > 0) {
        console.log('Getting follow-up response from AI');
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
    console.error('=== AI Help Assistant Error ===');
    console.error('Error details:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: `AI Help Assistant Error: ${error.message}`,
        details: error.stack 
      }),
      {
        status: 500,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      }
    );
  }
});