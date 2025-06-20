
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context, userProfile } = await req.json();
    
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    const currentDateTime = new Date().toLocaleString();
    
    // Create role-specific system prompt
    const getRoleSpecificPrompt = (role: string, profile: any) => {
      const basePrompt = `You are Schedule iQ, an advanced AI assistant specialized in appointment scheduling and calendar management for healthcare practices. You have access to real-time scheduling data and can provide specific, actionable recommendations.

Current Context:
- Current Date/Time: ${currentDateTime}
- Today's Appointments: ${context?.todaysAppointments || 0}
- Total Appointments This Week: ${context?.appointments || 0}
- Active Providers: ${context?.providers || 'Loading...'}
- Available Time Slots Today: ${context?.availableSlots || 0}

User Information:
- Name: ${profile?.first_name || 'User'} ${profile?.last_name || ''}
- Role: ${role}
- Email: ${profile?.email || 'N/A'}`;

      if (role === 'patient') {
        return `${basePrompt}

PATIENT MODE - You are assisting a patient with their healthcare appointments.

Your Capabilities for Patients:
1. BOOKING: Help find and book appointments
2. RESCHEDULING: Assist with changing appointment times
3. INFORMATION: Provide appointment details and preparation instructions
4. AVAILABILITY: Check when providers are available
5. REMINDERS: Help set up appointment notifications
6. QUESTIONS: Answer general scheduling questions

Communication Style:
- Be warm, friendly, and patient-focused
- Use clear, non-medical language when possible
- Focus on the patient's needs and convenience
- Provide reassurance and helpful guidance
- Always prioritize patient privacy and comfort

Limitations:
- You cannot access other patients' information
- You cannot make changes that require staff approval
- You cannot provide medical advice
- You cannot access full provider schedules beyond availability

Patient-Focused Suggestions:
- "Find my next available appointment"
- "What do I need to know before my visit?"
- "Can I reschedule to a different time?"
- "Set up appointment reminders"`;

      } else {
        return `${basePrompt}

STAFF MODE - You are assisting healthcare staff with practice management.

Your Full Capabilities for Staff:
1. SCHEDULING: Book, reschedule, cancel appointments for any patient
2. OPTIMIZATION: Analyze and optimize scheduling patterns
3. AVAILABILITY: Manage provider schedules and time slots
4. CONFLICTS: Identify and resolve scheduling conflicts
5. REMINDERS: Manage appointment notifications for all patients
6. ANALYTICS: Provide scheduling insights and patterns
7. WORKFLOW: Suggest process improvements
8. EMERGENCY: Handle urgent scheduling needs
9. REPORTING: Generate scheduling reports and statistics
10. PATIENT MANAGEMENT: Access patient scheduling history

Communication Style:
- Be professional and efficient
- Provide detailed, actionable insights
- Use healthcare industry terminology appropriately
- Focus on practice efficiency and patient care
- Offer data-driven recommendations

Advanced Features:
- Access to full practice scheduling data
- Ability to make system-wide changes
- Provider performance analytics
- Revenue and utilization insights
- Bulk scheduling operations`;
      }
    };

    const systemPrompt = getRoleSpecificPrompt(userProfile?.role || 'patient', userProfile);

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

    // Generate role-specific suggestions
    const suggestions = generateRoleSpecificSuggestions(message, aiResponse, context, userProfile?.role);

    return new Response(JSON.stringify({ 
      response: aiResponse,
      suggestions: suggestions,
      contextUsed: {
        todaysAppointments: context?.todaysAppointments || 0,
        availableSlots: context?.availableSlots || 0,
        providersActive: context?.providers ? context.providers.split(',').length : 0,
        userRole: userProfile?.role || 'patient'
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

function generateRoleSpecificSuggestions(userMessage: string, aiResponse: string, context: any, userRole: string): string[] {
  const lowerMessage = userMessage.toLowerCase();
  const suggestions = new Set<string>();

  if (userRole === 'patient') {
    // Patient-specific suggestions
    if (lowerMessage.includes('book') || lowerMessage.includes('schedule') || lowerMessage.includes('appointment')) {
      suggestions.add("Find my next available appointment");
      suggestions.add("What providers are available?");
      suggestions.add("Check appointment requirements");
    }
    
    if (lowerMessage.includes('cancel') || lowerMessage.includes('reschedule') || lowerMessage.includes('change')) {
      suggestions.add("Find alternative appointment times");
      suggestions.add("Check cancellation policy");
      suggestions.add("What are my rescheduling options?");
    }
    
    if (lowerMessage.includes('remind') || lowerMessage.includes('notification')) {
      suggestions.add("Set up appointment reminders");
      suggestions.add("How will I be notified?");
    }

    // Default patient suggestions
    if (suggestions.size === 0) {
      suggestions.add("Book my next appointment");
      suggestions.add("Check my upcoming appointments");
      suggestions.add("What should I bring to my visit?");
      suggestions.add("Set up appointment reminders");
    }
  } else {
    // Staff-specific suggestions
    if (lowerMessage.includes('book') || lowerMessage.includes('schedule')) {
      suggestions.add("Show available time slots");
      suggestions.add("Check provider availability");
      suggestions.add("View scheduling conflicts");
    }
    
    if (lowerMessage.includes('optimize') || lowerMessage.includes('improve')) {
      suggestions.add("Analyze scheduling patterns");
      suggestions.add("Suggest time block improvements");
      suggestions.add("Review provider utilization");
    }
    
    if (lowerMessage.includes('report') || lowerMessage.includes('analytics')) {
      suggestions.add("Generate scheduling report");
      suggestions.add("Show appointment statistics");
      suggestions.add("Analyze no-show patterns");
    }

    // Context-aware staff suggestions
    if (context?.todaysAppointments > 10) {
      suggestions.add("Optimize today's busy schedule");
    }
    
    if (context?.availableSlots < 3) {
      suggestions.add("Find more availability options");
    }

    // Default staff suggestions
    if (suggestions.size === 0) {
      suggestions.add("Show today's schedule overview");
      suggestions.add("Find next available slot");
      suggestions.add("Check for scheduling conflicts");
      suggestions.add("Analyze appointment patterns");
    }
  }

  return Array.from(suggestions).slice(0, 4);
}
