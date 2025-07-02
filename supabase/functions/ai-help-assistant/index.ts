import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

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
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
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

ACTIONABLE CAPABILITIES:
You can perform actual actions in the system when staff requests:
- add_patient: Add new patients to the database
- create_appointment: Schedule appointments for existing patients
- search_patients: Find patients by name or email

SPECIFIC FEATURES TO EXPLAIN:
- Voice Input: Patients can speak their responses instead of typing in intake forms
- AI Processing: Voice gets automatically converted and formatted correctly
- Smart Scheduling: AI-powered conflict resolution and optimization
- Mobile-First Design: How to use the mobile app for patient check-ins
- Real-time Updates: Live data synchronization across the platform

RESPONSE GUIDELINES:
- Be conversational and helpful
- When staff asks you to perform actions (like "add a patient" or "create appointment"), use the available functions
- Always confirm action parameters with users before executing
- Provide step-by-step instructions when appropriate
- Mention specific UI elements (buttons, tabs, menus) when relevant
- If the user asks about a feature not yet implemented, politely explain and suggest alternatives
- Keep responses concise but thorough (200-400 words max)
- Use healthcare terminology appropriately
- Always prioritize patient privacy and HIPAA compliance in your guidance
- Include specific navigation paths like "Go to Intake iQ → Voice Intake tab"

Answer the user's question about using FlowiQ and perform actions when requested:`;

    // Define available functions for the AI to call
    const availableFunctions = [
      {
        name: "add_patient",
        description: "Add a new patient to the system",
        parameters: {
          type: "object",
          properties: {
            first_name: { type: "string", description: "Patient's first name" },
            last_name: { type: "string", description: "Patient's last name" },
            email: { type: "string", description: "Patient's email address" },
            phone: { type: "string", description: "Patient's phone number" },
            date_of_birth: { type: "string", description: "Patient's date of birth (YYYY-MM-DD)" },
            gender: { type: "string", enum: ["male", "female", "other"], description: "Patient's gender" }
          },
          required: ["first_name", "last_name", "email"]
        }
      },
      {
        name: "update_patient",
        description: "Update patient information",
        parameters: {
          type: "object",
          properties: {
            patient_id: { type: "string", description: "Patient ID to update" },
            first_name: { type: "string", description: "Patient's first name" },
            last_name: { type: "string", description: "Patient's last name" },
            email: { type: "string", description: "Patient's email address" },
            phone: { type: "string", description: "Patient's phone number" },
            date_of_birth: { type: "string", description: "Patient's date of birth (YYYY-MM-DD)" }
          },
          required: ["patient_id"]
        }
      },
      {
        name: "create_appointment",
        description: "Create a new appointment",
        parameters: {
          type: "object",
          properties: {
            patient_email: { type: "string", description: "Patient's email to find them" },
            appointment_type: { type: "string", description: "Type of appointment" },
            date: { type: "string", description: "Appointment date (YYYY-MM-DD)" },
            time: { type: "string", description: "Appointment time (HH:MM)" },
            title: { type: "string", description: "Appointment title/description" },
            duration: { type: "number", description: "Duration in minutes", default: 60 }
          },
          required: ["patient_email", "appointment_type", "date", "time", "title"]
        }
      },
      {
        name: "update_appointment",
        description: "Update or reschedule an appointment",
        parameters: {
          type: "object",
          properties: {
            appointment_id: { type: "string", description: "Appointment ID to update" },
            date: { type: "string", description: "New appointment date (YYYY-MM-DD)" },
            time: { type: "string", description: "New appointment time (HH:MM)" },
            status: { type: "string", enum: ["scheduled", "confirmed", "completed", "cancelled"], description: "Appointment status" },
            notes: { type: "string", description: "Appointment notes" }
          },
          required: ["appointment_id"]
        }
      },
      {
        name: "cancel_appointment",
        description: "Cancel an appointment",
        parameters: {
          type: "object",
          properties: {
            appointment_id: { type: "string", description: "Appointment ID to cancel" },
            reason: { type: "string", description: "Cancellation reason" }
          },
          required: ["appointment_id"]
        }
      },
      {
        name: "search_patients",
        description: "Search for patients by name or email",
        parameters: {
          type: "object",
          properties: {
            query: { type: "string", description: "Search query (name or email)" }
          },
          required: ["query"]
        }
      },
      {
        name: "search_appointments",
        description: "Search for appointments by date, patient, or status",
        parameters: {
          type: "object",
          properties: {
            date: { type: "string", description: "Search by date (YYYY-MM-DD)" },
            patient_email: { type: "string", description: "Search by patient email" },
            status: { type: "string", description: "Search by appointment status" },
            provider_id: { type: "string", description: "Search by provider ID" }
          }
        }
      },
      {
        name: "get_intake_submissions",
        description: "Get recent intake form submissions",
        parameters: {
          type: "object",
          properties: {
            limit: { type: "number", description: "Number of submissions to retrieve (default: 10)" },
            status: { type: "string", description: "Filter by status (pending, processed, etc.)" }
          }
        }
      },
      {
        name: "create_intake_form",
        description: "Create a new intake form",
        parameters: {
          type: "object",
          properties: {
            title: { type: "string", description: "Form title" },
            description: { type: "string", description: "Form description" },
            form_fields: { type: "array", description: "Array of form field objects" }
          },
          required: ["title", "form_fields"]
        }
      },
      {
        name: "get_claims_data",
        description: "Get claims information and statistics",
        parameters: {
          type: "object",
          properties: {
            status: { type: "string", description: "Filter by claim status" },
            date_from: { type: "string", description: "Start date (YYYY-MM-DD)" },
            date_to: { type: "string", description: "End date (YYYY-MM-DD)" },
            limit: { type: "number", description: "Number of claims to retrieve" }
          }
        }
      },
      {
        name: "send_notification",
        description: "Send a notification to a patient or staff member",
        parameters: {
          type: "object",
          properties: {
            recipient_email: { type: "string", description: "Recipient's email address" },
            type: { type: "string", enum: ["sms", "email"], description: "Notification type" },
            subject: { type: "string", description: "Notification subject" },
            message: { type: "string", description: "Notification message" }
          },
          required: ["recipient_email", "type", "message"]
        }
      },
      {
        name: "check_availability",
        description: "Check provider availability for scheduling",
        parameters: {
          type: "object",
          properties: {
            provider_id: { type: "string", description: "Provider ID to check" },
            date: { type: "string", description: "Date to check (YYYY-MM-DD)" },
            duration: { type: "number", description: "Appointment duration in minutes" }
          },
          required: ["date"]
        }
      }
    ];

    // Call OpenAI GPT with function calling capabilities
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
        tools: availableFunctions.map(func => ({ type: "function", function: func })),
        tool_choice: "auto",
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
    const choice = aiResponse.choices[0];
    const assistantMessage = choice.message;
    
    let finalResponse = assistantMessage.content || '';
    let functionResults: any[] = [];

    // Handle function calls if any
    if (assistantMessage.tool_calls) {
      for (const toolCall of assistantMessage.tool_calls) {
        if (toolCall.type === 'function') {
          const functionName = toolCall.function.name;
          const functionArgs = JSON.parse(toolCall.function.arguments);
          
          console.log(`Executing function: ${functionName}`, functionArgs);
          
          let functionResult;
          try {
            switch (functionName) {
              case 'add_patient':
                functionResult = await addPatient(supabase, functionArgs);
                break;
              case 'update_patient':
                functionResult = await updatePatient(supabase, functionArgs);
                break;
              case 'create_appointment':
                functionResult = await createAppointment(supabase, functionArgs);
                break;
              case 'update_appointment':
                functionResult = await updateAppointment(supabase, functionArgs);
                break;
              case 'cancel_appointment':
                functionResult = await cancelAppointment(supabase, functionArgs);
                break;
              case 'search_patients':
                functionResult = await searchPatients(supabase, functionArgs);
                break;
              case 'search_appointments':
                functionResult = await searchAppointments(supabase, functionArgs);
                break;
              case 'get_intake_submissions':
                functionResult = await getIntakeSubmissions(supabase, functionArgs);
                break;
              case 'create_intake_form':
                functionResult = await createIntakeForm(supabase, functionArgs);
                break;
              case 'get_claims_data':
                functionResult = await getClaimsData(supabase, functionArgs);
                break;
              case 'send_notification':
                functionResult = await sendNotification(supabase, functionArgs);
                break;
              case 'check_availability':
                functionResult = await checkAvailability(supabase, functionArgs);
                break;
              default:
                functionResult = { error: `Unknown function: ${functionName}` };
            }
            
            functionResults.push({
              function: functionName,
              args: functionArgs,
              result: functionResult
            });
            
          } catch (error) {
            console.error(`Error executing ${functionName}:`, error);
            functionResults.push({
              function: functionName,
              args: functionArgs,
              result: { error: error.message }
            });
          }
        }
      }
      
      // If functions were called, get a follow-up response from the AI
      if (functionResults.length > 0) {
        const followUpMessages = [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
          assistantMessage,
          ...functionResults.map(result => ({
            role: 'tool',
            tool_call_id: assistantMessage.tool_calls.find((tc: any) => tc.function.name === result.function)?.id,
            content: JSON.stringify(result.result)
          }))
        ];

        const followUpResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: followUpMessages,
            temperature: 0.3,
            max_tokens: 1000,
          }),
        });

        if (followUpResponse.ok) {
          const followUpData = await followUpResponse.json();
          finalResponse = followUpData.choices[0].message.content;
        }
      }
    }
    
    console.log('AI Help response generated successfully');

    return new Response(
      JSON.stringify({ 
        response: finalResponse,
        context: context,
        timestamp: new Date().toISOString(),
        actions_performed: functionResults
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

// Helper functions for AI actions
async function addPatient(supabase: any, args: any) {
  const { first_name, last_name, email, phone, date_of_birth, gender } = args;
  
  const { data, error } = await supabase
    .from('patients')
    .insert({
      first_name,
      last_name,
      email,
      phone,
      date_of_birth,
      gender
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { 
    success: true, 
    patient: data,
    message: `Successfully added patient ${first_name} ${last_name}` 
  };
}

async function createAppointment(supabase: any, args: any) {
  const { patient_email, appointment_type, date, time, title, duration = 60 } = args;
  
  // First find the patient by email
  const { data: patient, error: patientError } = await supabase
    .from('patients')
    .select('id')
    .eq('email', patient_email)
    .single();

  if (patientError || !patient) {
    return { success: false, error: `Patient with email ${patient_email} not found` };
  }

  const { data, error } = await supabase
    .from('appointments')
    .insert({
      patient_id: patient.id,
      appointment_type,
      date,
      time,
      title,
      duration,
      status: 'scheduled'
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { 
    success: true, 
    appointment: data,
    message: `Successfully created appointment "${title}" for ${date} at ${time}` 
  };
}

async function searchPatients(supabase: any, args: any) {
  const { query } = args;
  
  const { data, error } = await supabase
    .from('patients')
    .select('id, first_name, last_name, email, phone, date_of_birth')
    .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`)
    .limit(10);

  if (error) {
    return { success: false, error: error.message };
  }

  return { 
    success: true, 
    patients: data,
    count: data.length,
    message: `Found ${data.length} patients matching "${query}"` 
  };
}

async function updatePatient(supabase: any, args: any) {
  const { patient_id, ...updateData } = args;
  
  // Remove undefined fields
  const cleanUpdateData = Object.fromEntries(
    Object.entries(updateData).filter(([_, value]) => value !== undefined)
  );

  const { data, error } = await supabase
    .from('patients')
    .update(cleanUpdateData)
    .eq('id', patient_id)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { 
    success: true, 
    patient: data,
    message: `Successfully updated patient information` 
  };
}

async function updateAppointment(supabase: any, args: any) {
  const { appointment_id, ...updateData } = args;
  
  // Remove undefined fields
  const cleanUpdateData = Object.fromEntries(
    Object.entries(updateData).filter(([_, value]) => value !== undefined)
  );

  const { data, error } = await supabase
    .from('appointments')
    .update(cleanUpdateData)
    .eq('id', appointment_id)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { 
    success: true, 
    appointment: data,
    message: `Successfully updated appointment` 
  };
}

async function cancelAppointment(supabase: any, args: any) {
  const { appointment_id, reason } = args;
  
  const { data, error } = await supabase
    .from('appointments')
    .update({ 
      status: 'cancelled',
      notes: reason ? `Cancelled: ${reason}` : 'Cancelled'
    })
    .eq('id', appointment_id)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { 
    success: true, 
    appointment: data,
    message: `Successfully cancelled appointment` 
  };
}

async function searchAppointments(supabase: any, args: any) {
  const { date, patient_email, status, provider_id } = args;
  
  let query = supabase
    .from('appointments')
    .select(`
      id, 
      date, 
      time, 
      title, 
      status, 
      appointment_type,
      duration,
      patient_id,
      patients!inner(first_name, last_name, email)
    `)
    .limit(20);

  if (date) {
    query = query.eq('date', date);
  }
  
  if (patient_email) {
    query = query.eq('patients.email', patient_email);
  }
  
  if (status) {
    query = query.eq('status', status);
  }
  
  if (provider_id) {
    query = query.eq('provider_id', provider_id);
  }

  const { data, error } = await query;

  if (error) {
    return { success: false, error: error.message };
  }

  return { 
    success: true, 
    appointments: data,
    count: data.length,
    message: `Found ${data.length} appointments matching criteria` 
  };
}

async function getIntakeSubmissions(supabase: any, args: any) {
  const { limit = 10, status } = args;
  
  let query = supabase
    .from('intake_submissions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    return { success: false, error: error.message };
  }

  return { 
    success: true, 
    submissions: data,
    count: data.length,
    message: `Retrieved ${data.length} intake submissions` 
  };
}

async function createIntakeForm(supabase: any, args: any) {
  const { title, description, form_fields } = args;
  
  const { data, error } = await supabase
    .from('intake_forms')
    .insert({
      title,
      description,
      form_fields
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { 
    success: true, 
    form: data,
    message: `Successfully created intake form "${title}"` 
  };
}

async function getClaimsData(supabase: any, args: any) {
  const { status, date_from, date_to, limit = 20 } = args;
  
  let query = supabase
    .from('claims')
    .select(`
      id, 
      claim_number, 
      status, 
      total_amount, 
      service_date, 
      submitted_date,
      processing_status,
      ai_confidence_score,
      patients!inner(first_name, last_name, email)
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (status) {
    query = query.eq('status', status);
  }
  
  if (date_from) {
    query = query.gte('service_date', date_from);
  }
  
  if (date_to) {
    query = query.lte('service_date', date_to);
  }

  const { data, error } = await query;

  if (error) {
    return { success: false, error: error.message };
  }

  return { 
    success: true, 
    claims: data,
    count: data.length,
    message: `Retrieved ${data.length} claims` 
  };
}

async function sendNotification(supabase: any, args: any) {
  const { recipient_email, type, subject, message } = args;
  
  // Call the existing notification function
  const { data, error } = await supabase.functions.invoke('send-communication', {
    body: {
      to: recipient_email,
      type: type,
      subject: subject,
      message: message
    }
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { 
    success: true, 
    notification: data,
    message: `Successfully sent ${type} notification to ${recipient_email}` 
  };
}

async function checkAvailability(supabase: any, args: any) {
  const { provider_id, date, duration = 60 } = args;
  
  let query = supabase
    .from('appointments')
    .select('time, duration')
    .eq('date', date)
    .eq('status', 'scheduled');

  if (provider_id) {
    query = query.eq('provider_id', provider_id);
  }

  const { data, error } = await query;

  if (error) {
    return { success: false, error: error.message };
  }

  // Calculate available slots (simplified logic)
  const busySlots = data.map(apt => ({
    start: apt.time,
    duration: apt.duration
  }));

  return { 
    success: true, 
    busy_slots: busySlots,
    available: busySlots.length < 8, // Simplified availability check
    message: `Found ${busySlots.length} existing appointments on ${date}` 
  };
}