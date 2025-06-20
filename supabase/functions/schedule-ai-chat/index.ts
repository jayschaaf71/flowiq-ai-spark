
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { generateRoleSpecificPrompt } from './promptGenerator.ts';
import { generateContextAwareSuggestions } from './suggestionGenerator.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context, userProfile, enableAutomation } = await req.json();
    
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    const currentDateTime = new Date().toLocaleString();
    
    // Generate role-specific system prompt
    const systemPrompt = generateRoleSpecificPrompt(
      userProfile?.role || 'patient', 
      userProfile, 
      context, 
      enableAutomation,
      currentDateTime
    );

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    let aiResponse = data.choices[0].message.content;

    // Check if AI wants to create an appointment automatically
    let createAppointment = false;
    let appointmentData = null;

    if (enableAutomation && aiResponse.includes('APPOINTMENT_CREATE:')) {
      try {
        const appointmentMatch = aiResponse.match(/APPOINTMENT_CREATE:(\{.*?\})/s);
        if (appointmentMatch) {
          const appointmentJson = JSON.parse(appointmentMatch[1]);
          if (appointmentJson.createAppointment) {
            createAppointment = true;
            appointmentData = appointmentJson.appointmentData;
            
            // Remove the JSON from the response
            aiResponse = aiResponse.replace(/APPOINTMENT_CREATE:(\{.*?\})/s, '').trim();
          }
        }
      } catch (parseError) {
        console.error('Error parsing appointment creation JSON:', parseError);
      }
    }

    // Generate enhanced role-specific suggestions based on real data
    const suggestions = generateContextAwareSuggestions(
      message, 
      aiResponse, 
      context, 
      userProfile?.role, 
      enableAutomation
    );

    return new Response(JSON.stringify({ 
      response: aiResponse,
      suggestions: suggestions,
      createAppointment: createAppointment,
      appointmentData: appointmentData,
      contextUsed: {
        todaysAppointments: context?.todaysAppointments || 0,
        availableSlots: context?.availableSlots || 0,
        providersActive: context?.totalActiveProviders || 0,
        userRole: userProfile?.role || 'patient',
        nextAvailableSlots: context?.nextAvailableSlots || [],
        realTimeData: true,
        automationEnabled: enableAutomation
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in schedule-ai-chat:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      response: "I'm sorry, I'm having trouble connecting to my AI services right now. Please try again in a moment.",
      suggestions: ["Try again", "Refresh the page", "Check system status"]
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
