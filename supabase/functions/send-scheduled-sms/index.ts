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

// SMS utilities
const calculateSMSSegments = (message: string): number => {
  return Math.ceil(message.length / 160);
};

const estimateSMSCost = (message: string): number => {
  const segments = calculateSMSSegments(message);
  return segments * 0.0075; // Approximate cost per segment
};

const validatePhoneNumber = (phone: string): boolean => {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
};

const formatPhoneNumber = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `+1${digits}`;
  } else if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`;
  }
  return phone;
};

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

    // Format and validate phone number
    const formattedPhone = formatPhoneNumber(recipient);
    if (!validatePhoneNumber(formattedPhone)) {
      throw new Error('Invalid phone number format');
    }

    const segments = calculateSMSSegments(message);
    const estimatedCost = estimateSMSCost(message);

    // Get Twilio credentials
    const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const twilioFromNumber = Deno.env.get('TWILIO_FROM_NUMBER');

    if (twilioAccountSid && twilioAuthToken && twilioFromNumber) {
      // Send real SMS using Twilio
      const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`;
      const twilioAuth = btoa(`${twilioAccountSid}:${twilioAuthToken}`);

      const twilioResponse = await fetch(twilioUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${twilioAuth}`,
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
          submission_id: crypto.randomUUID(), // Generate a UUID for non-submission SMS
          type: 'sms',
          recipient: formattedPhone,
          message: message,
          template_id: templateId,
          status: 'sent',
          sent_at: new Date().toISOString(),
          metadata: { 
            twilio_sid: smsResult.sid, 
            provider: 'twilio',
            segments: segments,
            estimated_cost: estimatedCost
          }
        });

      return new Response(JSON.stringify({ 
        success: true, 
        messageId: smsResult.sid,
        details: {
          recipient: formattedPhone,
          segments: segments,
          estimatedCost: `$${estimatedCost.toFixed(4)}`,
          status: smsResult.status
        }
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      // Simulate SMS sending for development
      console.log('Simulated SMS send:', {
        to: formattedPhone,
        message: message,
        segments: segments,
        estimatedCost: `$${estimatedCost.toFixed(4)}`
      });

      // Simulate processing delay
      const processingDelay = Math.min(1000 + (segments * 200), 3000);
      await new Promise(resolve => setTimeout(resolve, processingDelay));

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
            processing_time_ms: processingDelay
          }
        });

      return new Response(JSON.stringify({ 
        success: true, 
        messageId: 'simulated_' + Date.now(),
        details: {
          recipient: formattedPhone,
          segments: segments,
          estimatedCost: `$${estimatedCost.toFixed(4)}`,
          processingTime: `${processingDelay}ms`
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