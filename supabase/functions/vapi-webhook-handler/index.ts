import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const vapiWebhookSecret = Deno.env.get('VAPI_WEBHOOK_SECRET');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-vapi-secret',
};

interface VAPICallData {
  call: {
    id: string;
    type: 'inboundPhoneCall' | 'outboundPhoneCall';
    status: 'completed' | 'no-answer' | 'failed' | 'busy';
    startedAt?: string;
    endedAt?: string;
    duration?: number;
    cost?: number;
    phoneNumber?: {
      number: string;
    };
    customer?: {
      number: string;
      name?: string;
    };
    analysis?: {
      summary: string;
      structuredData?: any;
    };
    artifact?: {
      transcript?: string;
      recordingUrl?: string;
    };
    messages?: Array<{
      role: 'user' | 'assistant' | 'system';
      message: string;
      timestamp: string;
    }>;
  };
  message: {
    type: 'end-of-call-report' | 'call-started' | 'call-ended';
  };
}

// Extract contact information and appointment details using AI
async function extractContactInformation(transcript: string) {
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const extractionPrompt = `
Analyze the following call transcript and extract contact information and appointment details:

TRANSCRIPT:
${transcript}

Please extract information and return a JSON object with the following structure:
{
  "contact": {
    "first_name": "string or null",
    "last_name": "string or null", 
    "email": "string or null",
    "phone": "string or null",
    "preferred_contact_method": "phone" | "email" | "text" | null
  },
  "appointment": {
    "requested": boolean,
    "preferred_date": "YYYY-MM-DD or null",
    "preferred_time": "HH:MM or null", 
    "appointment_type": "consultation" | "follow_up" | "emergency" | "routine" | null,
    "urgency": "low" | "medium" | "high" | "emergency",
    "chief_complaint": "string or null",
    "insurance_mentioned": boolean,
    "insurance_provider": "string or null"
  },
  "booked_consultation": boolean
}

Extract only information that is explicitly mentioned in the transcript. If information is not provided, use null.
Focus on identifying if this was a "Booked Consultation" - meaning the caller successfully scheduled an appointment.
`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: 'You are an expert at extracting structured contact and appointment information from medical practice call transcripts.' },
          { role: 'user', content: extractionPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${await response.text()}`);
    }

    const result = await response.json();
    const extracted = JSON.parse(result.choices[0].message.content);
    
    console.log('Contact extraction completed:', extracted);
    return extracted;
  } catch (error) {
    console.error('Error extracting contact information:', error);
    
    // Return empty structure if extraction fails
    return {
      contact: {
        first_name: null,
        last_name: null,
        email: null,
        phone: null,
        preferred_contact_method: null
      },
      appointment: {
        requested: false,
        preferred_date: null,
        preferred_time: null,
        appointment_type: null,
        urgency: "medium",
        chief_complaint: null,
        insurance_mentioned: false,
        insurance_provider: null
      },
      booked_consultation: false
    };
  }
}

// Analyze call transcript and determine outcome using AI (Enhanced with n8n logic)
async function analyzeCallOutcome(transcript: string, callData: any, extractedInfo: any) {
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const analysisPrompt = `
Analyze the following call transcript and provide a structured assessment:

TRANSCRIPT:
${transcript}

EXTRACTED INFORMATION:
${JSON.stringify(extractedInfo, null, 2)}

Please analyze this call and return a JSON object with the following structure:
{
  "outcome_type": "qualified" | "not_qualified" | "callback_requested" | "appointment_scheduled" | "information_only",
  "sentiment_score": number between -1 and 1,
  "sentiment_label": "positive" | "negative" | "neutral",
  "key_topics": ["topic1", "topic2", "topic3"],
  "follow_up_required": boolean,
  "follow_up_type": "call" | "sms" | "email" | null,
  "follow_up_date": "ISO date string or null",
  "ai_summary": "Brief summary of the call",
  "confidence_score": number between 0 and 1,
  "qualification_score": number between 0 and 100,
  "engagement_score": number between 0 and 100,
  "conversion_likelihood": number between 0 and 100,
  "booked_consultation": boolean
}

Consider these factors:
- Patient showed interest in services
- Patient asked relevant questions  
- Patient provided contact information
- Patient scheduled or expressed interest in scheduling
- Overall tone and engagement level
- Any pain points or concerns mentioned
- Whether follow-up was requested or needed
- Whether this was a "Booked Consultation" (successfully scheduled appointment)

If the extracted information shows booked_consultation: true, set outcome_type to "appointment_scheduled".
`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: 'You are an expert call analyst for medical practice lead qualification. Provide accurate, structured analysis of patient calls.' },
          { role: 'user', content: analysisPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${await response.text()}`);
    }

    const result = await response.json();
    const analysis = JSON.parse(result.choices[0].message.content);
    
    console.log('Call analysis completed:', analysis);
    return analysis;
  } catch (error) {
    console.error('Error analyzing call:', error);
    
    // Fallback analysis if AI fails
    return {
      outcome_type: transcript.length > 50 ? 'qualified' : 'not_qualified',
      sentiment_score: 0,
      sentiment_label: 'neutral',
      key_topics: ['general_inquiry'],
      follow_up_required: true,
      follow_up_type: 'call',
      follow_up_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      ai_summary: 'Call analysis failed, manual review required',
      confidence_score: 0.1,
      qualification_score: 50,
      engagement_score: 50,
      conversion_likelihood: 50,
      booked_consultation: false
    };
  }
}

// Find or create patient with enhanced contact information and tenant support
async function findOrCreatePatient(supabase: any, phoneNumber: string, customerName?: string, extractedContact?: any, tenantId?: string) {
  console.log('Finding or creating patient for phone:', phoneNumber);
  
  // First try to find existing patient by phone
  const { data: existingPatient, error: findError } = await supabase
    .from('patients')
    .select('*')
    .eq('phone', phoneNumber)
    .maybeSingle();

  if (findError) {
    console.error('Error finding patient:', findError);
  }

  if (existingPatient) {
    console.log('Found existing patient:', existingPatient.id);
    
    // Update patient with any new extracted information
    if (extractedContact) {
      const updateData: any = {};
      if (extractedContact.email && !existingPatient.email) updateData.email = extractedContact.email;
      if (extractedContact.first_name && !existingPatient.first_name) updateData.first_name = extractedContact.first_name;
      if (extractedContact.last_name && !existingPatient.last_name) updateData.last_name = extractedContact.last_name;
      
      if (Object.keys(updateData).length > 0) {
        await supabase.from('patients').update(updateData).eq('id', existingPatient.id);
        console.log('Updated existing patient with new information:', updateData);
      }
    }
    
    return existingPatient;
  }

  // Create new patient if not found
  const nameParts = customerName ? customerName.split(' ') : [];
  const firstName = extractedContact?.first_name || nameParts[0] || 'Unknown';
  const lastName = extractedContact?.last_name || nameParts.slice(1).join(' ') || 'Patient';

  const { data: newPatient, error: createError } = await supabase
    .from('patients')
    .insert({
      first_name: firstName,
      last_name: lastName,
      phone: phoneNumber,
      email: extractedContact?.email || null,
      patient_number: `PAT-${Date.now()}`,
      specialty: 'general',
      tenant_id: tenantId || null
    })
    .select()
    .single();

  if (createError) {
    console.error('Error creating patient:', createError);
    throw createError;
  }

  console.log('Created new patient:', newPatient.id);
  return newPatient;
}

// Get tenant ID from query parameters or headers
function getTenantId(req: Request): string | null {
  const url = new URL(req.url);
  const tenantIdFromQuery = url.searchParams.get('tenant_id');
  const tenantIdFromHeader = req.headers.get('x-tenant-id');
  
  return tenantIdFromQuery || tenantIdFromHeader || null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Validate webhook secret if configured
    if (vapiWebhookSecret) {
      const providedSecret = req.headers.get('x-vapi-secret');
      if (!providedSecret || providedSecret !== vapiWebhookSecret) {
        console.error('Invalid or missing webhook secret');
        return new Response(
          JSON.stringify({ error: 'Unauthorized: Invalid webhook secret' }),
          {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    // Get tenant ID for multi-tenant support
    const tenantId = getTenantId(req);
    console.log('Processing webhook for tenant:', tenantId);

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const vapiData: VAPICallData = await req.json();
    
    console.log('Received VAPI webhook:', JSON.stringify(vapiData, null, 2));

    const { call, message } = vapiData;

    // Only process end-of-call reports
    if (message.type !== 'end-of-call-report') {
      return new Response(JSON.stringify({ message: 'Webhook received but not end-of-call-report' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Extract contact information and appointment details from transcript
    const transcript = call.artifact?.transcript || '';
    let extractedInfo = null;
    let patient = null;

    if (transcript.length > 10) {
      console.log('Extracting contact information from transcript...');
      extractedInfo = await extractContactInformation(transcript);
    }

    // Find or create patient with enhanced information
    const phoneNumber = call.customer?.number || call.phoneNumber?.number || extractedInfo?.contact?.phone;
    if (!phoneNumber) {
      console.log('No phone number provided, creating anonymous call record');
      // Create a minimal voice call record without patient association
    } else {
      patient = await findOrCreatePatient(
        supabase, 
        phoneNumber, 
        call.customer?.name, 
        extractedInfo?.contact,
        tenantId
      );
    }

    // Store voice call record with enhanced data
    const { data: voiceCall, error: callError } = await supabase
      .from('voice_calls')
      .insert({
        call_id: call.id,
        patient_id: patient?.id || null,
        call_type: call.type === 'inboundPhoneCall' ? 'inbound' : 'outbound',
        call_status: call.status,
        call_duration: call.duration || 0,
        transcript: transcript,
        call_data: {
          startedAt: call.startedAt,
          endedAt: call.endedAt,
          cost: call.cost,
          recordingUrl: call.artifact?.recordingUrl,
          messages: call.messages,
          analysis: call.analysis,
          extractedInfo: extractedInfo,
          phoneNumber: phoneNumber
        },
        tenant_id: tenantId
      })
      .select()
      .single();

    if (callError) {
      console.error('Error storing voice call:', callError);
      throw callError;
    }

    console.log('Stored voice call:', voiceCall.id);

    // Analyze call outcome if we have transcript
    if (transcript.length > 10) {
      console.log('Analyzing call transcript...');
      
      const analysis = await analyzeCallOutcome(transcript, call, extractedInfo);
      
      // Calculate follow-up date based on outcome
      let followUpDate = null;
      if (analysis.follow_up_required) {
        const hoursToAdd = analysis.outcome_type === 'qualified' ? 2 : 24;
        followUpDate = new Date(Date.now() + hoursToAdd * 60 * 60 * 1000).toISOString();
      }

      // Store call outcome with enhanced data
      const { data: outcome, error: outcomeError } = await supabase
        .from('call_outcomes')
        .insert({
          call_id: voiceCall.id,
          outcome_type: analysis.outcome_type,
          sentiment_score: analysis.sentiment_score,
          sentiment_label: analysis.sentiment_label,
          key_topics: analysis.key_topics,
          follow_up_required: analysis.follow_up_required,
          follow_up_type: analysis.follow_up_type,
          follow_up_date: followUpDate,
          ai_summary: analysis.ai_summary,
          confidence_score: analysis.confidence_score,
          tenant_id: tenantId
        })
        .select()
        .single();

      if (outcomeError) {
        console.error('Error storing call outcome:', outcomeError);
        throw outcomeError;
      }

      console.log('Stored call outcome:', outcome.id);

      // Store lead scores (only if we have a patient)
      if (patient) {
        const scores = [
          { score_type: 'qualification', score_value: analysis.qualification_score },
          { score_type: 'engagement', score_value: analysis.engagement_score },
          { score_type: 'conversion_likelihood', score_value: analysis.conversion_likelihood }
        ];

        for (const score of scores) {
          const { error: scoreError } = await supabase
            .from('lead_scores')
            .insert({
              patient_id: patient.id,
              call_id: voiceCall.id,
              score_type: score.score_type,
              score_value: score.score_value,
              score_factors: {
                outcome_type: analysis.outcome_type,
                sentiment_label: analysis.sentiment_label,
                confidence_score: analysis.confidence_score,
                booked_consultation: analysis.booked_consultation || false
              },
              tenant_id: tenantId
            });

          if (scoreError) {
            console.error(`Error storing ${score.score_type} score:`, scoreError);
          }
        }
      }

      // If qualified lead or booked consultation, trigger immediate follow-up processing
      if ((analysis.outcome_type === 'qualified' || analysis.outcome_type === 'appointment_scheduled' || analysis.booked_consultation) && analysis.follow_up_required) {
        try {
          await supabase.functions.invoke('process-follow-up-tasks', {
            body: { 
              trigger: 'immediate',
              outcome_id: outcome.id,
              priority: analysis.booked_consultation ? 'urgent' : 'high',
              tenant_id: tenantId,
              extracted_info: extractedInfo
            }
          });
        } catch (error) {
          console.error('Error triggering follow-up processing:', error);
        }
      }

      // If appointment was requested, trigger patient lifecycle orchestrator
      if (extractedInfo?.appointment?.requested || analysis.booked_consultation) {
        try {
          await supabase.functions.invoke('book-appointment', {
            body: {
              patient_id: patient?.id,
              appointment_data: extractedInfo?.appointment,
              call_outcome_id: outcome.id,
              tenant_id: tenantId,
              source: 'vapi_call'
            }
          });
        } catch (error) {
          console.error('Error triggering appointment booking:', error);
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        call_id: voiceCall.id,
        patient_id: patient?.id || null,
        tenant_id: tenantId,
        extracted_info: extractedInfo,
        message: 'Call processed successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('VAPI webhook error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});