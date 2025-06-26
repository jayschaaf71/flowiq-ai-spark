
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reminderId } = await req.json();
    
    // Get reminder details
    const { data: reminder, error: reminderError } = await supabase
      .from('scheduled_reminders')
      .select('*')
      .eq('id', reminderId)
      .single();

    if (reminderError || !reminder) {
      throw new Error('Reminder not found');
    }

    // Determine message type based on recipient
    const messageType = reminder.recipient_email ? 'email' : 'sms';
    let result;

    if (messageType === 'email' && reminder.recipient_email) {
      result = await sendEmail(reminder);
    } else if (messageType === 'sms' && reminder.recipient_phone) {
      result = await sendSMS(reminder);
    } else {
      throw new Error('No valid recipient found');
    }

    // Update reminder status
    await supabase
      .from('scheduled_reminders')
      .update({
        delivery_status: 'sent',
        sent_at: new Date().toISOString()
      })
      .eq('id', reminderId);

    return new Response(JSON.stringify({ 
      success: true, 
      messageId: result.messageId,
      type: messageType
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Error sending reminder:", error);
    
    // Update reminder status to failed
    const { reminderId } = await req.json().catch(() => ({}));
    if (reminderId) {
      await supabase
        .from('scheduled_reminders')
        .update({
          delivery_status: 'failed',
          error_message: error.message,
          retry_count: supabase.sql`retry_count + 1`
        })
        .eq('id', reminderId);
    }
    
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function sendEmail(reminder: any) {
  const resendApiKey = Deno.env.get('RESEND_API_KEY');
  
  if (resendApiKey) {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'RemindIQ <noreply@resend.dev>',
        to: [reminder.recipient_email],
        subject: 'Appointment Reminder',
        html: `<p>${reminder.message_content}</p>`,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Email sending failed: ${errorText}`);
    }

    const result = await response.json();
    return { messageId: result.id };
  } else {
    // Simulate email sending
    console.log('Simulated email send:', {
      to: reminder.recipient_email,
      message: reminder.message_content
    });
    return { messageId: 'simulated_email_' + Date.now() };
  }
}

async function sendSMS(reminder: any) {
  const twilioSid = Deno.env.get('TWILIO_ACCOUNT_SID');
  const twilioToken = Deno.env.get('TWILIO_AUTH_TOKEN');
  const twilioFromNumber = Deno.env.get('TWILIO_FROM_NUMBER');

  if (twilioSid && twilioToken && twilioFromNumber) {
    const credentials = btoa(`${twilioSid}:${twilioToken}`);
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: reminder.recipient_phone,
        From: twilioFromNumber,
        Body: reminder.message_content,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`SMS sending failed: ${errorText}`);
    }

    const result = await response.json();
    return { messageId: result.sid };
  } else {
    // Simulate SMS sending
    console.log('Simulated SMS send:', {
      to: reminder.recipient_phone,
      message: reminder.message_content
    });
    return { messageId: 'simulated_sms_' + Date.now() };
  }
}
