import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SageRequest {
  message: string;
  userId: string;
  specialty: string;
  conversationHistory?: Array<{role: string; content: string}>;
}

interface SageAction {
  type: 'search_patients' | 'schedule_appointment' | 'generate_document' | 'provide_guidance' | 'general_chat';
  parameters?: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { message, userId, specialty, conversationHistory = [] }: SageRequest = await req.json();
    
    if (!message || !userId) {
      throw new Error('Message and userId are required');
    }

    console.log('Sage AI processing request for user:', userId, 'Specialty:', specialty);

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user profile and tenant info
    const { data: profile } = await supabase
      .from('profiles')
      .select('*, current_tenant_id')
      .eq('id', userId)
      .single();

    if (!profile) {
      throw new Error('User profile not found');
    }

    // Determine the intent and action needed
    const actionResponse = await determineAction(message, specialty, conversationHistory);
    
    let responseText = '';
    let actionData = null;

    switch (actionResponse.type) {
      case 'search_patients': {
        const searchResults = await searchPatients(supabase, actionResponse.parameters, profile.current_tenant_id);
        responseText = formatPatientSearchResults(searchResults);
        actionData = { type: 'patient_search', data: searchResults };
        break;
      }

      case 'schedule_appointment': {
        const schedulingResult = await handleScheduling(supabase, actionResponse.parameters, profile.current_tenant_id);
        responseText = formatSchedulingResult(schedulingResult);
        actionData = { type: 'scheduling', data: schedulingResult };
        break;
      }

      case 'generate_document': {
        const document = await generateDocument(actionResponse.parameters, specialty);
        responseText = formatDocumentResult(document);
        actionData = { type: 'document', data: document };
        break;
      }

      case 'provide_guidance': {
        const guidance = await provideClinicalGuidance(actionResponse.parameters, specialty);
        responseText = guidance;
        actionData = { type: 'guidance', data: guidance };
        break;
      }

      default:
        responseText = await generateGeneralResponse(message, specialty, conversationHistory);
        actionData = { type: 'chat', data: responseText };
    }

    // Log the interaction for learning
    await logInteraction(supabase, userId, message, responseText, actionResponse.type, profile.current_tenant_id);

    return new Response(
      JSON.stringify({
        response: responseText,
        action: actionData,
        timestamp: new Date().toISOString(),
        sage_status: 'success'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Sage AI error:', error);
    return new Response(
      JSON.stringify({
        error: error.message,
        response: "I apologize, but I encountered an error processing your request. Please try again or contact support if the issue persists.",
        sage_status: 'error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function determineAction(message: string, specialty: string, history: Array<{role: string; content: string}>): Promise<SageAction> {
  const systemPrompt = `You are Sage, an AI assistant for a ${specialty} practice. Analyze the user's message and determine what action is needed.

Available actions:
1. search_patients - When user asks about finding patients, patient records, or patient information
2. schedule_appointment - When user wants to schedule, reschedule, or check appointments
3. generate_document - When user needs letters, forms, reports, or other documents
4. provide_guidance - When user needs clinical guidance, protocols, or medical advice
5. general_chat - For general questions, greetings, or practice operations

Return JSON with: {"type": "action_type", "parameters": {...}}

Examples:
- "Find patient John Smith" → {"type": "search_patients", "parameters": {"query": "John Smith"}}
- "Schedule appointment for tomorrow" → {"type": "schedule_appointment", "parameters": {"timeframe": "tomorrow"}}
- "Generate insurance letter" → {"type": "generate_document", "parameters": {"document_type": "insurance_letter"}}
- "What's the protocol for sleep apnea?" → {"type": "provide_guidance", "parameters": {"topic": "sleep_apnea_protocol"}}`;

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
        ...history.slice(-6), // Keep last 6 messages for context
        { role: 'user', content: message }
      ],
      temperature: 0.1,
      response_format: { type: "json_object" }
    }),
  });

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

async function searchPatients(supabase: any, parameters: any, tenantId: string) {
  const { query } = parameters;
  
  let queryBuilder = supabase
    .from('patients')
    .select('id, first_name, last_name, email, phone, patient_number, date_of_birth, specialty')
    .eq('tenant_id', tenantId)
    .eq('is_active', true);

  if (query) {
    queryBuilder = queryBuilder.or(
      `first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%,patient_number.ilike.%${query}%`
    );
  }

  const { data, error } = await queryBuilder.limit(10);
  
  if (error) throw error;
  return data || [];
}

async function handleScheduling(supabase: any, parameters: any, tenantId: string) {
  const { timeframe, patientName, appointmentType } = parameters;
  
  // Get upcoming appointments
  const { data: appointments, error } = await supabase
    .from('appointments')
    .select('*, patient_name, provider')
    .eq('tenant_id', tenantId)
    .gte('date', new Date().toISOString().split('T')[0])
    .order('date', { ascending: true })
    .limit(20);

  if (error) throw error;

  // Get available time slots (simplified)
  const availableSlots = generateAvailableSlots(timeframe);

  return {
    upcoming_appointments: appointments || [],
    available_slots: availableSlots,
    suggestion: `I found ${appointments?.length || 0} upcoming appointments. Here are some available time slots for ${timeframe}.`
  };
}

async function generateDocument(parameters: any, specialty: string) {
  const { document_type, patient_info, content_requirements } = parameters;
  
  const templates = {
    insurance_letter: `[Practice Letterhead]

Date: ${new Date().toLocaleDateString()}

To: Insurance Provider
Re: Medical Necessity Letter

Dear Insurance Review Team,

This letter serves to document the medical necessity of treatment for the patient referenced above. Based on our clinical evaluation and the patient's medical history, the recommended treatment plan is both appropriate and necessary.

Clinical findings and treatment rationale will be detailed in the attached medical records and diagnostic reports.

Please contact our office if you require any additional information or documentation.

Sincerely,
[Provider Name]
[Practice Name]`,
    
    patient_letter: `[Practice Letterhead]

Date: ${new Date().toLocaleDateString()}

Dear [Patient Name],

Thank you for choosing our practice for your ${specialty} care. This letter serves to summarize your recent visit and provide important information regarding your treatment plan.

[Treatment summary and next steps to be customized based on patient needs]

Please don't hesitate to contact our office if you have any questions or concerns.

Best regards,
[Provider Name]
[Practice Name]`,
    
    referral_letter: `[Practice Letterhead]

Date: ${new Date().toLocaleDateString()}

To: [Referring Provider]
Re: Patient Referral

Dear Colleague,

Thank you for referring the above patient to our ${specialty} practice. We have completed our evaluation and are pleased to provide the following summary and recommendations.

[Clinical findings and recommendations to be customized]

We will continue to coordinate care and keep you informed of the patient's progress.

Warm regards,
[Provider Name]
[Practice Name]`
  };

  return {
    document_type,
    template: templates[document_type as keyof typeof templates] || templates.patient_letter,
    generated_at: new Date().toISOString(),
    customization_notes: `This ${document_type} template can be customized with specific patient information and clinical details.`
  };
}

async function provideClinicalGuidance(parameters: any, specialty: string) {
  const { topic } = parameters;
  
  const guidanceDatabase = {
    sleep_apnea_protocol: `Sleep Apnea Treatment Protocol for ${specialty}:

1. Initial Assessment:
   - Complete sleep history and Epworth Sleepiness Scale
   - Physical examination focusing on airway anatomy
   - Review of sleep study results (AHI, RDI, oxygen saturation)

2. Treatment Planning:
   - Mild OSA (AHI 5-15): Consider oral appliance therapy
   - Moderate OSA (AHI 15-30): Oral appliance or CPAP therapy
   - Severe OSA (AHI >30): CPAP first line, oral appliance if CPAP intolerant

3. Oral Appliance Therapy:
   - Custom-fitted mandibular advancement device
   - Gradual titration over 2-3 months
   - Follow-up sleep study after 3 months of therapy

4. Monitoring:
   - Regular follow-up appointments
   - Assess compliance and effectiveness
   - Monitor for side effects`,

    titration_protocol: `Oral Appliance Titration Protocol:

1. Initial Fitting:
   - Start at 70% of maximum protrusion
   - Ensure comfortable fit and proper retention
   - Patient education on care and use

2. Titration Schedule:
   - Week 1-2: Initial position, assess comfort
   - Week 3-4: Advance 1mm if tolerated
   - Week 5-8: Continue 1mm advances every 2 weeks
   - Monitor symptoms and side effects

3. Monitoring Parameters:
   - Symptom improvement (snoring, daytime sleepiness)
   - Comfort and compliance
   - Side effects (jaw pain, dental changes)

4. Endpoint Criteria:
   - Symptom resolution or maximum tolerated position
   - Follow-up sleep study recommended after 3 months`
  };

  return guidanceDatabase[topic as keyof typeof guidanceDatabase] || 
    `I can provide guidance on ${topic}. Please specify what aspect you'd like to know more about, and I'll share the relevant protocols and best practices for ${specialty}.`;
}

async function generateGeneralResponse(message: string, specialty: string, history: Array<{role: string; content: string}>) {
  const systemPrompt = `You are Sage, a helpful AI assistant for a ${specialty} practice. You're knowledgeable, professional, and friendly. Help with practice operations, answer questions, and provide support.

Key traits:
- Professional but approachable
- Knowledgeable about ${specialty} practices
- Helpful and solution-oriented
- Concise but thorough responses
- Always maintain patient privacy and HIPAA compliance`;

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
        ...history.slice(-8), // Keep last 8 messages for context
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 500
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

function generateAvailableSlots(timeframe: string) {
  const slots = [];
  const now = new Date();
  
  for (let i = 1; i <= 7; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i);
    
    slots.push({
      date: date.toISOString().split('T')[0],
      times: ['9:00 AM', '10:30 AM', '2:00 PM', '3:30 PM', '4:30 PM']
    });
  }
  
  return slots;
}

function formatPatientSearchResults(patients: any[]) {
  if (patients.length === 0) {
    return "I didn't find any patients matching your search criteria. Please try a different search term or check the spelling.";
  }

  let response = `I found ${patients.length} patient(s) matching your search:\n\n`;
  
  patients.forEach((patient, index) => {
    response += `${index + 1}. ${patient.first_name} ${patient.last_name}\n`;
    response += `   Patient #: ${patient.patient_number || 'N/A'}\n`;
    response += `   Email: ${patient.email || 'N/A'}\n`;
    response += `   Phone: ${patient.phone || 'N/A'}\n`;
    if (patient.date_of_birth) {
      response += `   DOB: ${patient.date_of_birth}\n`;
    }
    response += `\n`;
  });

  response += "Would you like me to help you with any specific actions for these patients?";
  return response;
}

function formatSchedulingResult(result: any) {
  const { upcoming_appointments, available_slots, suggestion } = result;
  
  let response = suggestion + "\n\n";
  
  if (upcoming_appointments.length > 0) {
    response += "**Upcoming Appointments:**\n";
    upcoming_appointments.slice(0, 5).forEach((apt: any) => {
      response += `• ${apt.date} at ${apt.time} - ${apt.patient_name || 'Patient'} (${apt.appointment_type || 'Appointment'})\n`;
    });
    response += "\n";
  }
  
  if (available_slots.length > 0) {
    response += "**Available Time Slots:**\n";
    available_slots.slice(0, 3).forEach((slot: any) => {
      response += `• ${slot.date}: ${slot.times.join(', ')}\n`;
    });
  }
  
  return response;
}

function formatDocumentResult(document: any) {
  return `I've generated a ${document.document_type.replace('_', ' ')} template for you:\n\n${document.template}\n\n${document.customization_notes}`;
}

async function logInteraction(supabase: any, userId: string, question: string, response: string, actionType: string, tenantId: string) {
  try {
    await supabase
      .from('sage_interactions')
      .insert({
        user_id: userId,
        tenant_id: tenantId,
        question,
        response,
        action_type: actionType,
        created_at: new Date().toISOString()
      });
  } catch (error) {
    console.error('Failed to log interaction:', error);
  }
}