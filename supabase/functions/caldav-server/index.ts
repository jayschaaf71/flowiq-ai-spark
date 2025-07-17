import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, depth, destination, if, lock-token, overwrite, timeout',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PROPFIND, REPORT, MKCOL, COPY, MOVE',
  'DAV': '1, 2, calendar-access'
}

interface CalDAVEvent {
  uid: string;
  summary: string;
  description?: string;
  dtstart: string;
  dtend: string;
  location?: string;
  organizer?: string;
  attendees?: string[];
  status: 'CONFIRMED' | 'TENTATIVE' | 'CANCELLED';
  created: string;
  lastModified: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 200, 
      headers: corsHeaders 
    });
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

    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    
    // CalDAV URL structure: /caldav/{user-id}/{calendar-id}/
    const userId = pathSegments[1];
    const calendarId = pathSegments[2] || 'appointments';
    
    console.log('CalDAV request:', {
      method: req.method,
      path: url.pathname,
      userId,
      calendarId,
      headers: Object.fromEntries(req.headers.entries())
    });

    switch (req.method) {
      case 'PROPFIND':
        return await handlePropfind(req, supabaseClient, userId, calendarId);
      
      case 'REPORT':
        return await handleReport(req, supabaseClient, userId, calendarId);
      
      case 'GET':
        return await handleGet(req, supabaseClient, userId, calendarId, pathSegments);
      
      case 'PUT':
        return await handlePut(req, supabaseClient, userId, calendarId, pathSegments);
      
      case 'DELETE':
        return await handleDelete(req, supabaseClient, userId, calendarId, pathSegments);
      
      default:
        return new Response('Method Not Allowed', { 
          status: 405, 
          headers: corsHeaders 
        });
    }

  } catch (error) {
    console.error('CalDAV server error:', error);
    return new Response(`Internal Server Error: ${error.message}`, { 
      status: 500, 
      headers: corsHeaders 
    });
  }
})

async function handlePropfind(req: Request, supabaseClient: any, userId: string, calendarId: string) {
  const depth = req.headers.get('depth') || '0';
  const body = await req.text();
  
  console.log('PROPFIND request:', { depth, body });

  // Parse requested properties (simplified)
  const requestsCalendarData = body.includes('calendar-data');
  const requestsEtag = body.includes('getetag');
  
  if (depth === '0') {
    // Return calendar collection properties
    return new Response(buildCalendarPropertiesResponse(userId, calendarId), {
      status: 207,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml; charset=utf-8'
      }
    });
  } else {
    // Return all events in the calendar
    const events = await getCalendarEvents(supabaseClient, userId);
    return new Response(buildEventsPropertiesResponse(events, userId, calendarId, requestsCalendarData), {
      status: 207,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml; charset=utf-8'
      }
    });
  }
}

async function handleReport(req: Request, supabaseClient: any, userId: string, calendarId: string) {
  const body = await req.text();
  console.log('REPORT request:', body);
  
  // Parse time range if specified
  const timeRangeMatch = body.match(/<time-range start="([^"]*)" end="([^"]*)"/);
  let startDate: Date | undefined;
  let endDate: Date | undefined;
  
  if (timeRangeMatch) {
    startDate = new Date(timeRangeMatch[1]);
    endDate = new Date(timeRangeMatch[2]);
  }
  
  const events = await getCalendarEvents(supabaseClient, userId, startDate, endDate);
  const includeCalendarData = body.includes('<C:calendar-data');
  
  return new Response(buildCalendarQueryResponse(events, userId, calendarId, includeCalendarData), {
    status: 207,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
}

async function handleGet(req: Request, supabaseClient: any, userId: string, calendarId: string, pathSegments: string[]) {
  const eventId = pathSegments[3];
  
  if (!eventId) {
    return new Response('Not Found', { status: 404, headers: corsHeaders });
  }
  
  const event = await getCalendarEvent(supabaseClient, userId, eventId);
  
  if (!event) {
    return new Response('Not Found', { status: 404, headers: corsHeaders });
  }
  
  const icalData = convertToICalendar(event);
  
  return new Response(icalData, {
    status: 200,
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/calendar; charset=utf-8',
      'ETag': `"${event.lastModified}"`
    }
  });
}

async function handlePut(req: Request, supabaseClient: any, userId: string, calendarId: string, pathSegments: string[]) {
  const eventId = pathSegments[3];
  const icalData = await req.text();
  
  if (!eventId) {
    return new Response('Bad Request', { status: 400, headers: corsHeaders });
  }
  
  try {
    const event = parseICalendar(icalData, eventId);
    await saveCalendarEvent(supabaseClient, userId, event);
    
    return new Response('', {
      status: 201,
      headers: {
        ...corsHeaders,
        'ETag': `"${event.lastModified}"`
      }
    });
  } catch (error) {
    console.error('Error saving event:', error);
    return new Response('Bad Request', { status: 400, headers: corsHeaders });
  }
}

async function handleDelete(req: Request, supabaseClient: any, userId: string, calendarId: string, pathSegments: string[]) {
  const eventId = pathSegments[3];
  
  if (!eventId) {
    return new Response('Bad Request', { status: 400, headers: corsHeaders });
  }
  
  await deleteCalendarEvent(supabaseClient, userId, eventId);
  
  return new Response('', {
    status: 204,
    headers: corsHeaders
  });
}

async function getCalendarEvents(supabaseClient: any, userId: string, startDate?: Date, endDate?: Date): Promise<CalDAVEvent[]> {
  let query = supabaseClient
    .from('appointments')
    .select('*')
    .eq('patient_id', userId)
    .order('date', { ascending: true });
  
  if (startDate) {
    query = query.gte('date', startDate.toISOString().split('T')[0]);
  }
  
  if (endDate) {
    query = query.lte('date', endDate.toISOString().split('T')[0]);
  }
  
  const { data: appointments, error } = await query;
  
  if (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }
  
  return (appointments || []).map(appointment => ({
    uid: `appointment-${appointment.id}@dentaliq.com`,
    summary: appointment.title || `${appointment.appointment_type} - ${appointment.provider}`,
    description: appointment.notes || '',
    dtstart: `${appointment.date}T${appointment.time}`,
    dtend: calculateEndTime(appointment.date, appointment.time, appointment.duration),
    location: appointment.room || '',
    organizer: `mailto:${appointment.email || 'noreply@dentaliq.com'}`,
    status: 'CONFIRMED' as const,
    created: appointment.created_at,
    lastModified: appointment.updated_at
  }));
}

async function getCalendarEvent(supabaseClient: any, userId: string, eventId: string): Promise<CalDAVEvent | null> {
  const appointmentId = eventId.replace('appointment-', '').replace('.ics', '');
  
  const { data: appointment, error } = await supabaseClient
    .from('appointments')
    .select('*')
    .eq('id', appointmentId)
    .eq('patient_id', userId)
    .single();
  
  if (error || !appointment) {
    return null;
  }
  
  return {
    uid: `appointment-${appointment.id}@dentaliq.com`,
    summary: appointment.title || `${appointment.appointment_type} - ${appointment.provider}`,
    description: appointment.notes || '',
    dtstart: `${appointment.date}T${appointment.time}`,
    dtend: calculateEndTime(appointment.date, appointment.time, appointment.duration),
    location: appointment.room || '',
    organizer: `mailto:${appointment.email || 'noreply@dentaliq.com'}`,
    status: 'CONFIRMED',
    created: appointment.created_at,
    lastModified: appointment.updated_at
  };
}

async function saveCalendarEvent(supabaseClient: any, userId: string, event: CalDAVEvent) {
  const appointmentId = event.uid.split('@')[0].replace('appointment-', '');
  
  const appointmentData = {
    id: appointmentId,
    patient_id: userId,
    title: event.summary,
    notes: event.description,
    date: event.dtstart.split('T')[0],
    time: event.dtstart.split('T')[1],
    duration: calculateDuration(event.dtstart, event.dtend),
    room: event.location,
    status: event.status.toLowerCase(),
    updated_at: new Date().toISOString()
  };
  
  const { error } = await supabaseClient
    .from('appointments')
    .upsert(appointmentData);
  
  if (error) {
    throw new Error(`Failed to save appointment: ${error.message}`);
  }
}

async function deleteCalendarEvent(supabaseClient: any, userId: string, eventId: string) {
  const appointmentId = eventId.replace('appointment-', '').replace('.ics', '');
  
  const { error } = await supabaseClient
    .from('appointments')
    .delete()
    .eq('id', appointmentId)
    .eq('patient_id', userId);
  
  if (error) {
    console.error('Error deleting appointment:', error);
  }
}

function buildCalendarPropertiesResponse(userId: string, calendarId: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<D:multistatus xmlns:D="DAV:" xmlns:C="urn:ietf:params:xml:ns:caldav">
  <D:response>
    <D:href>/caldav/${userId}/${calendarId}/</D:href>
    <D:propstat>
      <D:prop>
        <D:resourcetype>
          <D:collection/>
          <C:calendar/>
        </D:resourcetype>
        <D:displayname>Dental Sleep Appointments</D:displayname>
        <C:calendar-description>Appointments from Dental Sleep IQ</C:calendar-description>
        <C:supported-calendar-component-set>
          <C:comp name="VEVENT"/>
        </C:supported-calendar-component-set>
        <C:calendar-timezone>BEGIN:VTIMEZONE
TZID:America/New_York
BEGIN:STANDARD
DTSTART:20071104T020000
RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU
TZNAME:EST
TZOFFSETFROM:-0400
TZOFFSETTO:-0500
END:STANDARD
BEGIN:DAYLIGHT
DTSTART:20070311T020000
RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU
TZNAME:EDT
TZOFFSETFROM:-0500
TZOFFSETTO:-0400
END:DAYLIGHT
END:VTIMEZONE</C:calendar-timezone>
      </D:prop>
      <D:status>HTTP/1.1 200 OK</D:status>
    </D:propstat>
  </D:response>
</D:multistatus>`;
}

function buildEventsPropertiesResponse(events: CalDAVEvent[], userId: string, calendarId: string, includeCalendarData: boolean): string {
  const responses = events.map(event => {
    const href = `/caldav/${userId}/${calendarId}/appointment-${event.uid.split('@')[0].replace('appointment-', '')}.ics`;
    const calendarData = includeCalendarData ? `<C:calendar-data>${convertToICalendar(event)}</C:calendar-data>` : '';
    
    return `<D:response>
      <D:href>${href}</D:href>
      <D:propstat>
        <D:prop>
          <D:getetag>"${event.lastModified}"</D:getetag>
          ${calendarData}
        </D:prop>
        <D:status>HTTP/1.1 200 OK</D:status>
      </D:propstat>
    </D:response>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<D:multistatus xmlns:D="DAV:" xmlns:C="urn:ietf:params:xml:ns:caldav">
  ${responses}
</D:multistatus>`;
}

function buildCalendarQueryResponse(events: CalDAVEvent[], userId: string, calendarId: string, includeCalendarData: boolean): string {
  return buildEventsPropertiesResponse(events, userId, calendarId, includeCalendarData);
}

function convertToICalendar(event: CalDAVEvent): string {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Dental Sleep IQ//CalDAV Server//EN
BEGIN:VEVENT
UID:${event.uid}
DTSTART:${formatDate(event.dtstart)}
DTEND:${formatDate(event.dtend)}
SUMMARY:${event.summary}
DESCRIPTION:${event.description || ''}
LOCATION:${event.location || ''}
ORGANIZER:${event.organizer || ''}
STATUS:${event.status}
CREATED:${formatDate(event.created)}
LAST-MODIFIED:${formatDate(event.lastModified)}
END:VEVENT
END:VCALENDAR`;
}

function parseICalendar(icalData: string, eventId: string): CalDAVEvent {
  const lines = icalData.split('\n').map(line => line.trim());
  const event: Partial<CalDAVEvent> = {
    uid: `appointment-${eventId}@dentaliq.com`
  };
  
  for (const line of lines) {
    if (line.startsWith('SUMMARY:')) {
      event.summary = line.substring(8);
    } else if (line.startsWith('DESCRIPTION:')) {
      event.description = line.substring(12);
    } else if (line.startsWith('DTSTART:')) {
      event.dtstart = parseICalDate(line.substring(8));
    } else if (line.startsWith('DTEND:')) {
      event.dtend = parseICalDate(line.substring(6));
    } else if (line.startsWith('LOCATION:')) {
      event.location = line.substring(9);
    } else if (line.startsWith('STATUS:')) {
      event.status = line.substring(7) as 'CONFIRMED' | 'TENTATIVE' | 'CANCELLED';
    }
  }
  
  const now = new Date().toISOString();
  return {
    uid: event.uid!,
    summary: event.summary || 'Untitled Event',
    description: event.description || '',
    dtstart: event.dtstart || now,
    dtend: event.dtend || now,
    location: event.location || '',
    status: event.status || 'CONFIRMED',
    created: now,
    lastModified: now
  };
}

function parseICalDate(dateStr: string): string {
  // Convert iCal date format to ISO format
  if (dateStr.includes('T')) {
    // Format: 20231201T140000Z
    const clean = dateStr.replace(/[TZ]/g, '');
    return `${clean.substring(0, 4)}-${clean.substring(4, 6)}-${clean.substring(6, 8)}T${clean.substring(8, 10)}:${clean.substring(10, 12)}:${clean.substring(12, 14)}`;
  }
  return dateStr;
}

function calculateEndTime(date: string, time: string, duration: number): string {
  const startDateTime = new Date(`${date}T${time}`);
  const endDateTime = new Date(startDateTime.getTime() + (duration * 60 * 1000));
  return endDateTime.toISOString().substring(0, 19);
}

function calculateDuration(start: string, end: string): number {
  const startTime = new Date(start);
  const endTime = new Date(end);
  return Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
}