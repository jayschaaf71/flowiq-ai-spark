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

    // Always use OpenAI for intelligent, actionable responses
    const enhancedContext = `${context} 

SPECIALTY CONTEXT: The user is working within ${brandName || 'FlowiQ'} platform, which is specifically designed for ${specialty || 'healthcare'} practices. 

IMPORTANT: You are Sage AI, a highly capable assistant that can help users accomplish real tasks. When users ask for help:

1. For appointment scheduling: Provide specific navigation steps like "Go to Schedule iQ → Click 'New Appointment' → Select patient from dropdown → Choose available time slot"

2. For patient management: Give exact steps like "Navigate to Patient Management → Click 'Add Patient' → Fill required fields (Name, DOB, Contact) → Save"

3. For specific questions about features: Explain exactly how to use them with step-by-step guidance

4. For workflow questions: Provide the complete process from start to finish

Be specific, actionable, and helpful. Don't just list features - tell them exactly what to do next to accomplish their goal.

Current page context: ${context}
Specialty: ${specialty || 'healthcare'}
Brand: ${brandName || 'FlowiQ'}

Keep responses practical and under 200 words.`;

    console.log('Using OpenAI for intelligent, actionable response');
    const aiResponse = await callOpenAISimple(message, enhancedContext, conversationHistory || []);
    
    if (!aiResponse || !aiResponse.choices || aiResponse.choices.length === 0) {
      throw new Error('Invalid AI response format');
    }
    
    finalResponse = aiResponse.choices[0].message?.content || 'I apologize, but I was unable to generate a response. Please try again.';
    
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