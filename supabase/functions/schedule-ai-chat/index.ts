
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('Edge function called with method:', req.method);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!openAIApiKey) {
    console.error('OpenAI API key not configured');
    return new Response(
      JSON.stringify({ 
        error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your Supabase Edge Function secrets.',
        response: 'I apologize, but the AI service is not properly configured. Please contact your administrator to set up the OpenAI API key.',
        suggestions: ['Contact support', 'Try again later']
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }

  try {
    const body = await req.json();
    const { message, context } = body;
    
    console.log('Received request:', { 
      message: message?.substring(0, 100) + '...', 
      userRole: context?.userRole,
      hasContext: !!context,
      conversationHistory: context?.conversationHistory?.length || 0
    });

    if (!message || !message.trim()) {
      return new Response(
        JSON.stringify({
          error: 'Message is required',
          response: 'Please provide a message to process.',
          suggestions: ['Ask about appointments', 'Check availability']
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Build comprehensive conversation context
    const conversationMessages = [];
    
    // Add system prompt
    conversationMessages.push({
      role: 'system',
      content: buildSystemPrompt(context)
    });

    // Add conversation history if available
    if (context?.conversationHistory && context.conversationHistory.length > 0) {
      // Add last few messages for context
      const recentMessages = context.conversationHistory.slice(-4);
      for (const msg of recentMessages) {
        conversationMessages.push({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        });
      }
    }

    // Add current user message
    conversationMessages.push({
      role: 'user',
      content: message
    });

    console.log('Calling OpenAI with', conversationMessages.length, 'messages');

    // Call OpenAI with improved error handling
    let aiResponse;
    try {
      const openAIResponse = await Promise.race([
        fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: conversationMessages,
            temperature: 0.7,
            max_tokens: 500
          }),
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('OpenAI request timeout')), 20000)
        )
      ]);

      if (!openAIResponse.ok) {
        const errorData = await openAIResponse.json().catch(() => ({}));
        throw new Error(`OpenAI API error: ${errorData.error?.message || openAIResponse.statusText}`);
      }

      const data = await openAIResponse.json();
      aiResponse = data.choices?.[0]?.message?.content;
      
      if (!aiResponse) {
        throw new Error('No response content from OpenAI');
      }

      console.log('OpenAI response received:', aiResponse.substring(0, 100) + '...');
      
    } catch (error) {
      console.error('OpenAI API error:', error);
      
      // Provide fallback response for common queries
      if (message.toLowerCase().includes('date') || message.toLowerCase().includes('time')) {
        const now = new Date();
        aiResponse = `The current date and time is: ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}. 

I apologize, but I'm experiencing some technical difficulties with my AI processing. However, I can still help you with basic information like the current date and time.

Is there anything specific about appointments or scheduling I can assist you with?`;
      } else {
        aiResponse = `I apologize, but I'm experiencing some technical difficulties right now. ${error.message?.includes('timeout') ? 'The request took too long to process.' : 'Please try rephrasing your request or try again in a moment.'}

In the meantime, you can:
• Check your current appointments manually
• Contact our office directly for urgent matters  
• Try a simpler request

I'll be back to full functionality shortly!`;
      }
    }
    
    // Generate suggestions based on the response and user role
    const suggestions = generateSuggestions(context?.userRole || 'patient', message, aiResponse);

    // Parse for appointment creation intent
    const appointmentData = parseAppointmentIntent(aiResponse, context);

    console.log('Sending successful response');

    return new Response(
      JSON.stringify({
        response: aiResponse,
        suggestions,
        appointmentData,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in schedule-ai-chat:', error);
    
    return new Response(
      JSON.stringify({ 
        error: false,
        response: `I apologize, but I'm experiencing technical difficulties. ${error.message?.includes('timeout') ? 'The request took too long to process.' : 'Please try again in a moment.'}

If you need the current date and time: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}

You can also:
• Check appointments manually
• Contact our office directly
• Try a simpler request`,
        suggestions: [
          "What's today's date?",
          "Check my appointments",
          "Contact office directly", 
          "Try again"
        ]
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

function buildSystemPrompt(context: any): string {
  const { userRole, scheduleData, userName } = context || {};
  const currentDateTime = new Date().toLocaleString();
  
  const basePrompt = `You are Schedule iQ, an AI assistant specialized in medical appointment scheduling. You have real-time access to appointment data and can help with booking, rescheduling, and schedule optimization.

IMPORTANT: Always be responsive and conversational. If a user asks for the current date/time, provide it immediately along with helpful scheduling context.

Current Context:
- Current Date/Time: ${currentDateTime}
- User: ${userName || 'User'} (Role: ${userRole || 'patient'})
- Today's appointments: ${scheduleData?.todaysAppointments || 0}
- Available slots today: ${scheduleData?.availableSlots || 0}
- Total providers: ${scheduleData?.totalActiveProviders || 0}

Guidelines:
- Always respond to user questions directly and promptly
- Be conversational and helpful
- If asked for date/time, provide it immediately
- Always confirm appointment details before suggesting creation
- Use real-time availability data when possible
- Keep responses concise but informative
- If you suggest creating an appointment, be specific about date, time, and provider`;

  if (userRole === 'patient') {
    return basePrompt + `

You're helping a patient with their appointments. Focus on:
- Answering questions about current date/time when asked
- Finding available appointment slots
- Explaining appointment types and durations
- Helping with rescheduling
- Providing appointment reminders and information`;
  } else {
    return basePrompt + `

You're helping medical staff manage schedules. Focus on:
- Answering questions about current date/time when asked
- Creating appointments for patients
- Optimizing provider schedules
- Managing waitlists and conflicts
- Providing scheduling analytics and insights`;
  }
}

function parseAppointmentIntent(aiResponse: string, context: any): any {
  const appointmentKeywords = ['book', 'schedule', 'appointment', 'create'];
  const hasAppointmentIntent = appointmentKeywords.some(keyword => 
    aiResponse.toLowerCase().includes(keyword)
  );

  if (!hasAppointmentIntent) {
    return null;
  }

  return {
    shouldCreate: false,
    patientName: context?.userName || 'Patient',
    email: context?.userEmail,
    appointmentType: 'consultation',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    duration: 60,
    notes: 'Scheduled via AI assistant'
  };
}

function generateSuggestions(userRole: string, userMessage: string, aiResponse: string): string[] {
  const lowerMessage = userMessage.toLowerCase();
  
  // Add date/time related suggestions if relevant
  if (lowerMessage.includes('date') || lowerMessage.includes('time')) {
    return [
      "Show today's schedule",
      "Book an appointment for today",
      "Check tomorrow's availability",
      "View this week's appointments"
    ];
  }
  
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
