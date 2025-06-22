
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

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const request: CommunicationRequest = await req.json();
    console.log('Processing communication request:', request);
    
    if (request.type === 'email') {
      // Enhanced email templates based on template ID
      let emailSubject = `Message for ${request.patientName}`;
      let emailContent = request.customMessage || 'This is an automated message from our intake system.';

      // Template-specific content
      switch (request.templateId) {
        case 'welcome':
          emailSubject = `Welcome to Our Practice, ${request.patientName}!`;
          emailContent = `
            <h2>Welcome ${request.patientName}!</h2>
            <p>Thank you for choosing our practice. We've received your intake form and are reviewing your information.</p>
            <p>Our team will contact you within 24 hours to schedule your appointment or answer any questions.</p>
            <p>If you have any immediate concerns, please don't hesitate to call us.</p>
            <br>
            <p>Best regards,<br>Your Healthcare Team</p>
          `;
          break;
        case 'appointment-reminder':
          emailSubject = `Appointment Reminder for ${request.patientName}`;
          emailContent = `
            <h2>Appointment Reminder</h2>
            <p>Hello ${request.patientName},</p>
            <p>This is a reminder about your upcoming appointment with us.</p>
            <p>${request.customMessage || 'Please arrive 15 minutes early to complete any remaining paperwork.'}</p>
            <p>If you need to reschedule, please contact us as soon as possible.</p>
            <br>
            <p>Best regards,<br>Your Healthcare Team</p>
          `;
          break;
        case 'follow-up':
          emailSubject = `Follow-up from Your Recent Visit`;
          emailContent = `
            <h2>Thank you for your visit, ${request.patientName}</h2>
            <p>We hope you had a positive experience during your recent visit.</p>
            <p>${request.customMessage || 'Please don\'t hesitate to contact us if you have any questions or concerns.'}</p>
            <p>We look forward to seeing you again soon.</p>
            <br>
            <p>Best regards,<br>Your Healthcare Team</p>
          `;
          break;
        default:
          emailContent = `
            <h2>Hello ${request.patientName},</h2>
            <p>${request.customMessage || 'This is an automated message from our intake system.'}</p>
            <p>Template: ${request.templateId}</p>
            <br>
            <p>Best regards,<br>Your Healthcare Team</p>
          `;
      }

      // Send email using Resend
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Intake System <noreply@resend.dev>', // Using default Resend test domain
          to: [request.recipient],
          subject: emailSubject,
          html: emailContent,
        }),
      });

      if (!resendResponse.ok) {
        const errorText = await resendResponse.text();
        console.error('Resend API error:', errorText);
        
        // Update log with error
        await supabase
          .from('communication_logs')
          .update({ 
            status: 'failed',
            error_message: `Email sending failed: ${errorText}`
          })
          .eq('id', request.logId);

        throw new Error(`Email sending failed: ${errorText}`);
      }

      const emailResult = await resendResponse.json();
      console.log('Email sent successfully:', emailResult);
      
      // Update communication log with success
      await supabase
        .from('communication_logs')
        .update({ 
          status: 'sent', 
          sent_at: new Date().toISOString(),
          metadata: { email_id: emailResult.id, resend_response: emailResult }
        })
        .eq('id', request.logId);

      return new Response(JSON.stringify({ success: true, emailResult }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });

    } else if (request.type === 'sms') {
      // Enhanced SMS processing with validation and analytics
      const formattedPhone = formatPhoneNumber(request.recipient);
      
      if (!validatePhoneNumber(formattedPhone)) {
        throw new Error('Invalid phone number format');
      }

      const message = request.customMessage || 'This is a test SMS from your healthcare system.';
      const segments = calculateSMSSegments(message);
      const estimatedCost = estimateSMSCost(message);

      // Enhanced SMS template processing
      let smsMessage = message;
      switch (request.templateId) {
        case 'welcome-sms':
          smsMessage = `Welcome ${request.patientName}! We've received your intake form. We'll contact you within 24 hours. Reply STOP to opt out.`;
          break;
        case 'appointment-reminder-sms':
          smsMessage = `Hi ${request.patientName}, this is a reminder about your appointment tomorrow at 2:00 PM. Reply CONFIRM to confirm or RESCHEDULE if needed.`;
          break;
        case 'follow-up-sms':
          smsMessage = `Hi ${request.patientName}, thank you for your visit. How are you feeling? Reply with any questions or concerns. Reply STOP to opt out.`;
          break;
        case 'confirmation-sms':
          smsMessage = `Hi ${request.patientName}, please confirm your appointment tomorrow at 2:00 PM. Reply YES to confirm or NO to reschedule.`;
          break;
        default:
          smsMessage = request.customMessage || message;
      }

      console.log(`SMS Simulation - Enhanced Processing:`);
      console.log(`To: ${formattedPhone}`);
      console.log(`Message: ${smsMessage}`);
      console.log(`Characters: ${smsMessage.length}`);
      console.log(`Segments: ${segments}`);
      console.log(`Estimated Cost: $${estimatedCost.toFixed(4)}`);
      
      // Simulate SMS processing delay based on message length
      const processingDelay = Math.min(1000 + (segments * 200), 3000);
      await new Promise(resolve => setTimeout(resolve, processingDelay));
      
      // Update communication log with enhanced metadata
      await supabase
        .from('communication_logs')
        .update({ 
          status: 'sent', 
          sent_at: new Date().toISOString(),
          metadata: { 
            sms_simulated: true, 
            message_length: smsMessage.length,
            character_count: smsMessage.length,
            segment_count: segments,
            estimated_cost: estimatedCost,
            formatted_phone: formattedPhone,
            template_used: request.templateId,
            processing_time_ms: processingDelay
          }
        })
        .eq('id', request.logId);

      return new Response(JSON.stringify({ 
        success: true, 
        message: 'SMS sent successfully (simulated)',
        details: {
          recipient: formattedPhone,
          template: request.templateId,
          messageLength: smsMessage.length,
          characterCount: smsMessage.length,
          segmentCount: segments,
          estimatedCost: `$${estimatedCost.toFixed(4)}`,
          processingTime: `${processingDelay}ms`
        }
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    throw new Error('Invalid communication type');

  } catch (error: any) {
    console.error("Error in send-communication function:", error);
    
    // Try to update the log with error if logId is available
    try {
      const request = await req.clone().json();
      if (request.logId) {
        await supabase
          .from('communication_logs')
          .update({ 
            status: 'failed',
            error_message: error.message
          })
          .eq('id', request.logId);
      }
    } catch (logError) {
      console.error("Failed to update error log:", logError);
    }

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
