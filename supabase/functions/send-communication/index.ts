
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CommunicationRequest {
  submissionId: string;
  templateId: string;
  recipient: string;
  patientName: string;
  customMessage?: string;
  type: 'email' | 'sms';
  logId: string;
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const request: CommunicationRequest = await req.json();
    
    if (request.type === 'email') {
      // Send email using Resend
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Intake System <noreply@yourdomain.com>', // Update with your domain
          to: [request.recipient],
          subject: `Message for ${request.patientName}`,
          html: `
            <h2>Hello ${request.patientName},</h2>
            <p>${request.customMessage || 'This is an automated message from our intake system.'}</p>
            <p>Template: ${request.templateId}</p>
            <br>
            <p>Best regards,<br>Your Healthcare Team</p>
          `,
        }),
      });

      if (!resendResponse.ok) {
        const errorText = await resendResponse.text();
        throw new Error(`Email sending failed: ${errorText}`);
      }

      const emailResult = await resendResponse.json();
      
      // Update communication log
      await supabase
        .from('communication_logs')
        .update({ 
          status: 'sent', 
          sent_at: new Date().toISOString(),
          metadata: { email_id: emailResult.id }
        })
        .eq('id', request.logId);

      return new Response(JSON.stringify({ success: true, emailResult }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });

    } else if (request.type === 'sms') {
      // For SMS, you would integrate with Twilio or similar service
      // For now, we'll simulate SMS sending
      console.log(`SMS to ${request.recipient}: ${request.customMessage}`);
      
      // Update communication log
      await supabase
        .from('communication_logs')
        .update({ 
          status: 'sent', 
          sent_at: new Date().toISOString(),
          metadata: { sms_simulated: true }
        })
        .eq('id', request.logId);

      return new Response(JSON.stringify({ success: true, message: 'SMS simulated' }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    throw new Error('Invalid communication type');

  } catch (error: any) {
    console.error("Error in send-communication function:", error);
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
