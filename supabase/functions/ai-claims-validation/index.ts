import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { claimData, validationType = 'comprehensive' } = await req.json();
    
    if (!claimData) {
      throw new Error('Claim data is required');
    }

    console.log('Processing claim validation:', { claimId: claimData.id, type: validationType });

    const systemPrompt = `You are an expert medical billing and claims validation AI. Your role is to analyze healthcare claims for accuracy, compliance, and potential issues.

Key areas to validate:
- CPT/HCPCS procedure codes accuracy and medical necessity
- ICD-10 diagnosis codes alignment with procedures
- Billing amounts vs standard rates and geographic location
- Prior authorization requirements
- Insurance coverage and eligibility
- HIPAA compliance and documentation
- Denial risk assessment
- Coding accuracy and bundling rules

Respond with a structured JSON analysis including:
- overall_score (0-100, higher is better)
- validation_status ("approved", "needs_review", "rejected")
- issues (array of specific problems found)
- suggestions (array of actionable recommendations)
- denial_risk ("low", "medium", "high")
- compliance_flags (array of regulatory concerns)
- estimated_approval_amount (if different from submitted)`;

    const userPrompt = `Analyze this healthcare claim:

Patient: ${claimData.patient_id}
Claim Number: ${claimData.claim_number || 'N/A'}
Total Amount: $${claimData.total_amount || 0}
Payer: ${claimData.payer_name || 'Unknown'}
Status: ${claimData.status || 'draft'}

Diagnosis Codes: ${JSON.stringify(claimData.diagnosis_codes || [])}
Procedure Codes: ${JSON.stringify(claimData.procedure_codes || [])}

Date of Service: ${claimData.submitted_date || 'Not specified'}
Notes: ${claimData.notes || 'None provided'}

Provide comprehensive validation analysis focusing on ${validationType} review.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.1,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${errorText}`);
    }

    const data = await response.json();
    let validationResult;
    
    try {
      validationResult = JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', data.choices[0].message.content);
      // Fallback response structure
      validationResult = {
        overall_score: 75,
        validation_status: "needs_review",
        issues: ["AI response parsing error - manual review recommended"],
        suggestions: ["Review claim manually due to system error"],
        denial_risk: "medium",
        compliance_flags: [],
        estimated_approval_amount: claimData.total_amount
      };
    }

    // Log the validation for audit purposes
    console.log('AI Validation completed:', {
      claimId: claimData.id,
      score: validationResult.overall_score,
      status: validationResult.validation_status,
      riskLevel: validationResult.denial_risk
    });

    return new Response(
      JSON.stringify({
        claim_id: claimData.id,
        validation_result: validationResult,
        processed_at: new Date().toISOString(),
        validation_type: validationType
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in AI claims validation:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Validation failed', 
        details: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});