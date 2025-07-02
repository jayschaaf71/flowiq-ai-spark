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
        name: "search_patients",
        description: "Search for patients by name or email",
        parameters: {
          type: "object",
          properties: {
            query: { type: "string", description: "Search query (name or email)" }
          },
          required: ["query"]
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
              case 'create_appointment':
                functionResult = await createAppointment(supabase, functionArgs);
                break;
              case 'search_patients':
                functionResult = await searchPatients(supabase, functionArgs);
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