import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { Resend } from 'npm:resend@4.0.0';

interface AppointmentReminderData {
  id: string;
  appointment_id: string;
  reminder_type: 'email' | 'sms' | 'call';
  scheduled_for: string;
  message_template: string;
  appointment: {
    date: string;
    time: string;
    duration: number;
    appointment_type: string;
    patient_name: string;
    phone?: string;
    email?: string;
    provider: {
      first_name: string;
      last_name: string;
      specialty?: string;
    };
  };
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const resend = new Resend(Deno.env.get('RESEND_API_KEY') ?? '');

    // Get pending reminders that are due
    const { data: pendingReminders, error: fetchError } = await supabase
      .from('appointment_reminders')
      .select(`
        *,
        appointment:appointments (
          date,
          time,
          duration,
          appointment_type,
          patient_name,
          phone,
          email,
          provider:providers (
            first_name,
            last_name,
            specialty
          )
        )
      `)
      .eq('status', 'pending')
      .lte('scheduled_for', new Date().toISOString())
      .limit(50);

    if (fetchError) {
      throw new Error(`Failed to fetch reminders: ${fetchError.message}`);
    }

    const results = [];

    for (const reminder of (pendingReminders as AppointmentReminderData[])) {
      try {
        if (reminder.reminder_type === 'email' && reminder.appointment.email) {
          await sendEmailReminder(resend, reminder);
        } else if (reminder.reminder_type === 'sms' && reminder.appointment.phone) {
          await sendSMSReminder(reminder);
        }

        // Mark reminder as sent
        await supabase
          .from('appointment_reminders')
          .update({ 
            status: 'sent', 
            sent_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', reminder.id);

        results.push({ 
          reminder_id: reminder.id, 
          type: reminder.reminder_type,
          status: 'sent' 
        });

      } catch (error) {
        console.error(`Failed to send reminder ${reminder.id}:`, error);
        
        // Mark reminder as failed and increment retry count
        await supabase
          .from('appointment_reminders')
          .update({ 
            status: 'failed',
            error_message: error.message,
            retry_count: reminder.retry_count + 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', reminder.id);

        results.push({ 
          reminder_id: reminder.id, 
          type: reminder.reminder_type,
          status: 'failed',
          error: error.message 
        });
      }
    }

    return new Response(
      JSON.stringify({ 
        processed: results.length,
        results 
      }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in send-appointment-reminders function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 500,
      }
    );
  }
});

async function sendEmailReminder(resend: any, reminder: AppointmentReminderData) {
  const { appointment } = reminder;
  const providerName = `${appointment.provider.first_name} ${appointment.provider.last_name}`;
  
  // Format appointment date and time
  const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
  const formattedDate = appointmentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const formattedTime = appointmentDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });

  // Replace template variables
  const message = reminder.message_template
    .replace(/\\{\\{patient_name\\}\\}/g, appointment.patient_name)
    .replace(/\\{\\{provider_name\\}\\}/g, providerName)
    .replace(/\\{\\{date\\}\\}/g, formattedDate)
    .replace(/\\{\\{time\\}\\}/g, formattedTime)
    .replace(/\\{\\{appointment_type\\}\\}/g, appointment.appointment_type);

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">Appointment Reminder</h1>
      </div>
      
      <div style="padding: 30px; background: #f8f9fa;">
        <p style="font-size: 18px; color: #333; margin-bottom: 20px;">Hello ${appointment.patient_name},</p>
        
        <div style="background: white; padding: 25px; border-radius: 10px; border-left: 4px solid #667eea; margin: 20px 0;">
          <h2 style="color: #333; margin-top: 0;">Upcoming Appointment Details</h2>
          <p style="margin: 10px 0;"><strong>Date:</strong> ${formattedDate}</p>
          <p style="margin: 10px 0;"><strong>Time:</strong> ${formattedTime}</p>
          <p style="margin: 10px 0;"><strong>Duration:</strong> ${appointment.duration} minutes</p>
          <p style="margin: 10px 0;"><strong>Type:</strong> ${appointment.appointment_type}</p>
          <p style="margin: 10px 0;"><strong>Provider:</strong> ${providerName}</p>
          ${appointment.provider.specialty ? `<p style="margin: 10px 0;"><strong>Specialty:</strong> ${appointment.provider.specialty}</p>` : ''}
        </div>
        
        <div style="background: #e3f2fd; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <p style="margin: 0; color: #1565c0;">
            <strong>Please note:</strong> If you need to reschedule or cancel this appointment, please contact us at least 24 hours in advance.
          </p>
        </div>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          This is an automated reminder. Please do not reply to this email.
        </p>
      </div>
      
      <div style="background: #333; color: white; padding: 20px; text-align: center;">
        <p style="margin: 0; font-size: 14px;">© 2024 FlowIQ Practice Management</p>
      </div>
    </div>
  `;

  await resend.emails.send({
    from: 'FlowIQ Appointments <appointments@resend.dev>',
    to: [appointment.email!],
    subject: `Appointment Reminder - ${formattedDate} at ${formattedTime}`,
    html: emailHtml
  });
}

async function sendSMSReminder(reminder: AppointmentReminderData) {
  const { appointment } = reminder;
  const providerName = `${appointment.provider.first_name} ${appointment.provider.last_name}`;
  
  const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
  const formattedDate = appointmentDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
  const formattedTime = appointmentDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });

  // Replace template variables for SMS (keep it short)
  let message = reminder.message_template
    .replace(/\\{\\{patient_name\\}\\}/g, appointment.patient_name)
    .replace(/\\{\\{provider_name\\}\\}/g, providerName)
    .replace(/\\{\\{date\\}\\}/g, formattedDate)
    .replace(/\\{\\{time\\}\\}/g, formattedTime)
    .replace(/\\{\\{appointment_type\\}\\}/g, appointment.appointment_type);

  // Add appointment details for SMS
  message += ` Details: ${formattedDate} at ${formattedTime} with ${providerName}. Reply STOP to opt out.`;

  // Note: In a real implementation, you would integrate with Twilio or another SMS service
  // For now, we'll log the SMS that would be sent
  console.log(`SMS would be sent to ${appointment.phone}: ${message}`);
  
  // For actual SMS sending, you would use something like:
  // await twilioClient.messages.create({
  //   body: message,
  //   from: TWILIO_FROM_NUMBER,
  //   to: appointment.phone
  // });
}
