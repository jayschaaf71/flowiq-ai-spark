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

    console.log('Processing AI request with enhanced error handling');

    try {
      // Enhanced context for better responses
      const enhancedContext = `${context} 

IMPORTANT INSTRUCTIONS FOR SAGE AI:
- You are Sage AI, a highly capable practice management assistant
- ALWAYS provide specific, actionable steps with exact navigation paths
- For appointment scheduling: "Navigate to Schedule iQ → Click 'New Appointment' → Select patient → Choose time slot → Confirm"
- For patient management: "Go to Patient Management → Click 'Add Patient' → Fill required fields → Save"
- Be specific about button names, menu locations, and exact steps
- Keep responses under 200 words but make them actionable
- Focus on getting the user to their goal quickly

Context: ${context}
Specialty: ${specialty || 'healthcare'}
Brand: ${brandName || 'FlowiQ'}`;

      console.log('Calling OpenAI with enhanced context');
      
      // Set a reasonable timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      const aiResponse = await callOpenAISimple(message, enhancedContext, conversationHistory || [], controller.signal);
      clearTimeout(timeoutId);
      
      if (!aiResponse || !aiResponse.choices || aiResponse.choices.length === 0) {
        console.error('Invalid AI response structure:', aiResponse);
        throw new Error('Invalid response from AI service');
      }
      
      finalResponse = aiResponse.choices[0].message?.content || 
        `I'm here to help with ${brandName}! Could you please rephrase your question so I can provide specific guidance?`;
      
      console.log('Successfully generated AI response');
      
    } catch (error) {
      console.error('AI processing error:', error);
      
      // Provide helpful fallback responses
      const lowerMessage = message.toLowerCase();
      if (lowerMessage.includes('appointment') || lowerMessage.includes('schedule')) {
        finalResponse = `To schedule an appointment in ${brandName}:\n\n1. Navigate to Schedule iQ in the sidebar\n2. Click "New Appointment"\n3. Select the patient from the dropdown\n4. Choose an available time slot\n5. Click "Save Appointment"\n\nThe system will automatically handle conflicts and send confirmations.`;
      } else if (lowerMessage.includes('patient') && lowerMessage.includes('add')) {
        finalResponse = `To add a new patient in ${brandName}:\n\n1. Go to Patient Management\n2. Click "Add New Patient"\n3. Fill in required fields (Name, DOB, Contact info)\n4. Add insurance information if available\n5. Click "Save Patient"\n\nYou can also use voice input for faster data entry!`;
      } else {
        finalResponse = `I'm having trouble connecting to my AI services right now. Here are some quick help options:\n\n• Check the help documentation\n• Try rephrasing your question\n• Contact support if the issue persists\n\nWhat specific ${brandName} feature would you like help with?`;
      }
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