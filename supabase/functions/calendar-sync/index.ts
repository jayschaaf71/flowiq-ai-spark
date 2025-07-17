import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees?: Array<{ email: string; name?: string }>;
}

interface GoogleCalendarResponse {
  items: CalendarEvent[];
  nextPageToken?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabase.auth.getUser(token);

    if (!user) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders });
    }

    if (req.method === 'POST') {
      const { integrationId, syncType = 'bidirectional' } = await req.json();

      // Get integration details
      const { data: integration, error: integrationError } = await supabase
        .from('calendar_integrations')
        .select('*')
        .eq('id', integrationId)
        .eq('user_id', user.id)
        .single();

      if (integrationError || !integration) {
        return new Response('Integration not found', { status: 404, headers: corsHeaders });
      }

      // Start sync log
      const { data: syncLog, error: logError } = await supabase
        .from('calendar_sync_logs')
        .insert({
          integration_id: integrationId,
          sync_type: 'manual_sync',
          direction: syncType,
          status: 'in_progress',
          tenant_id: integration.tenant_id
        })
        .select()
        .single();

      if (logError) {
        console.error('Failed to create sync log:', logError);
        return new Response('Failed to start sync', { status: 500, headers: corsHeaders });
      }

      try {
        let appointmentsProcessed = 0;
        let appointmentsCreated = 0;
        let appointmentsUpdated = 0;

        // Sync based on direction
        if (syncType === 'import_only' || syncType === 'bidirectional') {
          const importResults = await importFromExternalCalendar(supabase, integration);
          appointmentsProcessed += importResults.processed;
          appointmentsCreated += importResults.created;
          appointmentsUpdated += importResults.updated;
        }

        if (syncType === 'export_only' || syncType === 'bidirectional') {
          const exportResults = await exportToExternalCalendar(supabase, integration);
          appointmentsProcessed += exportResults.processed;
          appointmentsCreated += exportResults.created;
          appointmentsUpdated += exportResults.updated;
        }

        // Update sync log with success
        await supabase
          .from('calendar_sync_logs')
          .update({
            status: 'success',
            completed_at: new Date().toISOString(),
            appointments_processed: appointmentsProcessed,
            appointments_created: appointmentsCreated,
            appointments_updated: appointmentsUpdated
          })
          .eq('id', syncLog.id);

        // Update integration last sync time
        await supabase
          .from('calendar_integrations')
          .update({
            last_sync_at: new Date().toISOString()
          })
          .eq('id', integrationId);

        return new Response(JSON.stringify({
          success: true,
          syncLogId: syncLog.id,
          appointmentsProcessed,
          appointmentsCreated,
          appointmentsUpdated
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      } catch (syncError) {
        console.error('Sync error:', syncError);
        
        // Update sync log with error
        await supabase
          .from('calendar_sync_logs')
          .update({
            status: 'failed',
            completed_at: new Date().toISOString(),
            error_message: syncError.message
          })
          .eq('id', syncLog.id);

        return new Response(JSON.stringify({ 
          success: false, 
          error: syncError.message 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response('Method not allowed', { status: 405, headers: corsHeaders });

  } catch (error) {
    console.error('Calendar sync error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function importFromExternalCalendar(supabase: any, integration: any) {
  console.log('Importing events from external calendar:', integration.provider);
  
  // For demo purposes, we'll simulate importing events
  // In a real implementation, this would call the external calendar API
  const mockEvents: CalendarEvent[] = [
    {
      id: 'mock-event-1',
      summary: 'External Calendar Event',
      description: 'Imported from external calendar',
      start: {
        dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        timeZone: 'America/New_York'
      },
      end: {
        dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
        timeZone: 'America/New_York'
      }
    }
  ];

  let processed = 0;
  let created = 0;
  let updated = 0;

  for (const event of mockEvents) {
    processed++;
    
    // Check if appointment already exists
    const { data: existingMapping } = await supabase
      .from('external_calendar_events')
      .select('appointment_id')
      .eq('external_event_id', event.id)
      .eq('integration_id', integration.id)
      .single();

    if (existingMapping) {
      // Update existing appointment
      const startDate = new Date(event.start.dateTime);
      const endDate = new Date(event.end.dateTime);
      const duration = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60));

      await supabase
        .from('appointments')
        .update({
          title: event.summary,
          notes: event.description,
          date: startDate.toISOString().split('T')[0],
          time: startDate.toTimeString().split(' ')[0],
          duration
        })
        .eq('id', existingMapping.appointment_id);

      updated++;
    } else {
      // Create new appointment
      const startDate = new Date(event.start.dateTime);
      const endDate = new Date(event.end.dateTime);
      const duration = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60));

      const { data: newAppointment, error: appointmentError } = await supabase
        .from('appointments')
        .insert({
          title: event.summary,
          notes: event.description || 'Imported from external calendar',
          date: startDate.toISOString().split('T')[0],
          time: startDate.toTimeString().split(' ')[0],
          duration,
          status: 'scheduled',
          appointment_type: 'imported',
          tenant_id: integration.tenant_id
        })
        .select()
        .single();

      if (!appointmentError && newAppointment) {
        // Create mapping
        await supabase
          .from('external_calendar_events')
          .insert({
            appointment_id: newAppointment.id,
            integration_id: integration.id,
            external_event_id: event.id,
            external_calendar_id: integration.calendar_id,
            tenant_id: integration.tenant_id
          });

        created++;
      }
    }
  }

  return { processed, created, updated };
}

async function exportToExternalCalendar(supabase: any, integration: any) {
  console.log('Exporting events to external calendar:', integration.provider);
  
  // Get recent appointments that need to be synced
  const { data: appointments } = await supabase
    .from('appointments')
    .select(`
      *,
      external_calendar_events!left(external_event_id)
    `)
    .eq('tenant_id', integration.tenant_id)
    .gte('date', new Date().toISOString().split('T')[0]);

  let processed = 0;
  let created = 0;
  let updated = 0;

  for (const appointment of appointments || []) {
    processed++;
    
    // For demo purposes, we'll just log what would be exported
    console.log('Would export appointment:', appointment.title);
    
    if (appointment.external_calendar_events?.length > 0) {
      updated++;
    } else {
      created++;
    }
  }

  return { processed, created, updated };
}