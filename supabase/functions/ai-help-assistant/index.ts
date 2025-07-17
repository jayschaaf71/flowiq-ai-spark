import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  context?: string;
}

interface CalendarInsight {
  type: 'missing_prep' | 'unconfirmed' | 'schedule_gap' | 'overdue_follow_up';
  appointment_id?: string;
  patient_name?: string;
  details: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  suggested_action: string;
}

// Calendar Intelligence Functions
async function getCalendarInsights(supabase: any, userMessage: string): Promise<string> {
  try {
    const insights: CalendarInsight[] = [];
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Get upcoming appointments with preparation status
    const { data: appointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select(`
        id,
        date,
        time,
        patient_name,
        title,
        status,
        appointment_type,
        appointment_preparation_status (
          intake_completed,
          insurance_verified,
          contact_confirmed,
          missing_items,
          preparation_score
        )
      `)
      .gte('date', now.toISOString().split('T')[0])
      .lte('date', nextWeek.toISOString().split('T')[0])
      .order('date', { ascending: true });

    if (appointmentsError) {
      console.error('Error fetching appointments:', appointmentsError);
      return 'Calendar data temporarily unavailable.';
    }

    // Analyze appointments for issues
    appointments?.forEach((apt: any) => {
      const prepStatus = apt.appointment_preparation_status?.[0];
      
      // Check for missing preparation
      if (!prepStatus || prepStatus.preparation_score < 80) {
        insights.push({
          type: 'missing_prep',
          appointment_id: apt.id,
          patient_name: apt.patient_name,
          details: `${apt.patient_name} has ${apt.appointment_type} on ${apt.date} at ${apt.time}`,
          priority: apt.date === now.toISOString().split('T')[0] ? 'urgent' : 'high',
          suggested_action: `Send intake reminder and verify ${prepStatus?.missing_items?.join(', ') || 'insurance information'}`
        });
      }

      // Check for unconfirmed appointments
      if (apt.status !== 'confirmed' && apt.status !== 'completed') {
        insights.push({
          type: 'unconfirmed',
          appointment_id: apt.id,
          patient_name: apt.patient_name,
          details: `${apt.patient_name} appointment on ${apt.date} needs confirmation`,
          priority: 'medium',
          suggested_action: 'Send confirmation SMS or call patient'
        });
      }
    });

    // Generate context summary
    if (insights.length === 0) {
      return 'All upcoming appointments appear to be well-prepared and confirmed.';
    }

    const summaryLines = insights.slice(0, 5).map(insight => 
      `• ${insight.details} - ${insight.suggested_action}`
    );

    return `UPCOMING CALENDAR INSIGHTS (${insights.length} items need attention):
${summaryLines.join('\n')}`;

  } catch (error) {
    console.error('Error getting calendar insights:', error);
    return 'Calendar analysis temporarily unavailable.';
  }
}

async function createSageTask(supabase: any, taskData: {
  appointment_id?: string;
  patient_id?: string;
  task_type: string;
  description: string;
  priority: string;
}) {
  try {
    const { data, error } = await supabase
      .from('sage_calendar_tasks')
      .insert({
        ...taskData,
        sage_context: {
          created_by: 'sage_ai',
          timestamp: new Date().toISOString()
        }
      });

    if (error) {
      console.error('Error creating SAGE task:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in createSageTask:', error);
    return null;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    console.error('OpenAI API key not configured');
    return new Response(JSON.stringify({ 
      error: 'OpenAI API key not configured' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { message, context, conversationHistory, specialty, brandName, authToken } = await req.json();
    
    console.log('Processing help request:', message);

    // Initialize Supabase client for calendar intelligence
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
        global: {
          headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
        },
      }
    );

    // Get calendar insights if requested
    let calendarContext = '';
    if (message.toLowerCase().includes('appointment') || 
        message.toLowerCase().includes('schedule') || 
        message.toLowerCase().includes('calendar') ||
        message.toLowerCase().includes('missing') ||
        message.toLowerCase().includes('prep') ||
        message.toLowerCase().includes('confirm')) {
      
      calendarContext = await getCalendarInsights(supabase, message);
    }

    // Enhanced system prompt with calendar intelligence
    const systemPrompt = `You are SAGE, an intelligent AI assistant for ${brandName || 'FlowiQ'} with advanced calendar and patient management capabilities.

CALENDAR INTELLIGENCE CAPABILITIES:
- Analyze upcoming appointments for missing preparation requirements
- Identify unconfirmed appointments that need attention
- Suggest optimal scheduling and patient outreach strategies
- Generate automated tasks for appointment follow-ups
- Provide provider daily summaries and patient briefings

CORE FUNCTIONS:
1. **Appointment Analysis**: I can identify appointments missing intake forms, insurance verification, or patient confirmations
2. **Proactive Communication**: I can suggest and initiate SMS, email, or voice outreach to patients
3. **Provider Support**: I can generate daily schedules with patient context and preparation requirements
4. **Task Management**: I can create and track follow-up tasks automatically

CURRENT CALENDAR CONTEXT:
${calendarContext}

When users ask about scheduling, appointments, or patient preparation:
- Provide specific, actionable recommendations
- Suggest communication strategies (SMS, email, calls)
- Identify potential scheduling conflicts or opportunities
- Generate automated tasks when appropriate

Be conversational, specific, and proactive. Focus on actionable solutions.

Context: ${context}
Specialty: ${specialty}
Brand: ${brandName}`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.slice(-5).map((msg: ChatMessage) => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      { role: "user", content: message }
    ];

    console.log('Calling OpenAI with calendar intelligence...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.5,
        max_tokens: 150
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', response.status, errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response received');

    const aiResponse = data.choices[0].message.content;

    console.log('AI Help response generated successfully');

    return new Response(JSON.stringify({
      response: aiResponse,
      success: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-help-assistant function:', error);
    return new Response(JSON.stringify({
      error: error.message,
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});