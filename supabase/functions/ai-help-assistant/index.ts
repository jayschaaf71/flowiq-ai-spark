import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { CORS_HEADERS, AI_CONFIG } from './config.ts';
import { callOpenAI, callOpenAISimple, getFollowUpResponse } from './openai-service.ts';
import { executeFunctions } from './function-executor.ts';
import { getSimpleResponse } from './simple-response.ts';

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
    
    const { message, context, conversationHistory, specialty, brandName } = body;
    
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
    console.log('Specialty:', specialty);
    console.log('Brand:', brandName);

    let finalResponse: string;

    // Check if we should use simple responses (only for very basic questions)
    const lowerMessage = message.toLowerCase();
    const isBasicQuestion = (
      (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('functioning')) &&
      lowerMessage.split(' ').length < 6
    );

    if (isBasicQuestion && specialty && brandName) {
      console.log('Using simple local response for basic greeting');
      finalResponse = getSimpleResponse(message, specialty, brandName);
    } else {
      // Use OpenAI for all real questions to get intelligent responses
      const enhancedContext = `${context} 
      
SPECIALTY CONTEXT: The user is working within ${brandName || 'FlowiQ'} platform, which is specifically designed for ${specialty || 'healthcare'} practices. 

Please provide responses that are:
- Specific to ${specialty || 'healthcare'} practice workflows
- Branded appropriately for ${brandName || 'FlowiQ'}
- Contextually relevant to their current page/workflow
- Professional but friendly in tone
- Practical and actionable

If they ask about features, focus on how they apply to ${specialty || 'healthcare'} practice management.
Keep responses concise but helpful (100-200 words).`;

      console.log('Using OpenAI for intelligent response');
      const aiResponse = await callOpenAISimple(message, enhancedContext, conversationHistory || []);
      
      if (!aiResponse || !aiResponse.choices || aiResponse.choices.length === 0) {
        throw new Error('Invalid AI response format');
      }
      
      finalResponse = aiResponse.choices[0].message?.content || 'I apologize, but I was unable to generate a response. Please try again.';
    }
    
    console.log('AI Help response generated successfully');

    return new Response(
      JSON.stringify({ 
        response: finalResponse,
        context: context,
        specialty: specialty,
        brandName: brandName,
        timestamp: new Date().toISOString(),
        actions_performed: []
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