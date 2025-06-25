
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!openAIApiKey) {
    console.error('OpenAI API key not configured');
    return new Response(
      JSON.stringify({ error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your Supabase Edge Function secrets.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { message, context } = await req.json();
    console.log('Received request:', { message, userRole: context?.userRole });

    // Build system prompt based on user role and context
    const systemPrompt = buildSystemPrompt(context);
    
    // Get AI response
    const aiResponse = await getAIResponse(message, systemPrompt, context);
    
    // Generate contextual suggestions
    const suggestions = generateSuggestions(context?.userRole || 'patient', message, aiResponse);

    // Parse for appointment creation intent
    const appointmentData = parseAppointmentIntent(aiResponse, context);

    console.log('Sending response:', { response: aiResponse.substring(0, 100) + '...' });

    return new Response(
      JSON.stringify({
        response: aiResponse,
        suggestions,
        appointmentData
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in schedule-ai-chat:', error);
    return new Response(
      JSON.stringify({ 
        error: `AI Assistant Error: ${error.message}. Please try again or rephrase your request.` 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function buildSystemPrompt(context: any): string {
  const { userRole, scheduleData, userName } = context || {};
  
  const basePrompt = `You are Schedule iQ, an AI assistant specialized in medical appointment scheduling. You have real-time access to appointment data and can help with booking, rescheduling, and schedule optimization.

Current Context:
- User: ${userName || 'User'} (Role: ${userRole || 'patient'})
- Today's appointments: ${scheduleData?.todaysAppointments || 0}
- Available slots today: ${scheduleData?.availableSlots || 0}
- Total providers: ${scheduleData?.totalActiveProviders || 0}

Guidelines:
- Be conversational and helpful
- Always confirm appointment details before suggesting creation
- Use real-time availability data when possible
- Keep responses concise but informative
- If you suggest creating an appointment, be specific about date, time, and provider`;

  if (userRole === 'patient') {
    return basePrompt + `

You're helping a patient with their appointments. Focus on:
- Finding available appointment slots
- Explaining appointment types and durations
- Helping with rescheduling
- Providing appointment reminders and information`;
  } else {
    return basePrompt + `

You're helping medical staff manage schedules. Focus on:
- Creating appointments for patients
- Optimizing provider schedules
- Managing waitlists and conflicts
- Providing scheduling analytics and insights`;
  }
}

async function getAIResponse(message: string, systemPrompt: string, context: any): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 500
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

function parseAppointmentIntent(aiResponse: string, context: any): any {
  // Simple intent detection - in production, this could be more sophisticated
  const appointmentKeywords = ['book', 'schedule', 'appointment', 'create'];
  const hasAppointmentIntent = appointmentKeywords.some(keyword => 
    aiResponse.toLowerCase().includes(keyword)
  );

  if (!hasAppointmentIntent) {
    return null;
  }

  // For demo purposes, return a sample appointment data structure
  // In production, this would parse more sophisticated appointment details from the AI response
  return {
    shouldCreate: false, // Set to true when ready to actually create
    patientName: context?.userName || 'Patient',
    email: context?.userEmail,
    appointmentType: 'consultation',
    date: new Date().toISOString().split('T')[0], // Today
    time: '10:00',
    duration: 60,
    notes: 'Scheduled via AI assistant'
  };
}

function generateSuggestions(userRole: string, userMessage: string, aiResponse: string): string[] {
  const lowerMessage = userMessage.toLowerCase();
  
  if (userRole === 'patient') {
    if (lowerMessage.includes('book') || lowerMessage.includes('schedule')) {
      return [
        "Show my upcoming appointments",
        "Find next available slot",
        "Check provider availability",
        "Set appointment reminders"
      ];
    }
    return [
      "Book my next appointment",
      "Show available times",
      "Reschedule existing appointment",
      "View my appointment history"
    ];
  } else {
    if (lowerMessage.includes('create') || lowerMessage.includes('book')) {
      return [
        "Check today's schedule",
        "View provider availability",
        "Create another appointment",
        "Optimize current schedule"
      ];
    }
    return [
      "Create patient appointment",
      "Check provider schedules",
      "View today's appointments",
      "Analyze scheduling patterns"
    ];
  }
}
