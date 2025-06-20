
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
    
    // Create enhanced role-specific system prompt with real-time data
    const getRoleSpecificPrompt = (role: string, profile: any, context: any) => {
      const basePrompt = `You are Schedule iQ, an advanced AI assistant specialized in appointment scheduling and calendar management for healthcare practices. You have access to REAL-TIME scheduling data and can provide specific, actionable recommendations based on actual appointment and availability information.

REAL-TIME CONTEXT:
- Current Date/Time: ${currentDateTime}
- Today's Appointments: ${context?.todaysAppointments || 0}
- Available Slots Today: ${context?.availableSlots || 0}
- Total Appointments This Week: ${context?.appointments || 0}
- Active Providers: ${context?.totalActiveProviders || 0}
- Provider Details: ${context?.providers || 'Loading...'}
- Last Data Update: ${context?.realTimeData?.lastUpdated || 'Just now'}

REAL AVAILABILITY DATA:
${context?.availabilityDetails ? context.availabilityDetails.map((provider: any) => 
  `- ${provider.providerName} (${provider.specialty}): ${provider.todayAvailable} slots today, ${provider.tomorrowAvailable} tomorrow`
).join('\n') : 'No provider availability data available'}

NEXT AVAILABLE SLOTS:
${context?.nextAvailableSlots ? context.nextAvailableSlots.map((provider: any) => 
  `- ${provider.provider} (${provider.specialty}): ${provider.slots.map((slot: any) => slot.time).join(', ')}`
).join('\n') : 'No immediate availability found'}

User Information:
- Name: ${profile?.first_name || 'User'} ${profile?.last_name || ''}
- Role: ${role}
- Email: ${profile?.email || 'N/A'}`;

      if (role === 'patient') {
        return `${basePrompt}

PATIENT MODE - You are assisting a patient with their healthcare appointments using REAL-TIME data.

Your Capabilities for Patients:
1. REAL-TIME AVAILABILITY: Check actual available appointment slots with specific providers and times
2. BOOKING ASSISTANCE: Help find and book appointments using current availability data
3. RESCHEDULING: Assist with changing appointment times based on real availability
4. PROVIDER MATCHING: Match patients with available providers based on specialty and availability
5. SPECIFIC SCHEDULING: Provide exact times and dates when providers are available
6. REMINDERS: Help set up appointment notifications
7. APPOINTMENT DETAILS: Provide information about upcoming appointments

Communication Style:
- Be warm, friendly, and patient-focused
- Use SPECIFIC times and dates from real availability data
- Provide ACTUAL appointment slots, not generic responses
- Match patients with available providers and their specialties
- Always use the real-time context data provided
- When suggesting appointments, give specific times like "Dr. Smith has availability tomorrow at 10:30 AM and 2:15 PM"

IMPORTANT: Always use the real availability data provided in the context. If there are available slots, mention them specifically with times, providers, and specialties. Never give generic "no availability" responses when real data shows available slots.`;

      } else {
        return `${basePrompt}

STAFF MODE - You are assisting healthcare staff with practice management using REAL-TIME data.

Your Full Capabilities for Staff:
1. REAL-TIME SCHEDULING: Book, reschedule, cancel appointments using current availability data
2. LIVE OPTIMIZATION: Analyze and optimize scheduling patterns based on actual bookings
3. PROVIDER MANAGEMENT: Manage provider schedules using real working hours and availability
4. CONFLICT RESOLUTION: Identify and resolve scheduling conflicts using live data
5. AVAILABILITY ANALYSIS: Provide detailed availability reports with specific time slots
6. PATIENT MANAGEMENT: Access patient scheduling history and preferences
7. PERFORMANCE ANALYTICS: Generate insights from real appointment data
8. WORKFLOW OPTIMIZATION: Suggest improvements based on actual scheduling patterns

Communication Style:
- Be professional and data-driven
- Provide specific metrics and real numbers from the context
- Use actual appointment data and availability information
- Offer actionable insights based on current scheduling patterns
- Reference specific providers, times, and availability when discussing scheduling

IMPORTANT: Always reference the real-time data provided in the context. Use specific numbers, provider names, and availability slots in your responses. Provide actionable insights based on the actual scheduling data.`;
      }
    };

    const systemPrompt = getRoleSpecificPrompt(userProfile?.role || 'patient', userProfile, context);

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

    // Generate enhanced role-specific suggestions based on real data
    const suggestions = generateContextAwareSuggestions(message, aiResponse, context, userProfile?.role);

    return new Response(JSON.stringify({ 
      response: aiResponse,
      suggestions: suggestions,
      contextUsed: {
        todaysAppointments: context?.todaysAppointments || 0,
        availableSlots: context?.availableSlots || 0,
        providersActive: context?.totalActiveProviders || 0,
        userRole: userProfile?.role || 'patient',
        nextAvailableSlots: context?.nextAvailableSlots || [],
        realTimeData: true
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

function generateContextAwareSuggestions(userMessage: string, aiResponse: string, context: any, userRole: string): string[] {
  const lowerMessage = userMessage.toLowerCase();
  const suggestions = new Set<string>();

  if (userRole === 'patient') {
    // Patient-specific suggestions based on real data
    if (lowerMessage.includes('book') || lowerMessage.includes('schedule') || lowerMessage.includes('appointment')) {
      if (context?.nextAvailableSlots && context.nextAvailableSlots.length > 0) {
        suggestions.add(`Book with ${context.nextAvailableSlots[0].provider}`);
        suggestions.add("Compare provider availability");
      }
      suggestions.add("Show me all available times this week");
      suggestions.add("Check provider specialties");
    }
    
    if (lowerMessage.includes('available') || lowerMessage.includes('next')) {
      if (context?.availableSlots > 0) {
        suggestions.add("Show specific available times");
        suggestions.add("Book the earliest available slot");
      }
      suggestions.add("Check availability for next week");
      suggestions.add("Find availability with specific provider");
    }
    
    if (lowerMessage.includes('reschedule') || lowerMessage.includes('change')) {
      suggestions.add("Find alternative times");
      suggestions.add("Check cancellation policy");
      suggestions.add("See provider availability");
    }

    // Default patient suggestions with real data awareness
    if (suggestions.size === 0) {
      if (context?.availableSlots > 0) {
        suggestions.add("Book next available appointment");
        suggestions.add("See all available times today");
      } else {
        suggestions.add("Check availability for tomorrow");
        suggestions.add("Find appointments next week");
      }
      suggestions.add("View my upcoming appointments");
      suggestions.add("Set up appointment reminders");
    }
  } else {
    // Staff-specific suggestions based on real data
    if (lowerMessage.includes('availability') || lowerMessage.includes('schedule')) {
      if (context?.availableSlots > 0) {
        suggestions.add("Show detailed availability breakdown");
        suggestions.add("Optimize today's schedule");
      }
      suggestions.add("Check provider utilization");
      suggestions.add("Analyze booking patterns");
    }
    
    if (lowerMessage.includes('optimize') || lowerMessage.includes('improve')) {
      suggestions.add("Suggest schedule improvements");
      suggestions.add("Identify peak hours");
      suggestions.add("Review provider efficiency");
    }
    
    if (lowerMessage.includes('report') || lowerMessage.includes('analytics')) {
      suggestions.add("Generate availability report");
      suggestions.add("Show booking statistics");
      suggestions.add("Analyze no-show patterns");
    }

    // Context-aware staff suggestions
    if (context?.todaysAppointments > 10) {
      suggestions.add("Manage high-volume day");
    }
    
    if (context?.availableSlots < 5) {
      suggestions.add("Find ways to increase availability");
    }

    // Default staff suggestions with real data awareness
    if (suggestions.size === 0) {
      if (context?.availableSlots > 0) {
        suggestions.add("Review available slots");
        suggestions.add("Optimize appointment spacing");
      }
      suggestions.add("Check today's schedule status");
      suggestions.add("Analyze current booking trends");
    }
  }

  return Array.from(suggestions).slice(0, 4);
}
