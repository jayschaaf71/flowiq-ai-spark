import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { submissionData, tenantId } = await req.json()

    console.log('Processing intake submission:', submissionData)

    // Create patient record from intake data
    const patientData = {
      tenant_id: tenantId,
      first_name: submissionData.firstName || submissionData.first_name,
      last_name: submissionData.lastName || submissionData.last_name,
      email: submissionData.email,
      phone: submissionData.phone,
      date_of_birth: submissionData.dateOfBirth || submissionData.date_of_birth,
      gender: submissionData.gender,
      address_line1: submissionData.address?.line1 || submissionData.address_line1,
      address_line2: submissionData.address?.line2 || submissionData.address_line2,
      city: submissionData.address?.city || submissionData.city,
      state: submissionData.address?.state || submissionData.state,
      zip_code: submissionData.address?.zipCode || submissionData.zip_code,
      emergency_contact_name: submissionData.emergencyContact?.name,
      emergency_contact_phone: submissionData.emergencyContact?.phone,
      emergency_contact_relationship: submissionData.emergencyContact?.relationship,
      insurance_provider: submissionData.insurance?.provider,
      insurance_member_id: submissionData.insurance?.memberId,
      insurance_group_number: submissionData.insurance?.groupNumber,
      medical_history: submissionData.medicalHistory || {}
    }

    // Insert patient record
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .insert(patientData)
      .select()
      .single()

    if (patientError) {
      console.error('Error creating patient:', patientError)
      throw patientError
    }

    // Update intake submission with patient ID
    const { error: updateError } = await supabase
      .from('intake_submissions')
      .update({ 
        patient_id: patient.id,
        status: 'processed'
      })
      .eq('id', submissionData.submissionId)

    if (updateError) {
      console.error('Error updating submission:', updateError)
    }

    // Create appointment if requested
    if (submissionData.appointmentRequest) {
      const appointmentData = {
        patient_id: patient.id,
        title: `Initial Consultation - ${patient.first_name} ${patient.last_name}`,
        appointment_type: submissionData.appointmentRequest.type || 'consultation',
        date: submissionData.appointmentRequest.preferredDate,
        time: submissionData.appointmentRequest.preferredTime,
        duration: 60,
        status: 'pending',
        notes: 'Created from intake form'
      }

      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .insert(appointmentData)
        .select()
        .single()

      if (appointmentError) {
        console.error('Error creating appointment:', appointmentError)
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          patient, 
          appointment,
          message: 'Patient created and appointment scheduled successfully' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        patient,
        message: 'Patient created successfully' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error processing intake:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to process intake submission' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})