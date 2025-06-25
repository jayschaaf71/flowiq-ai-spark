
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
    return new Response(
      JSON.stringify({ error: 'OpenAI API key not configured' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { message, context } = await req.json();
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Build system prompt based on user role and context
    const systemPrompt = buildSystemPrompt(context);
    
    // Get AI response
    const aiResponse = await getAIResponse(message, systemPrompt, context);
    
    // Parse AI response for appointment creation
    const appointmentData = await parseAppointmentIntent(aiResponse, context, supabase);

    return new Response(
      JSON.stringify({
        response: aiResponse,
        suggestions: generateSuggestions(context.userRole),
        appointmentData
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in schedule-ai-chat:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function buildSystemPrompt(context: any): string {
  const { userRole, scheduleData, userName } = context;
  
  const basePrompt = `You are Schedule iQ, an AI assistant specialized in medical appointment scheduling. You have real-time access to appointment data and can help with booking, rescheduling, and schedule optimization.

Current Context:
- User: ${userName} (Role: ${userRole})
- Today's appointments: ${scheduleData?.todaysAppointments || 0}
- Available slots today: ${scheduleData?.availableSlots || 0}
- Total providers: ${scheduleData?.totalActiveProviders || 0}

Guidelines:
- Be conversational and helpful
- Always confirm appointment details before suggesting creation
- Use real-time availability data when possible
- For patients: Focus on finding convenient appointment times
- For staff: Include optimization and management insights
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

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`OpenAI API error: ${data.error?.message || 'Unknown error'}`);
  }

  return data.choices[0].message.content;
}

async function parseAppointmentIntent(aiResponse: string, context: any, supabase: any): Promise<any> {
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
    patientName: context.userName,
    email: context.userEmail,
    appointmentType: 'consultation',
    date: new Date().toISOString().split('T')[0], // Today
    time: '10:00',
    duration: 60,
    notes: 'Scheduled via AI assistant'
  };
}

function generateSuggestions(userRole: string): string[] {
  if (userRole === 'patient') {
    return [
      "Show my upcoming appointments",
      "Find next available slot",
      "Reschedule an appointment",
      "Set appointment reminders"
    ];
  } else {
    return [
      "Check today's schedule",
      "Create patient appointment",
      "View provider availability",
      "Optimize current schedule"
    ];
  }
}
