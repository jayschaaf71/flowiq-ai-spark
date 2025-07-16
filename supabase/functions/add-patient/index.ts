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
      firstName,
      lastName, 
      email, 
      phone,
      dateOfBirth,
      address,
      city,
      state,
      zipCode,
      insuranceProvider,
      insuranceNumber,
      emergencyContactName,
      emergencyContactPhone,
      medicalHistory,
      allergies,
      medications,
      gender
    } = await req.json();

    console.log('Adding new patient:', { firstName, lastName, email, phone });

    // Check if patient already exists
    const { data: existingPatient } = await supabase
      .from('patients')
      .select('id, first_name, last_name')
      .ilike('first_name', firstName)
      .ilike('last_name', lastName)
      .single();

    if (existingPatient) {
      return new Response(JSON.stringify({
        success: false,
        error: `Patient ${firstName} ${lastName} already exists in the system`,
        existingPatient: existingPatient
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate patient number
    const patientNumber = `PAT-${Date.now()}`;

    // Create new patient
    const { data: newPatient, error: patientError } = await supabase
      .from('patients')
      .insert({
        first_name: firstName,
        last_name: lastName,
        email: email || null,
        phone: phone || null,
        date_of_birth: dateOfBirth || null,
        address: address || null,
        city: city || null,
        state: state || null,
        zip_code: zipCode || null,
        insurance_provider: insuranceProvider || null,
        insurance_number: insuranceNumber || null,
        emergency_contact_name: emergencyContactName || null,
        emergency_contact_phone: emergencyContactPhone || null,
        medical_history: medicalHistory || null,
        allergies: allergies || null,
        medications: medications || null,
        gender: gender || null,
        patient_number: patientNumber,
        is_active: true
      })
      .select()
      .single();

    if (patientError) {
      console.error('Error creating patient:', patientError);
      throw new Error(`Failed to create patient: ${patientError.message}`);
    }

    console.log('Patient created successfully:', newPatient);

    return new Response(JSON.stringify({
      success: true,
      message: `Patient ${firstName} ${lastName} has been successfully added to the system`,
      patient: newPatient
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in add-patient function:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});