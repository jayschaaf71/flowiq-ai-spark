
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

    const currentDateTime = new Date().toLocaleString();
    const systemPrompt = `You are Schedule iQ, an advanced AI assistant specialized in appointment scheduling and calendar management for healthcare practices. You have access to real-time scheduling data and can provide specific, actionable recommendations.

Current Context:
- Current Date/Time: ${currentDateTime}
- Today's Appointments: ${context?.todaysAppointments || 0}
- Total Appointments This Week: ${context?.appointments || 0}
- Active Providers: ${context?.providers || 'Loading...'}
- Available Time Slots Today: ${context?.availableSlots || 0}

Your Capabilities:
1. SCHEDULING: Book, reschedule, cancel appointments
2. OPTIMIZATION: Analyze and optimize scheduling patterns
3. AVAILABILITY: Check provider and time slot availability
4. CONFLICTS: Identify and resolve scheduling conflicts
5. REMINDERS: Manage appointment notifications
6. ANALYTICS: Provide scheduling insights and patterns
7. WORKFLOW: Suggest process improvements
8. EMERGENCY: Handle urgent scheduling needs

Communication Style:
- Be professional but conversational
- Provide specific, actionable suggestions
- Use data from the context to give precise recommendations
- Always offer multiple options when possible
- Be proactive in identifying potential issues or improvements

Response Format:
- Start with a direct answer to their question
- Provide specific recommendations based on current data
- Offer relevant follow-up actions
- Include time-sensitive information when applicable

If you need more specific information to help effectively, ask targeted questions about:
- Specific dates/times they're interested in
- Which providers they prefer
- Type of appointment needed
- Urgency level
- Patient preferences`;

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
    const aiResponse = data.choices[0].message.content;

    // Generate intelligent suggestions based on the conversation
    const suggestions = generateIntelligentSuggestions(message, aiResponse, context);

    return new Response(JSON.stringify({ 
      response: aiResponse,
      suggestions: suggestions,
      contextUsed: {
        todaysAppointments: context?.todaysAppointments || 0,
        availableSlots: context?.availableSlots || 0,
        providersActive: context?.providers ? context.providers.split(',').length : 0
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

function generateIntelligentSuggestions(userMessage: string, aiResponse: string, context: any): string[] {
  const lowerMessage = userMessage.toLowerCase();
  const lowerResponse = aiResponse.toLowerCase();
  const suggestions = new Set<string>();

  // Context-aware suggestions based on current state
  if (context?.todaysAppointments > 10) {
    suggestions.add("Optimize today's busy schedule");
  }
  
  if (context?.availableSlots < 3) {
    suggestions.add("Find more availability options");
  }

  // Intent-based suggestions
  if (lowerMessage.includes('book') || lowerMessage.includes('schedule') || lowerMessage.includes('appointment')) {
    suggestions.add("Show available time slots");
    suggestions.add("Check provider availability");
    suggestions.add("View patient preferences");
  }
  
  if (lowerMessage.includes('cancel') || lowerMessage.includes('reschedule') || lowerMessage.includes('change')) {
    suggestions.add("Find alternative times");
    suggestions.add("Check cancellation policy");
    suggestions.add("Notify affected patients");
  }
  
  if (lowerMessage.includes('remind') || lowerMessage.includes('notification') || lowerMessage.includes('alert')) {
    suggestions.add("Set up automated reminders");
    suggestions.add("Send immediate notifications");
    suggestions.add("Review reminder preferences");
  }

  if (lowerMessage.includes('optimize') || lowerMessage.includes('improve') || lowerMessage.includes('efficient')) {
    suggestions.add("Analyze scheduling patterns");
    suggestions.add("Suggest time block improvements");
    suggestions.add("Review provider utilization");
  }

  if (lowerMessage.includes('conflict') || lowerMessage.includes('double') || lowerMessage.includes('overlap')) {
    suggestions.add("Resolve scheduling conflicts");
    suggestions.add("Prevent future conflicts");
    suggestions.add("Review conflict settings");
  }

  // Response-based suggestions
  if (lowerResponse.includes('available') || lowerResponse.includes('slot')) {
    suggestions.add("Book the suggested time");
    suggestions.add("See more options");
  }

  if (lowerResponse.includes('busy') || lowerResponse.includes('full')) {
    suggestions.add("Add to waitlist");
    suggestions.add("Suggest alternative dates");
  }

  // Time-sensitive suggestions
  const hour = new Date().getHours();
  if (hour < 12) {
    suggestions.add("Plan morning appointments");
  } else if (hour > 16) {
    suggestions.add("Prepare tomorrow's schedule");
  }

  // Default helpful suggestions if none match
  if (suggestions.size === 0) {
    suggestions.add("Show today's schedule");
    suggestions.add("Find next available slot");
    suggestions.add("Check provider status");
    suggestions.add("Review upcoming appointments");
  }

  return Array.from(suggestions).slice(0, 4); // Limit to 4 most relevant
}
