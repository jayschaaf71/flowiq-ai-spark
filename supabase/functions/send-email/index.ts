import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SendEmailRequest {
  to: string;
  subject: string;
  message: string;
  patientId?: string;
  isHtml?: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get authenticated user
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { to, subject, message, patientId, isHtml }: SendEmailRequest = await req.json();

    if (!to || !subject || !message) {
      throw new Error('Recipient email, subject, and message are required');
    }

    // Initialize Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      throw new Error('Email service not configured');
    }

    const resend = new Resend(resendApiKey);

    // Send email
    const emailResponse = await resend.emails.send({
      from: 'FlowIQ <notifications@flowiq.com>',
      to: [to],
      subject: subject,
      html: isHtml ? message : `<p>${message.replace(/\n/g, '<br>')}</p>`,
    });

    if (emailResponse.error) {
      throw new Error(`Email service error: ${emailResponse.error.message}`);
    }

    // Log the communication
    const { error: logError } = await supabase
      .from('communication_logs')
      .insert({
        type: 'email',
        recipient: to,
        message: `Subject: ${subject}\n\n${message}`,
        status: 'sent',
        patient_id: patientId,
        sent_at: new Date().toISOString(),
      });

    if (logError) {
      console.error('Error logging communication:', logError);
    }

    return new Response(JSON.stringify({
      success: true,
      messageId: emailResponse.data?.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});