
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  notificationId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { notificationId }: NotificationRequest = await req.json();

    // Get the notification details
    const { data: notification, error: notificationError } = await supabaseClient
      .from('scheduled_notifications')
      .select(`
        *,
        notification_templates (*),
        appointments (
          title,
          date,
          time,
          patient_id,
          patients (
            first_name,
            last_name
          )
        )
      `)
      .eq('id', notificationId)
      .single();

    if (notificationError || !notification) {
      throw new Error('Notification not found');
    }

    const template = notification.notification_templates;
    const appointment = notification.appointments;
    const patient = appointment?.patients?.[0];

    if (!template || !appointment) {
      throw new Error('Missing template or appointment data');
    }

    // Replace variables in the message template
    let message = template.message_template;
    let subject = template.subject || '';

    const variables = {
      patient_name: patient ? `${patient.first_name} ${patient.last_name}` : 'Patient',
      appointment_date: new Date(appointment.date).toLocaleDateString(),
      appointment_time: appointment.time
    };

    // Replace variables in message and subject
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{${key}}`;
      message = message.replace(new RegExp(placeholder, 'g'), value);
      subject = subject.replace(new RegExp(placeholder, 'g'), value);
    });

    let success = false;

    if (template.type === 'email' && notification.recipient_email) {
      // Send email
      const emailResponse = await resend.emails.send({
        from: "Practice Management <noreply@yourdomain.com>",
        to: [notification.recipient_email],
        subject: subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Appointment Notification</h2>
            <p style="color: #666; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #999; font-size: 12px;">
              This is an automated message from your healthcare provider.
            </p>
          </div>
        `,
      });
      
      success = !!emailResponse.data;
    } else if (template.type === 'sms' && notification.recipient_phone) {
      // For SMS, you would integrate with a service like Twilio
      // This is a placeholder - implement based on your SMS provider
      console.log('SMS would be sent to:', notification.recipient_phone);
      console.log('Message:', message);
      success = true; // Placeholder
    }

    if (success) {
      // Update notification status
      await supabaseClient
        .from('scheduled_notifications')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString()
        })
        .eq('id', notificationId);
    } else {
      // Update notification status to failed
      await supabaseClient
        .from('scheduled_notifications')
        .update({
          status: 'failed',
          retry_count: notification.retry_count + 1
        })
        .eq('id', notificationId);
    }

    return new Response(
      JSON.stringify({ success, message: success ? 'Notification sent' : 'Failed to send notification' }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error sending notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
