import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const vapiApiKey = Deno.env.get('VAPI_API_KEY');

interface CampaignExecutionData {
  campaign_id: string;
  tenant_id: string;
  execution_type: 'voice_outbound' | 'immediate_followup' | 'scheduled_followup';
  target_criteria?: {
    lead_score_min?: number;
    conversion_likelihood_min?: number;
    outcome_types?: string[];
    last_contact_days_ago?: number;
  };
  voice_config?: {
    assistant_id: string;
    phone_number: string;
    script_variables?: Record<string, any>;
    max_calls?: number;
  };
}

// Execute outbound voice campaign using VAPI
async function executeOutboundVoiceCampaign(supabase: any, campaignData: CampaignExecutionData) {
  if (!vapiApiKey) {
    throw new Error('VAPI API key not configured');
  }

  console.log('Executing outbound voice campaign:', campaignData.campaign_id);

  // Get qualified leads based on criteria
  let query = supabase
    .from('lead_scores')
    .select(`
      patient_id,
      score_value,
      score_type,
      patients!inner (
        id,
        first_name,
        last_name,
        phone,
        email,
        tenant_id
      )
    `)
    .eq('patients.tenant_id', campaignData.tenant_id)
    .eq('score_type', 'conversion_likelihood');

  if (campaignData.target_criteria?.conversion_likelihood_min) {
    query = query.gte('score_value', campaignData.target_criteria.conversion_likelihood_min);
  }

  const { data: leads, error: leadsError } = await query.limit(campaignData.voice_config?.max_calls || 25);

  if (leadsError) {
    console.error('Error fetching leads:', leadsError);
    throw leadsError;
  }

  console.log(`Found ${leads?.length || 0} qualified leads for outbound calls`);

  const callResults = [];

  // Process each lead for outbound calling
  for (const lead of leads || []) {
    const patient = lead.patients;
    
    if (!patient.phone) {
      console.log(`Skipping patient ${patient.id} - no phone number`);
      continue;
    }

    try {
      // Create outbound call via VAPI
      const vapiCall = await fetch('https://api.vapi.ai/call/phone', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${vapiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumberId: campaignData.voice_config?.phone_number,
          assistantId: campaignData.voice_config?.assistant_id,
          customer: {
            number: patient.phone,
            name: `${patient.first_name} ${patient.last_name}`.trim(),
          },
          assistantOverrides: {
            variableValues: {
              patient_name: patient.first_name || 'there',
              practice_name: 'our practice', // This could be dynamic based on tenant
              ...campaignData.voice_config?.script_variables
            }
          },
          metadata: {
            tenant_id: campaignData.tenant_id,
            campaign_id: campaignData.campaign_id,
            patient_id: patient.id,
            source: 'campaign_automation'
          }
        }),
      });

      if (!vapiCall.ok) {
        const errorText = await vapiCall.text();
        console.error(`Failed to create VAPI call for patient ${patient.id}:`, errorText);
        continue;
      }

      const callResponse = await vapiCall.json();
      console.log(`Created outbound call for ${patient.first_name} ${patient.last_name}:`, callResponse.id);

      // Store the outbound call record
      const { data: voiceCall, error: callError } = await supabase
        .from('voice_calls')
        .insert({
          call_id: callResponse.id,
          patient_id: patient.id,
          call_type: 'outbound',
          call_status: 'initiated',
          call_data: {
            campaign_id: campaignData.campaign_id,
            vapi_call_data: callResponse,
            lead_score: lead.score_value
          },
          tenant_id: campaignData.tenant_id
        })
        .select()
        .single();

      if (callError) {
        console.error('Error storing voice call record:', callError);
      } else {
        callResults.push({
          patient_id: patient.id,
          voice_call_id: voiceCall.id,
          vapi_call_id: callResponse.id,
          status: 'initiated'
        });
      }

      // Add delay between calls to avoid overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error) {
      console.error(`Error creating call for patient ${patient.id}:`, error);
    }
  }

  return {
    campaign_id: campaignData.campaign_id,
    calls_initiated: callResults.length,
    results: callResults
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const campaignData: CampaignExecutionData = await req.json();
    
    console.log('Campaign automation request:', campaignData);

    let result;

    switch (campaignData.execution_type) {
      case 'voice_outbound':
        result = await executeOutboundVoiceCampaign(supabase, campaignData);
        break;
      
      default:
        throw new Error(`Unsupported execution type: ${campaignData.execution_type}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        ...result
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Campaign automation error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});