import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { message, context, conversationHistory } = await req.json();
    
    if (!message) {
      throw new Error('Message is required');
    }

    console.log('Processing help request:', message);
    console.log('Current context:', context);

    // Build conversation context from history
    const historyContext = conversationHistory
      ?.map((msg: any) => `${msg.type}: ${msg.content}`)
      .join('\n') || '';

    const systemPrompt = `You are FlowiQ AI Assistant, a helpful support agent for the FlowiQ healthcare practice management platform. Your role is to help healthcare staff navigate and use the application effectively.

CURRENT USER CONTEXT: ${context}

CONVERSATION HISTORY:
${historyContext}

KEY CAPABILITIES TO HELP WITH:
- Patient Management: Adding patients, viewing records, updating information
- Appointment Scheduling: Booking, rescheduling, managing calendars with AI features
- AI Agents: Intake iQ (voice-enabled forms), Schedule iQ (smart scheduling), Scribe iQ (AI documentation), Claims iQ (automated processing)
- EHR Integration: Electronic health records, SOAP notes, medical coding
- Voice-Enabled Forms: How to use voice input for patient intake and form completion
- Claims Processing: Insurance claims, denials, revenue cycle management
- Settings & Configuration: Practice setup, integrations, user management
- Mobile Features: Capacitor mobile app capabilities, mobile-optimized workflows

SPECIFIC FEATURES TO EXPLAIN:
- Voice Input: Patients can speak their responses instead of typing in intake forms
- AI Processing: Voice gets automatically converted and formatted correctly
- Smart Scheduling: AI-powered conflict resolution and optimization
- Mobile-First Design: How to use the mobile app for patient check-ins
- Real-time Updates: Live data synchronization across the platform

RESPONSE GUIDELINES:
- Be conversational and helpful
- Provide step-by-step instructions when appropriate
- Mention specific UI elements (buttons, tabs, menus) when relevant
- If the user asks about a feature not yet implemented, politely explain and suggest alternatives
- Keep responses concise but thorough (200-400 words max)
- Use healthcare terminology appropriately
- Always prioritize patient privacy and HIPAA compliance in your guidance
- Include specific navigation paths like "Go to Intake iQ → Voice Intake tab"

Answer the user's question about using FlowiQ:`;

    // Call OpenAI GPT for intelligent help responses
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${errorText}`);
    }

    const aiResponse = await response.json();
    const assistantReply = aiResponse.choices[0].message.content;
    
    console.log('AI Help response generated successfully');

    return new Response(
      JSON.stringify({ 
        response: assistantReply,
        context: context,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('AI help assistant error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});