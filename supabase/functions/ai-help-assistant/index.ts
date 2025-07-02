import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { CORS_HEADERS, AI_CONFIG } from './config.ts';
import { callOpenAI, getFollowUpResponse } from './openai-service.ts';
import { executeFunctions } from './function-executor.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
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

    // Call OpenAI with message and context
    const aiResponse = await callOpenAI(
      message, 
      context, 
      conversationHistory?.slice(-AI_CONFIG.maxHistoryMessages) || []
    );
    
    const choice = aiResponse.choices[0];
    const assistantMessage = choice.message;
    
    let finalResponse = assistantMessage.content || '';
    let functionResults: any[] = [];

    // Handle function calls if any
    if (assistantMessage.tool_calls) {
      functionResults = await executeFunctions(supabase, assistantMessage.tool_calls);
      
      // If functions were called, get a follow-up response from the AI
      if (functionResults.length > 0) {
        const followUpData = await getFollowUpResponse(
          message,
          context,
          conversationHistory?.slice(-AI_CONFIG.maxHistoryMessages) || [],
          assistantMessage,
          functionResults
        );
        
        if (followUpData) {
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
      { headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('AI help assistant error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      }
    );
  }
});

// Main edge function is now complete - helper functions moved to separate modules
  
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