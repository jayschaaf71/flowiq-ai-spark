
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context } = await req.json();
    
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = `You are Schedule iQ, an AI assistant specialized in appointment scheduling and calendar management. You have access to the following scheduling context:

Current Context:
- Today's date: ${new Date().toLocaleDateString()}
- Available appointments: ${context?.appointments || 'Loading...'}
- Available providers: ${context?.providers || 'Loading...'}
- Available time slots: ${context?.availableSlots || 'Loading...'}

You can help with:
1. Booking new appointments
2. Finding available time slots
3. Rescheduling existing appointments
4. Optimizing schedules
5. Managing appointment conflicts
6. Sending reminders
7. Analyzing schedule patterns
8. Provider availability

Always be helpful, professional, and provide specific actionable suggestions. If you need more information to complete a task, ask clarifying questions.`;

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
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ 
      response: aiResponse,
      suggestions: generateSuggestions(message, aiResponse)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in schedule-ai-chat:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      response: "I'm sorry, I'm having trouble connecting to my AI services right now. Please try again in a moment."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateSuggestions(userMessage: string, aiResponse: string): string[] {
  const lowerMessage = userMessage.toLowerCase();
  const suggestions = [];

  if (lowerMessage.includes('book') || lowerMessage.includes('appointment')) {
    suggestions.push("Show me available time slots");
    suggestions.push("Check provider availability");
  }
  
  if (lowerMessage.includes('schedule') || lowerMessage.includes('calendar')) {
    suggestions.push("Optimize my schedule");
    suggestions.push("Show today's appointments");
  }
  
  if (lowerMessage.includes('reschedule') || lowerMessage.includes('change')) {
    suggestions.push("Find alternative time slots");
    suggestions.push("Check for conflicts");
  }
  
  if (lowerMessage.includes('remind') || lowerMessage.includes('notification')) {
    suggestions.push("Send appointment reminders");
    suggestions.push("Set up automated notifications");
  }

  // Add some default suggestions if none match
  if (suggestions.length === 0) {
    suggestions.push("Show my schedule for today");
    suggestions.push("Find next available appointment");
    suggestions.push("Optimize my calendar");
  }

  return suggestions.slice(0, 4); // Limit to 4 suggestions
}
