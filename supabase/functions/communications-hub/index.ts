import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from 'https://esm.sh/resend@2.0.0';

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Unified request interface matching the PRD
interface UnifiedCommunicationRequest {
    channel: 'email' | 'sms' | 'voice';
    recipient: string;
    template?: string;
    data?: Record<string, string>;
    meta?: {
        userId?: string;
        practiceId?: string;
        source?: string;
        direction?: 'outbound' | 'inbound';
        patientId?: string;
        appointmentId?: string;
    };
    customMessage?: string;
    subject?: string; // For emails
}

// Template interface
interface CommunicationTemplate {
    id: string;
    name: string;
    channel: 'email' | 'sms' | 'voice';
    subject?: string;
    content: string;
    variables: string[];
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

// Template rendering function
const renderTemplate = (template: CommunicationTemplate, data: Record<string, string>): { subject?: string; content: string } => {
    let content = template.content;
    let subject = template.subject;

    // Replace variables in content and subject
    for (const [key, value] of Object.entries(data)) {
        const placeholder = `{{${key}}}`;
        content = content.replace(new RegExp(placeholder, 'g'), value);
        if (subject) {
            subject = subject.replace(new RegExp(placeholder, 'g'), value);
        }
    }

    return { subject, content };
};

// Get template from database or use built-in templates
const getTemplate = async (templateId: string, channel: string): Promise<CommunicationTemplate> => {
    // Try to get from database first
    const { data: dbTemplate } = await supabase
        .from('communication_templates')
        .select('*')
        .eq('id', templateId)
        .eq('channel', channel)
        .single();

    if (dbTemplate) {
        return {
            id: dbTemplate.id,
            name: dbTemplate.name,
            channel: dbTemplate.channel,
            subject: dbTemplate.subject,
            content: dbTemplate.content,
            variables: dbTemplate.variables || []
        };
    }

    // Built-in templates
    const builtInTemplates: Record<string, CommunicationTemplate> = {
        'appointment_reminder_email': {
            id: 'appointment_reminder_email',
            name: 'Appointment Reminder (Email)',
            channel: 'email',
            subject: 'Appointment Reminder - {{date}} at {{time}}',
            content: `
        <h2>Appointment Reminder</h2>
        <p>Dear {{patient_name}},</p>
        <p>This is a reminder that you have an appointment scheduled for {{date}} at {{time}} with {{provider_name}}.</p>
        <p>Please arrive 15 minutes early to complete any necessary paperwork.</p>
        <p>If you need to reschedule, please call us at {{phone}}.</p>
        <br>
        <p>Best regards,<br>{{practice_name}}</p>
      `,
            variables: ['patient_name', 'date', 'time', 'provider_name', 'phone', 'practice_name']
        },
        'appointment_reminder_sms': {
            id: 'appointment_reminder_sms',
            name: 'Appointment Reminder (SMS)',
            channel: 'sms',
            content: 'Hi {{patient_name}}, reminder: appointment {{date}} at {{time}} with {{provider_name}}. Call {{phone}} to reschedule.',
            variables: ['patient_name', 'date', 'time', 'provider_name', 'phone']
        },
        'welcome_email': {
            id: 'welcome_email',
            name: 'Welcome Email',
            channel: 'email',
            subject: 'Welcome to {{practice_name}}, {{patient_name}}!',
            content: `
        <h2>Welcome {{patient_name}}!</h2>
        <p>Thank you for choosing {{practice_name}}. We're excited to have you as a patient.</p>
        <p>Our team will contact you within 24 hours to schedule your appointment or answer any questions.</p>
        <p>If you have any immediate concerns, please don't hesitate to call us at {{phone}}.</p>
        <br>
        <p>Best regards,<br>{{practice_name}} Team</p>
      `,
            variables: ['patient_name', 'practice_name', 'phone']
        },
        'follow_up_voice': {
            id: 'follow_up_voice',
            name: 'Follow-up Call Script',
            channel: 'voice',
            content: 'Hello {{patient_name}}, this is {{practice_name}} calling to follow up on your recent appointment. Please call us back at {{phone}} if you have any questions.',
            variables: ['patient_name', 'practice_name', 'phone']
        }
    };

    const templateKey = `${templateId}_${channel}`;
    const template = builtInTemplates[templateKey];

    if (!template) {
        throw new Error(`Template not found: ${templateId} for channel ${channel}`);
    }

    return template;
};

// Send email via Resend
const sendEmail = async (recipient: string, subject: string, content: string, meta?: any) => {
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
        throw new Error('Email service not configured');
    }

    const resend = new Resend(resendApiKey);

    const emailResponse = await resend.emails.send({
        from: 'FlowIQ <notifications@flowiq.com>',
        to: [recipient],
        subject: subject,
        html: content,
    });

    if (emailResponse.error) {
        throw new Error(`Email service error: ${emailResponse.error.message}`);
    }

    return emailResponse;
};

// Send SMS via Twilio
const sendSMS = async (recipient: string, content: string, meta?: any) => {
    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const fromNumber = Deno.env.get('TWILIO_FROM_NUMBER');

    if (!accountSid || !authToken || !fromNumber) {
        throw new Error('SMS service not configured');
    }

    const formattedPhone = formatPhoneNumber(recipient);

    if (!validatePhoneNumber(formattedPhone)) {
        throw new Error('Invalid phone number format');
    }

    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const credentials = btoa(`${accountSid}:${authToken}`);

    const response = await fetch(twilioUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            From: fromNumber,
            To: formattedPhone,
            Body: content,
        }),
    });

    const twilioResponse = await response.json();

    if (!response.ok) {
        throw new Error(`Twilio error: ${twilioResponse.message || 'Failed to send SMS'}`);
    }

    return twilioResponse;
};

// Send voice call via Vapi
const sendVoiceCall = async (recipient: string, content: string, meta?: any) => {
    const vapiApiKey = Deno.env.get('VAPI_API_KEY');
    if (!vapiApiKey) {
        throw new Error('Voice service not configured');
    }

    // This is a placeholder for Vapi integration
    // In a real implementation, you would use the Vapi SDK
    console.log('Voice call would be initiated:', { recipient, content });

    // For now, return a simulated response
    return {
        callId: `vapi_${Date.now()}`,
        status: 'initiated',
        message: 'Voice call initiated (simulated)'
    };
};

// Log communication to database
const logCommunication = async (request: UnifiedCommunicationRequest, result: any, status: 'sent' | 'failed', error?: string) => {
    try {
        const logData = {
            type: request.channel,
            recipient: request.recipient,
            subject: request.subject,
            message: request.customMessage || result?.content,
            template_id: request.template,
            status: status,
            sent_at: status === 'sent' ? new Date().toISOString() : null,
            error_message: error,
            metadata: {
                ...request.meta,
                provider: request.channel === 'sms' ? 'twilio' : request.channel === 'email' ? 'resend' : 'vapi',
                result: result,
                template_data: request.data
            }
        };

        await supabase
            .from('communication_logs')
            .insert(logData);

    } catch (logError) {
        console.error('Failed to log communication:', logError);
    }
};

serve(async (req: Request): Promise<Response> => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const request: UnifiedCommunicationRequest = await req.json();
        console.log('Processing unified communication request:', request);

        // Validate request
        if (!request.channel || !request.recipient) {
            throw new Error('Channel and recipient are required');
        }

        let template: CommunicationTemplate | null = null;
        let finalContent: string;
        let finalSubject: string | undefined;

        // Handle template-based or custom message
        if (request.template) {
            template = await getTemplate(request.template, request.channel);
            const rendered = renderTemplate(template, request.data || {});
            finalContent = rendered.content;
            finalSubject = rendered.subject;
        } else if (request.customMessage) {
            finalContent = request.customMessage;
            finalSubject = request.subject;
        } else {
            throw new Error('Either template or customMessage must be provided');
        }

        let result;
        let status: 'sent' | 'failed' = 'sent';

        // Send based on channel
        switch (request.channel) {
            case 'email':
                if (!finalSubject) {
                    throw new Error('Subject is required for email communications');
                }
                result = await sendEmail(request.recipient, finalSubject, finalContent, request.meta);
                break;

            case 'sms':
                result = await sendSMS(request.recipient, finalContent, request.meta);
                break;

            case 'voice':
                result = await sendVoiceCall(request.recipient, finalContent, request.meta);
                break;

            default:
                throw new Error(`Unsupported channel: ${request.channel}`);
        }

        // Log successful communication
        await logCommunication(request, result, status);

        return new Response(JSON.stringify({
            success: true,
            channel: request.channel,
            recipient: request.recipient,
            messageId: result?.id || result?.sid || result?.callId,
            status: status,
            details: {
                template: request.template,
                provider: request.channel === 'sms' ? 'twilio' : request.channel === 'email' ? 'resend' : 'vapi',
                ...result
            }
        }), {
            status: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders },
        });

    } catch (error: any) {
        console.error("Error in communications hub:", error);

        // Try to log the failed communication
        try {
            const request = await req.clone().json();
            await logCommunication(request, null, 'failed', error.message);
        } catch (logError) {
            console.error("Failed to log error:", logError);
        }

        return new Response(
            JSON.stringify({
                success: false,
                error: error.message
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json", ...corsHeaders },
            }
        );
    }
}); 