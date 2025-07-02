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

    const { 
      patientId, 
      providerId, 
      appointmentTypeId,
      date, 
      time, 
      duration = 60,
      notes 
    } = await req.json()

    // Validate provider availability
    const appointmentDateTime = new Date(`${date}T${time}`)
    const dayOfWeek = appointmentDateTime.getDay()
    
    const { data: availability, error: availabilityError } = await supabase
      .from('provider_schedules')
      .select('*')
      .eq('provider_id', providerId)
      .eq('day_of_week', dayOfWeek)
      .eq('is_available', true)

    if (availabilityError) {
      throw new Error('Error checking provider availability')
    }

    if (!availability || availability.length === 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Provider not available on selected day' 
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check for conflicting appointments
    const endTime = new Date(appointmentDateTime.getTime() + (duration * 60000))
    
    const { data: conflicts, error: conflictError } = await supabase
      .from('appointments')
      .select('*')
      .eq('provider_id', providerId)
      .eq('date', date)
      .neq('status', 'cancelled')
      .gte('time', time)
      .lt('time', endTime.toTimeString().slice(0, 5))

    if (conflictError) {
      throw new Error('Error checking appointment conflicts')
    }

    if (conflicts && conflicts.length > 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Time slot not available - conflicts with existing appointment' 
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get appointment type details
    const { data: appointmentType } = await supabase
      .from('appointment_types')
      .select('*')
      .eq('id', appointmentTypeId)
      .single()

    // Get patient and provider details
    const { data: patient } = await supabase
      .from('patients')
      .select('first_name, last_name')
      .eq('id', patientId)
      .single()

    // Create appointment
    const appointmentData = {
      patient_id: patientId,
      provider_id: providerId,
      title: `${appointmentType?.name || 'Appointment'} - ${patient?.first_name} ${patient?.last_name}`,
      appointment_type: appointmentType?.name || 'consultation',
      date,
      time,
      duration,
      status: 'confirmed',
      notes
    }

    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .insert(appointmentData)
      .select(`
        *,
        patients (first_name, last_name, email, phone),
        providers (first_name, last_name, title)
      `)
      .single()

    if (appointmentError) {
      console.error('Error creating appointment:', appointmentError)
      throw appointmentError
    }

    // Send confirmation email (would integrate with email service)
    console.log('Appointment booked successfully:', appointment)

    return new Response(
      JSON.stringify({ 
        success: true, 
        appointment,
        message: 'Appointment booked successfully' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error booking appointment:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to book appointment' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})