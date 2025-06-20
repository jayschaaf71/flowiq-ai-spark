
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
    const { message, context, userProfile, enableAutomation } = await req.json();
    
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    const currentDateTime = new Date().toLocaleString();
    
    // Create enhanced role-specific system prompt with automatic appointment creation capability
    const getRoleSpecificPrompt = (role: string, profile: any, context: any, enableAutomation: boolean) => {
      const basePrompt = `You are Schedule iQ, an advanced AI assistant specialized in appointment scheduling and calendar management for healthcare practices. You have access to REAL-TIME scheduling data and can ${enableAutomation ? 'AUTOMATICALLY CREATE APPOINTMENTS' : 'provide specific recommendations'} based on actual appointment and availability information.

${enableAutomation ? `
🤖 AUTOMATIC APPOINTMENT CREATION ENABLED 🤖
You can create appointments automatically when users request booking. When you decide to create an appointment, respond with your normal message AND include this JSON structure at the end:

APPOINTMENT_CREATE:{
  "createAppointment": true,
  "appointmentData": {
    "patientName": "Patient Name",
    "patientId": "patient_id_if_available",
    "email": "patient@email.com",
    "phone": "patient_phone_if_available",
    "date": "YYYY-MM-DD",
    "time": "H:MM",
    "duration": 60,
    "appointmentType": "consultation",
    "providerId": "provider_id",
    "providerName": "Provider Name",
    "notes": "AI scheduled appointment"
  }
}

When creating appointments automatically:
- Always use actual available slots from the context data
- Include patient contact information for confirmations
- Select appropriate providers based on availability and specialty
- Set realistic appointment durations
- Include helpful notes about the AI scheduling
` : ''}

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
  `- ${provider.providerName} (${provider.specialty}) [ID: ${provider.providerId}]: ${provider.todayAvailable} slots today, ${provider.tomorrowAvailable} tomorrow`
).join('\n') : 'No provider availability data available'}

NEXT AVAILABLE SLOTS:
${context?.nextAvailableSlots ? context.nextAvailableSlots.map((provider: any) => 
  `- ${provider.provider} (${provider.specialty}) [ID: ${provider.providerId}]: ${provider.slots.map((slot: any) => slot.time).join(', ')}`
).join('\n') : 'No immediate availability found'}

ACTIVE PROVIDERS DATA:
${context?.providersData ? context.providersData.map((provider: any) => 
  `- ${provider.first_name} ${provider.last_name} [ID: ${provider.id}] - ${provider.specialty} (${provider.email})`
).join('\n') : 'No provider data available'}

User Information:
- Name: ${profile?.first_name || 'User'} ${profile?.last_name || ''}
- Role: ${role}
- Email: ${profile?.email || 'N/A'}
- Phone: ${profile?.phone || 'N/A'}`;

      if (role === 'patient') {
        return `${basePrompt}

PATIENT MODE - You are assisting a patient with their healthcare appointments using REAL-TIME data${enableAutomation ? ' and AUTOMATIC APPOINTMENT CREATION' : ''}.

Your Capabilities for Patients:
1. REAL-TIME AVAILABILITY: Check actual available appointment slots with specific providers and times
2. ${enableAutomation ? 'AUTOMATIC BOOKING: Create appointments instantly using current availability data' : 'BOOKING ASSISTANCE: Help find and book appointments using current availability data'}
3. RESCHEDULING: Assist with changing appointment times based on real availability
4. PROVIDER MATCHING: Match patients with available providers based on specialty and availability
5. SPECIFIC SCHEDULING: Provide exact times and dates when providers are available
6. ${enableAutomation ? 'INSTANT CONFIRMATIONS: Automatically send confirmations and set up reminders' : 'REMINDERS: Help set up appointment notifications'}
7. APPOINTMENT DETAILS: Provide information about upcoming appointments

${enableAutomation ? `
AUTOMATIC BOOKING BEHAVIOR:
- When a patient asks to "book" or "schedule" an appointment, CREATE IT AUTOMATICALLY
- Use the patient's profile information (name, email, phone) for the booking
- Select the best available provider and time slot
- Always confirm the appointment details in your response
- Mention that confirmations and reminders will be sent automatically
` : ''}

Communication Style:
- Be warm, friendly, and patient-focused
- Use SPECIFIC times and dates from real availability data
- ${enableAutomation ? 'Confirm appointment creation with specific details' : 'Provide ACTUAL appointment slots, not generic responses'}
- Match patients with available providers and their specialties
- Always use the real-time context data provided
- When ${enableAutomation ? 'creating' : 'suggesting'} appointments, give specific times like "I've ${enableAutomation ? 'booked you with' : 'found that'} Dr. Smith ${enableAutomation ? 'for' : 'has availability'} tomorrow at 10:30 AM"

IMPORTANT: Always use the real availability data provided in the context. If there are available slots${enableAutomation ? ', book them automatically when requested' : ', mention them specifically with times, providers, and specialties'}. Never give generic "no availability" responses when real data shows available slots.`;

      } else {
        return `${basePrompt}

STAFF MODE - You are assisting healthcare staff with practice management using REAL-TIME data${enableAutomation ? ' and AUTOMATIC APPOINTMENT CREATION' : ''}.

Your Full Capabilities for Staff:
1. ${enableAutomation ? 'AUTOMATIC APPOINTMENT CREATION: Create appointments instantly for patients using current availability data' : 'REAL-TIME SCHEDULING: Book, reschedule, cancel appointments using current availability data'}
2. LIVE OPTIMIZATION: Analyze and optimize scheduling patterns based on actual bookings
3. PROVIDER MANAGEMENT: Manage provider schedules using real working hours and availability
4. CONFLICT RESOLUTION: Identify and resolve scheduling conflicts using live data
5. AVAILABILITY ANALYSIS: Provide detailed availability reports with specific time slots
6. PATIENT MANAGEMENT: Access patient scheduling history and preferences
7. PERFORMANCE ANALYTICS: Generate insights from real appointment data
8. WORKFLOW OPTIMIZATION: Suggest improvements based on actual scheduling patterns
9. ${enableAutomation ? 'BULK OPERATIONS: Create multiple appointments efficiently with automated confirmations' : 'REMINDER MANAGEMENT: Set up automated reminder systems'}

${enableAutomation ? `
AUTOMATIC BOOKING BEHAVIOR FOR STAFF:
- When staff asks to "book for a patient" or "create an appointment", DO IT AUTOMATICALLY
- Ask for patient details if not provided (name, email, phone)
- Use real availability data to select appropriate slots
- Choose providers based on specialty and availability
- Always confirm appointment creation with specific details
- Mention that confirmations and reminders are handled automatically
` : ''}

Communication Style:
- Be professional and data-driven
- Provide specific metrics and real numbers from the context
- Use actual appointment data and availability information
- ${enableAutomation ? 'Confirm appointment creations with complete details' : 'Offer actionable insights based on current scheduling patterns'}
- Reference specific providers, times, and availability when discussing scheduling
- ${enableAutomation ? 'Efficiently handle bulk appointment requests' : 'Provide detailed scheduling recommendations'}

IMPORTANT: Always reference the real-time data provided in the context. Use specific numbers, provider names, and availability slots in your responses. ${enableAutomation ? 'When creating appointments, use actual provider IDs and available time slots from the context data.' : 'Provide actionable insights based on the actual scheduling data.'}`;
      }
    };

    const systemPrompt = getRoleSpecificPrompt(userProfile?.role || 'patient', userProfile, context, enableAutomation);

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
    const suggestions = generateContextAwareSuggestions(message, aiResponse, context, userProfile?.role, enableAutomation);

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

function generateContextAwareSuggestions(userMessage: string, aiResponse: string, context: any, userRole: string, enableAutomation: boolean): string[] {
  const lowerMessage = userMessage.toLowerCase();
  const suggestions = new Set<string>();

  if (userRole === 'patient') {
    // Patient-specific suggestions based on real data with automation
    if (lowerMessage.includes('book') || lowerMessage.includes('schedule') || lowerMessage.includes('appointment')) {
      if (enableAutomation) {
        if (context?.nextAvailableSlots && context.nextAvailableSlots.length > 0) {
          suggestions.add(`Book automatically with ${context.nextAvailableSlots[0].provider}`);
          suggestions.add("Create appointment with any available provider");
        }
        suggestions.add("Schedule my next appointment automatically");
        suggestions.add("Book appointment and send confirmations");
      } else {
        if (context?.nextAvailableSlots && context.nextAvailableSlots.length > 0) {
          suggestions.add(`Book with ${context.nextAvailableSlots[0].provider}`);
          suggestions.add("Compare provider availability");
        }
        suggestions.add("Show me all available times this week");
        suggestions.add("Check provider specialties");
      }
    }
    
    if (lowerMessage.includes('available') || lowerMessage.includes('next')) {
      if (enableAutomation && context?.availableSlots > 0) {
        suggestions.add("Book the earliest available slot automatically");
        suggestions.add("Create appointment with first available provider");
      } else if (context?.availableSlots > 0) {
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

    // Default patient suggestions with automation awareness
    if (suggestions.size === 0) {
      if (enableAutomation) {
        if (context?.availableSlots > 0) {
          suggestions.add("Book next available appointment automatically");
          suggestions.add("Create appointment with confirmations");
        } else {
          suggestions.add("Auto-book appointment for tomorrow");
          suggestions.add("Schedule appointment next week automatically");
        }
        suggestions.add("Set up automated appointment reminders");
      } else {
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
    }
  } else {
    // Staff-specific suggestions based on real data with automation
    if (lowerMessage.includes('book') || lowerMessage.includes('create') || lowerMessage.includes('schedule')) {
      if (enableAutomation) {
        if (context?.availableSlots > 0) {
          suggestions.add("Create appointment for patient automatically");
          suggestions.add("Book next available slot with confirmations");
        }
        suggestions.add("Set up multiple appointments automatically");
        suggestions.add("Bulk create appointments with reminders");
      } else {
        suggestions.add("Show detailed availability breakdown");
        suggestions.add("Help patient book appointment");
      }
    }
    
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

    // Context-aware staff suggestions with automation
    if (context?.todaysAppointments > 10) {
      suggestions.add("Manage high-volume day efficiently");
    }
    
    if (context?.availableSlots < 5) {
      suggestions.add("Find ways to increase availability");
    }

    // Default staff suggestions with automation awareness
    if (suggestions.size === 0) {
      if (enableAutomation) {
        if (context?.availableSlots > 0) {
          suggestions.add("Create appointment for patient automatically");
          suggestions.add("Book available slot with confirmations");
        }
        suggestions.add("Set up automated appointment workflow");
        suggestions.add("Create multiple appointments efficiently");
      } else {
        if (context?.availableSlots > 0) {
          suggestions.add("Review available slots");
          suggestions.add("Optimize appointment spacing");
        }
        suggestions.add("Check today's schedule status");
        suggestions.add("Analyze current booking trends");
      }
    }
  }

  return Array.from(suggestions).slice(0, 4);
}
