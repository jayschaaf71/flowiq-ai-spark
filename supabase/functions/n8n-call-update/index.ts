import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

console.log("N8N Call Update function started")

interface VAPICallData {
  call_id: string
  status: string
  transcript: string
  timestamp?: string
  // Customer data is optional since VAPI doesn't always provide it
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Parse request body
    const requestData: VAPICallData = await req.json()
    console.log('Received VAPI webhook data:', requestData)

    // Validate required fields (only call_id and status are required now)
    if (!requestData.call_id || !requestData.status) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: call_id and status are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Step 1: Handle patient identification and creation
    let patientId: string | null = null
    
    // If phone number is provided, try to find existing patient
    if (requestData.phone) {
      const { data: existingPatient, error: patientSearchError } = await supabase
        .from('patients')
        .select('id')
        .eq('phone', requestData.phone)
        .maybeSingle()

      if (patientSearchError) {
        console.error('Error searching for patient:', patientSearchError)
        return new Response(
          JSON.stringify({ error: 'Failed to search for existing patient', details: patientSearchError.message }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      if (existingPatient) {
        patientId = existingPatient.id
        console.log('Found existing patient:', patientId)
      }
    }

    // If no patient found or no phone provided, create new patient (only if we have some patient data)
    if (!patientId && (requestData.phone || requestData.email || requestData.first_name || requestData.last_name)) {
      const { data: newPatient, error: patientCreateError } = await supabase
        .from('patients')
        .insert({
          first_name: requestData.first_name || null,
          last_name: requestData.last_name || null,
          email: requestData.email || null,
          phone: requestData.phone || null,
          tenant_id: null
        })
        .select('id')
        .single()

      if (patientCreateError) {
        console.error('Error creating patient:', patientCreateError)
        return new Response(
          JSON.stringify({ error: 'Failed to create new patient', details: patientCreateError.message }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      patientId = newPatient.id
      console.log('Created new patient:', patientId)
    }

    // Step 2: Insert new voice call record
    const { data: voiceCallData, error: voiceCallError } = await supabase
      .from('voice_calls')
      .insert({
        call_id: requestData.call_id,
        patient_id: patientId,
        call_type: 'inbound', // Default value, adjust as needed
        call_status: requestData.status,
        transcript: requestData.transcript
      })
      .select()
      .single()

    if (voiceCallError) {
      console.error('Error creating voice call:', voiceCallError)
      return new Response(
        JSON.stringify({ error: 'Failed to create voice call record', details: voiceCallError.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Created voice call record:', voiceCallData)

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Call processed successfully',
        patient_id: patientId,
        voice_call_id: voiceCallData.id,
        call_id: requestData.call_id
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Unexpected error in N8N call update:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})