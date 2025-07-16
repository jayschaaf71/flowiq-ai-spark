import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { 
      patientName, 
      patientPhone, 
      patientEmail, 
      appointmentDate, 
      appointmentTime, 
      appointmentType, 
      provider, 
      notes 
    } = await req.json();

    console.log('Creating appointment for:', { patientName, appointmentDate, appointmentTime });

    // First, try to find existing patient by name
    let patientId = null;
    if (patientName) {
      const nameParts = patientName.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');

      const { data: existingPatient } = await supabase
        .from('patients')
        .select('id')
        .ilike('first_name', firstName)
        .ilike('last_name', lastName)
        .single();

      if (existingPatient) {
        patientId = existingPatient.id;
        console.log('Found existing patient:', patientId);
      } else {
        // Create new patient if not found
        const { data: newPatient, error: patientError } = await supabase
          .from('patients')
          .insert({
            first_name: firstName,
            last_name: lastName,
            phone: patientPhone || null,
            email: patientEmail || null,
            patient_number: `PAT-${Date.now()}`,
            is_active: true
          })
          .select('id')
          .single();

        if (patientError) {
          console.error('Error creating patient:', patientError);
          throw new Error(`Failed to create patient: ${patientError.message}`);
        }

        patientId = newPatient.id;
        console.log('Created new patient:', patientId);
      }
    }

    // Create the appointment
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .insert({
        patient_id: patientId,
        patient_name: patientName,
        date: appointmentDate,
        time: appointmentTime,
        duration: 60, // Default 60 minutes
        appointment_type: appointmentType || 'consultation',
        provider: provider || 'Dr. Smith',
        phone: patientPhone || null,
        email: patientEmail || null,
        status: 'scheduled',
        notes: notes || null,
        title: `${appointmentType || 'Appointment'} with ${patientName}`
      })
      .select()
      .single();

    if (appointmentError) {
      console.error('Error creating appointment:', appointmentError);
      throw new Error(`Failed to create appointment: ${appointmentError.message}`);
    }

    console.log('Appointment created successfully:', appointment);

    return new Response(JSON.stringify({
      success: true,
      message: `Appointment successfully scheduled for ${patientName} on ${appointmentDate} at ${appointmentTime}`,
      appointment: appointment,
      patientId: patientId
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in create-appointment function:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});