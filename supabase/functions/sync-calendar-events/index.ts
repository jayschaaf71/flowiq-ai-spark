
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  attendees?: string[];
  location?: string;
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { integrationId } = await req.json();
    
    // Get integration details
    const { data: integration, error: integrationError } = await supabase
      .from('integrations')
      .select('*')
      .eq('id', integrationId)
      .single();

    if (integrationError || !integration) {
      throw new Error('Integration not found');
    }

    let events: CalendarEvent[] = [];

    switch (integration.name.toLowerCase()) {
      case 'google':
        events = await syncGoogleCalendar(integration.credentials);
        break;
      case 'outlook':
        events = await syncOutlookCalendar(integration.credentials);
        break;
      case 'apple':
        events = await syncAppleCalendar(integration.credentials);
        break;
      default:
        throw new Error('Unsupported calendar provider');
    }

    // Update integration sync status
    await supabase
      .from('integrations')
      .update({
        last_sync: new Date().toISOString(),
        status: 'connected'
      })
      .eq('id', integrationId);

    // Store synced events
    for (const event of events) {
      await supabase
        .from('calendar_events')
        .upsert({
          integration_id: integrationId,
          external_id: event.id,
          title: event.title,
          description: event.description,
          start_time: event.start,
          end_time: event.end,
          attendees: event.attendees,
          location: event.location,
          synced_at: new Date().toISOString()
        });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      events,
      syncedCount: events.length 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Error syncing calendar events:", error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function syncGoogleCalendar(credentials: any): Promise<CalendarEvent[]> {
  // Simulate Google Calendar API integration
  console.log('Syncing Google Calendar with credentials:', credentials);
  
  // In a real implementation, you would:
  // 1. Use the access token to make requests to Google Calendar API
  // 2. Fetch events from the calendar
  // 3. Transform the response to match our CalendarEvent interface
  
  return [
    {
      id: 'google_1',
      title: 'Team Meeting',
      description: 'Weekly team sync',
      start: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      end: new Date(Date.now() + 90000000).toISOString(), // Tomorrow + 1 hour
      attendees: ['team@example.com'],
      location: 'Conference Room A'
    }
  ];
}

async function syncOutlookCalendar(credentials: any): Promise<CalendarEvent[]> {
  // Simulate Outlook Calendar API integration
  console.log('Syncing Outlook Calendar with credentials:', credentials);
  
  return [
    {
      id: 'outlook_1',
      title: 'Client Call',
      description: 'Monthly check-in',
      start: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
      end: new Date(Date.now() + 176400000).toISOString(), // Day after tomorrow + 1 hour
      attendees: ['client@example.com'],
      location: 'Online'
    }
  ];
}

async function syncAppleCalendar(credentials: any): Promise<CalendarEvent[]> {
  // Simulate Apple Calendar integration
  console.log('Syncing Apple Calendar with credentials:', credentials);
  
  return [
    {
      id: 'apple_1',
      title: 'Doctor Appointment',
      description: 'Annual checkup',
      start: new Date(Date.now() + 259200000).toISOString(), // 3 days from now
      end: new Date(Date.now() + 262800000).toISOString(), // 3 days from now + 1 hour
      location: 'Medical Center'
    }
  ];
}
