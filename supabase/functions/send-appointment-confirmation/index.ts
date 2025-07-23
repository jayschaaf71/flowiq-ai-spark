
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ConfirmationRequest {
  appointmentId: string;
  patientEmail: string;
  appointmentDetails: {
    date: string;
    time: string;
    providerName?: string;
    appointmentType?: string;
    duration?: number;
    practiceName?: string;
    practiceAddress?: string;
    practicePhone?: string;
  };
}

function generateCalendarLinks(appointmentDetails: any, appointmentId: string) {
  const { date, time, duration = 60, appointmentType, providerName, practiceAddress } = appointmentDetails;
  
  const startDateTime = new Date(`${date}T${time}`);
  const endDateTime = new Date(startDateTime.getTime() + (duration * 60 * 1000));
  
  const title = encodeURIComponent(`${appointmentType || 'Medical Appointment'} - ${providerName || 'Healthcare Provider'}`);
  const description = encodeURIComponent(`Appointment with ${providerName || 'Healthcare Provider'}\nType: ${appointmentType || 'Consultation'}\nDuration: ${duration} minutes`);
  const location = encodeURIComponent(practiceAddress || '');
  
  // Format dates for different services
  const formatGoogleDate = (date: Date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const startFormatted = formatGoogleDate(startDateTime);
  const endFormatted = formatGoogleDate(endDateTime);
  
  return {
    google: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startFormatted}/${endFormatted}&details=${description}&location=${location}`,
    outlook: `https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&startdt=${startDateTime.toISOString()}&enddt=${endDateTime.toISOString()}&body=${description}&location=${location}`,
    office365: `https://outlook.office.com/calendar/0/deeplink/compose?subject=${title}&startdt=${startDateTime.toISOString()}&enddt=${endDateTime.toISOString()}&body=${description}&location=${location}`,
    yahoo: `https://calendar.yahoo.com/?v=60&view=d&type=20&title=${title}&st=${startFormatted}&dur=${duration * 60}&desc=${description}&in_loc=${location}`
  };
}

function generateICSFile(appointmentDetails: any, appointmentId: string): string {
  const { date, time, duration = 60, appointmentType, providerName, practiceName, practiceAddress } = appointmentDetails;
  
  // Create start and end dates
  const startDateTime = new Date(`${date}T${time}`);
  const endDateTime = new Date(startDateTime.getTime() + (duration * 60 * 1000));
  
  // Format dates for ICS (YYYYMMDDTHHMMSSZ)
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };
  
  const startFormatted = formatDate(startDateTime);
  const endFormatted = formatDate(endDateTime);
  const nowFormatted = formatDate(new Date());
  
  // Generate unique UID
  const uid = `appointment-${appointmentId}@scheduleiq.com`;
  
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Schedule iQ//Appointment//EN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${nowFormatted}`,
    `DTSTART:${startFormatted}`,
    `DTEND:${endFormatted}`,
    `SUMMARY:${appointmentType || 'Medical Appointment'} - ${providerName || 'Healthcare Provider'}`,
    `DESCRIPTION:Appointment with ${providerName || 'Healthcare Provider'}\nType: ${appointmentType || 'Consultation'}\nDuration: ${duration} minutes`,
    ...(practiceAddress ? [`LOCATION:${practiceName || 'Medical Practice'}\n${practiceAddress}`] : []),
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT15M',
    'DESCRIPTION:Appointment Reminder',
    'ACTION:DISPLAY',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
  
  return icsContent;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { appointmentId, patientEmail, appointmentDetails }: ConfirmationRequest = await req.json();
    
    console.log('Sending appointment confirmation:', {
      appointmentId,
      patientEmail,
      appointmentDetails
    });
    
    // Format the date for display
    const appointmentDate = new Date(appointmentDetails.date);
    const formattedDate = appointmentDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Generate calendar invite (.ics file) and calendar links
    const icsContent = generateICSFile(appointmentDetails, appointmentId);
    const icsBuffer = new TextEncoder().encode(icsContent);
    const calendarLinks = generateCalendarLinks(appointmentDetails, appointmentId);
    
    // Send confirmation email with calendar attachment
    const emailResponse = await resend.emails.send({
      from: "Schedule iQ <appointments@scheduleiq.com>",
      to: [patientEmail],
      subject: 'Appointment Confirmation - Schedule iQ',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Your appointment has been confirmed!</h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e293b; margin-top: 0;">Appointment Details:</h3>
            <ul style="line-height: 1.6;">
              <li><strong>Date:</strong> ${formattedDate}</li>
              <li><strong>Time:</strong> ${appointmentDetails.time}</li>
              <li><strong>Provider:</strong> ${appointmentDetails.providerName || 'Healthcare Provider'}</li>
              <li><strong>Type:</strong> ${appointmentDetails.appointmentType || 'Consultation'}</li>
              <li><strong>Duration:</strong> ${appointmentDetails.duration || 60} minutes</li>
              <li><strong>Appointment ID:</strong> ${appointmentId}</li>
            </ul>
          </div>
          
          <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; border-left: 4px solid #2563eb; margin: 20px 0;">
            <p style="margin: 0 0 15px 0; color: #1e40af; font-weight: bold;">
              📅 Add to Your Calendar:
            </p>
            <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 10px;">
              <a href="${calendarLinks.google}" style="display: inline-block; padding: 8px 16px; background-color: #4285f4; color: white; text-decoration: none; border-radius: 4px; font-size: 14px;">Google Calendar</a>
              <a href="${calendarLinks.outlook}" style="display: inline-block; padding: 8px 16px; background-color: #0078d4; color: white; text-decoration: none; border-radius: 4px; font-size: 14px;">Outlook</a>
              <a href="${calendarLinks.office365}" style="display: inline-block; padding: 8px 16px; background-color: #c5504b; color: white; text-decoration: none; border-radius: 4px; font-size: 14px;">Office 365</a>
              <a href="${calendarLinks.yahoo}" style="display: inline-block; padding: 8px 16px; background-color: #720e9e; color: white; text-decoration: none; border-radius: 4px; font-size: 14px;">Yahoo</a>
            </div>
            <p style="margin: 10px 0 0 0; color: #1e40af; font-size: 14px;">
              Or use the attached calendar file (.ics) which works with all calendar apps including Apple Calendar.
            </p>
          </div>
          
          <p style="margin-top: 20px;">You will receive reminder notifications before your appointment.</p>
          
          <p>If you need to reschedule or cancel, please contact us as soon as possible.</p>
          
          <p style="color: #64748b;">Thank you for choosing our healthcare services!</p>
        </div>
      `,
      attachments: [
        {
          filename: `appointment-${appointmentId}.ics`,
          content: icsBuffer,
          contentType: 'text/calendar; charset=utf-8; method=REQUEST'
        }
      ]
    });

    console.log('Confirmation email sent:', emailResponse);
    
    if (emailResponse.error) {
      throw new Error(`Failed to send email: ${emailResponse.error.message}`);
    }
    
    return new Response(JSON.stringify({ 
      success: true,
      message: 'Confirmation sent successfully with calendar invite',
      appointmentId: appointmentId,
      emailId: emailResponse.data?.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error sending appointment confirmation:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
