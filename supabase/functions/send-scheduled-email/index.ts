
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
    const { templateId, recipient, variables } = await req.json();
    
    // Get email template
    const { data: template, error: templateError } = await supabase
      .from('email_templates')
      .select('*')
      .eq('id', templateId)
      .single();

    if (templateError || !template) {
      throw new Error('Email template not found');
    }

    // Replace variables in template
    let subject = template.subject;
    let body = template.body;
    
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      subject = subject.replace(new RegExp(placeholder, 'g'), value as string);
      body = body.replace(new RegExp(placeholder, 'g'), value as string);
    }

    // Get email integration settings
    const { data: emailIntegration } = await supabase
      .from('integrations')
      .select('*')
      .eq('type', 'email')
      .eq('enabled', true)
      .single();

    if (!emailIntegration) {
      throw new Error('No email integration configured');
    }

    // Send email using Resend (if RESEND_API_KEY is configured)
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (resendApiKey) {
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: emailIntegration.settings?.fromEmail || 'noreply@resend.dev',
          to: [recipient],
          subject: subject,
          html: body,
        }),
      });

      if (!resendResponse.ok) {
        const errorText = await resendResponse.text();
        throw new Error(`Email sending failed: ${errorText}`);
      }

      const emailResult = await resendResponse.json();
      
      // Log the email send
      await supabase
        .from('communication_logs')
        .insert({
          submission_id: crypto.randomUUID(), // Generate a UUID for non-submission emails
          type: 'email',
          recipient: recipient,
          subject: subject,
          message: body,
          template_id: templateId,
          status: 'sent',
          sent_at: new Date().toISOString(),
          metadata: { email_id: emailResult.id, provider: 'resend' }
        });

      return new Response(JSON.stringify({ 
        success: true, 
        messageId: emailResult.id 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      // Simulate email sending for development
      console.log('Simulated email send:', {
        to: recipient,
        subject: subject,
        body: body
      });

      // Log the simulated email send
      await supabase
        .from('communication_logs')
        .insert({
          submission_id: crypto.randomUUID(),
          type: 'email',
          recipient: recipient,
          subject: subject,
          message: body,
          template_id: templateId,
          status: 'sent',
          sent_at: new Date().toISOString(),
          metadata: { simulated: true }
        });

      return new Response(JSON.stringify({ 
        success: true, 
        messageId: 'simulated_' + Date.now() 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

  } catch (error: any) {
    console.error("Error sending scheduled email:", error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
