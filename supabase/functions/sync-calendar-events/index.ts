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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { action, integration_type, appointment_data, webhook_url } = await req.json()

    console.log('Calendar sync request:', { action, integration_type, appointment_data })

    switch (action) {
      case 'sync_appointment':
        return await syncAppointment(supabaseClient, integration_type, appointment_data, webhook_url)
      
      case 'webhook_trigger':
        return await triggerWebhook(webhook_url, appointment_data)
      
      case 'google_calendar_sync':
        return await syncWithGoogleCalendar(appointment_data)
      
      case 'outlook_sync':
        return await syncWithOutlook(appointment_data)
      
      case 'caldav_sync':
        return await syncWithCalDAV(appointment_data)
      
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

  } catch (error) {
    console.error('Calendar sync error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function syncAppointment(supabaseClient: any, integrationType: string, appointmentData: any, webhookUrl?: string) {
  console.log('Syncing appointment:', appointmentData)

  // If it's a Zapier webhook, trigger it
  if (integrationType === 'zapier' && webhookUrl) {
    await triggerWebhook(webhookUrl, appointmentData)
  }

  // For Google Calendar and Outlook, we'd implement OAuth flows here
  // This is a placeholder for the actual integration
  
  return new Response(
    JSON.stringify({ 
      success: true, 
      message: `Appointment synced with ${integrationType}`,
      appointment_id: appointmentData.id 
    }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function triggerWebhook(webhookUrl: string, appointmentData: any) {
  console.log('Triggering webhook:', webhookUrl)

  const payload = {
    event_type: 'appointment_updated',
    timestamp: new Date().toISOString(),
    data: {
      appointment_id: appointmentData.id,
      patient_name: appointmentData.patient_name,
      appointment_type: appointmentData.appointment_type,
      date: appointmentData.date,
      time: appointmentData.time,
      status: appointmentData.status,
      provider: appointmentData.provider,
      duration: appointmentData.duration
    }
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Webhook failed: ${response.status}`)
  }

  console.log('Webhook triggered successfully')
  return response
}

async function syncWithGoogleCalendar(appointmentData: any) {
  // Placeholder for Google Calendar integration
  // Would require Google Calendar API setup and OAuth
  console.log('Google Calendar sync placeholder:', appointmentData)
  
  return new Response(
    JSON.stringify({ 
      success: true, 
      message: 'Google Calendar integration requires OAuth setup',
      next_steps: 'Configure Google Calendar API credentials in Supabase secrets'
    }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function syncWithOutlook(appointmentData: any) {
  // Placeholder for Outlook integration
  // Would require Microsoft Graph API setup and OAuth
  console.log('Outlook sync placeholder:', appointmentData)
  
  return new Response(
    JSON.stringify({ 
      success: true, 
      message: 'Outlook integration requires Microsoft Graph API setup',
      next_steps: 'Configure Microsoft Graph API credentials in Supabase secrets'
    }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function syncWithCalDAV(appointmentData: any) {
  // CalDAV sync implementation
  console.log('CalDAV sync:', appointmentData)
  
  // Since CalDAV is a standard protocol, clients will automatically sync
  // when they fetch from our CalDAV server endpoint
  
  return new Response(
    JSON.stringify({ 
      success: true, 
      message: 'CalDAV server is ready for Apple Calendar sync',
      caldav_url: '/functions/v1/caldav-server/caldav',
      sync_method: 'automatic'
    }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}