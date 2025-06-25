
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
    
    // Get SMS template
    const { data: template, error: templateError } = await supabase
      .from('sms_templates')
      .select('*')
      .eq('id', templateId)
      .single();

    if (templateError || !template) {
      throw new Error('SMS template not found');
    }

    // Replace variables in template
    let message = template.message;
    
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      message = message.replace(new RegExp(placeholder, 'g'), value as string);
    }

    // Validate message length
    if (message.length > template.max_length) {
      throw new Error(`Message too long: ${message.length} characters (max: ${template.max_length})`);
    }

    // Get SMS integration settings
    const { data: smsIntegration } = await supabase
      .from('integrations')
      .select('*')
      .eq('type', 'sms')
      .eq('enabled', true)
      .single();

    if (!smsIntegration) {
      throw new Error('No SMS integration configured');
    }

    // Format phone number
    const formattedPhone = formatPhoneNumber(recipient);
    if (!validatePhoneNumber(formattedPhone)) {
      throw new Error('Invalid phone number format');
    }

    // Calculate SMS segments and cost
    const segments = Math.ceil(message.length / 160);
    const estimatedCost = segments * 0.0075; // Approximate cost per segment

    // Send SMS using Twilio (if configured) or simulate
    const twilioSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const twilioToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const twilioFromNumber = Deno.env.get('TWILIO_FROM_NUMBER');

    if (twilioSid && twilioToken && twilioFromNumber) {
      // Real Twilio SMS sending
      const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`;
      const credentials = btoa(`${twilioSid}:${twilioToken}`);

      const twilioResponse = await fetch(twilioUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: formattedPhone,
          From: twilioFromNumber,
          Body: message,
        }),
      });

      if (!twilioResponse.ok) {
        const errorText = await twilioResponse.text();
        throw new Error(`SMS sending failed: ${errorText}`);
      }

      const smsResult = await twilioResponse.json();
      
      // Log the SMS send
      await supabase
        .from('communication_logs')
        .insert({
          submission_id: crypto.randomUUID(),
          type: 'sms',
          recipient: formattedPhone,
          message: message,
          template_id: templateId,
          status: 'sent',
          sent_at: new Date().toISOString(),
          metadata: { 
            sid: smsResult.sid,
            provider: 'twilio',
            segments: segments,
            estimated_cost: estimatedCost
          }
        });

      return new Response(JSON.stringify({ 
        success: true, 
        messageId: smsResult.sid,
        segments: segments,
        estimatedCost: estimatedCost
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      // Simulate SMS sending for development
      console.log('Simulated SMS send:', {
        to: formattedPhone,
        message: message,
        segments: segments,
        estimatedCost: estimatedCost
      });

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000 + (segments * 200)));

      // Log the simulated SMS send
      await supabase
        .from('communication_logs')
        .insert({
          submission_id: crypto.randomUUID(),
          type: 'sms',
          recipient: formattedPhone,
          message: message,
          template_id: templateId,
          status: 'sent',
          sent_at: new Date().toISOString(),
          metadata: { 
            simulated: true,
            segments: segments,
            estimated_cost: estimatedCost,
            message_length: message.length
          }
        });

      return new Response(JSON.stringify({ 
        success: true, 
        messageId: 'simulated_' + Date.now(),
        segments: segments,
        estimatedCost: estimatedCost,
        details: {
          recipient: formattedPhone,
          messageLength: message.length,
          segments: segments
        }
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

  } catch (error: any) {
    console.error("Error sending scheduled SMS:", error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function formatPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `+1${digits}`;
  } else if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`;
  }
  return phone;
}

function validatePhoneNumber(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
}
