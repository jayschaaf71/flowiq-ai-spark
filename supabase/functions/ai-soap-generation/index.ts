
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { 
      transcription, 
      userId, 
      patientContext, 
      medicalTerms = [],
      icd10Suggestions = [],
      enhancedProcessing = false,
      specialty = 'chiropractic'
    } = await req.json();
    
    if (!transcription) {
      throw new Error('No transcription provided');
    }

    console.log('Generating SOAP note for user:', userId, enhancedProcessing ? '(Enhanced Mode)' : '(Standard Mode)', `Specialty: ${specialty}`);

    // Initialize Supabase client for audit logging
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Specialty-specific guidance
    const specialtyGuidance = {
      'dental-sleep': {
        focus: 'Sleep apnea symptoms, oral appliance therapy, sleep study results, and treatment compliance',
        commonICD10: 'G47.33 (OSA), G47.31 (Central Sleep Apnea), G47.00 (Insomnia)',
        commonCPT: 'E0486 (Oral Appliance), 95810 (Sleep Study), D7880 (Appliance Adjustment)',
        clinicalFlags: 'AHI scores >30, oxygen desaturation, CPAP intolerance, appliance side effects'
      },
      'chiropractic': {
        focus: 'Musculoskeletal pain, spinal alignment, range of motion, and treatment response',
        commonICD10: 'M54.5 (Low Back Pain), M54.2 (Neck Pain), M54.3 (Sciatica)',
        commonCPT: '98940 (Spinal Manipulation), 97140 (Manual Therapy), 97110 (Therapeutic Exercise)',
        clinicalFlags: 'Red flag symptoms, neurological deficits, chronic pain patterns'
      },
      'med-spa': {
        focus: 'Aesthetic concerns, treatment goals, skin condition, and post-procedure care',
        commonICD10: 'L98.8 (Facial Wrinkles), L90.2 (Acne Scars), L81.1 (Melasma)',
        commonCPT: '64612 (Botox Injection), 11950 (Dermal Filler), 17106 (Laser Resurfacing)',
        clinicalFlags: 'Allergic reactions, infection risk, unrealistic expectations'
      },
      'concierge': {
        focus: 'Preventive care, chronic disease management, wellness optimization, and comprehensive health',
        commonICD10: 'I10 (Hypertension), E11.9 (Type 2 DM), E78.5 (Hyperlipidemia)',
        commonCPT: '99397 (Preventive Exam), G0438 (Wellness Visit), 99490 (Chronic Care Management)',
        clinicalFlags: 'Care gaps, medication adherence, risk stratification needs'
      },
      'hrt': {
        focus: 'Hormonal symptoms, lab values, treatment response, and side effect monitoring',
        commonICD10: 'E29.1 (Male Hypogonadism), N95.1 (Menopause), E07.9 (Thyroid Disorder)',
        commonCPT: '11981 (Hormone Pellet), 96372 (Injection), 80327 (Hormone Monitoring)',
        clinicalFlags: 'Cardiovascular risks, polycythemia, hormone level extremes'
      }
    };

    const currentSpecialtyGuidance = specialtyGuidance[specialty] || specialtyGuidance.chiropractic;

    const systemPrompt = enhancedProcessing ?
      `You are an advanced medical AI assistant specialized in ${specialty} clinical documentation. You convert clinical conversations into structured SOAP notes with enhanced medical intelligence.

SPECIALTY FOCUS: ${currentSpecialtyGuidance.focus}

SOAP Format with Medical Intelligence:
- Subjective: Patient's reported symptoms, complaints, and relevant history
- Objective: Observable findings, vital signs, examination results
- Assessment: Clinical diagnosis with ICD-10 codes when appropriate
- Plan: Treatment plan, medications with dosages, follow-up instructions

Enhanced Instructions:
1. Extract and standardize medical terminology specific to ${specialty}
2. Suggest appropriate ICD-10 codes for diagnoses (Common codes: ${currentSpecialtyGuidance.commonICD10})
3. Recommend CPT codes for procedures mentioned (Common codes: ${currentSpecialtyGuidance.commonCPT})
4. Flag potential clinical concerns specific to ${specialty}: ${currentSpecialtyGuidance.clinicalFlags}
5. Use professional medical terminology and standard abbreviations
6. Include confidence scoring for medical assessments
7. Only include information that was actually mentioned
8. Flag any missing critical information

Medical Context Provided:
- Identified Medical Terms: ${JSON.stringify(medicalTerms)}
- ICD-10 Suggestions: ${JSON.stringify(icd10Suggestions)}
- Specialty: ${specialty}

Return your response as a JSON object with this exact structure:
{
  "subjective": "string",
  "objective": "string", 
  "assessment": "string",
  "plan": "string",
  "icd10Codes": ["array of suggested ICD-10 codes"],
  "cptCodes": ["array of suggested CPT codes"],
  "clinicalFlags": ["array of clinical concerns or alerts"],
  "confidence": number,
  "medicalTermsUsed": ["array of standardized medical terms used"],
  "specialty": "${specialty}"
}` :
      `You are a medical AI assistant that converts clinical conversations into structured SOAP notes. 

SOAP Format:
- Subjective: Patient's reported symptoms, complaints, and relevant history
- Objective: Observable findings, vital signs, examination results
- Assessment: Clinical diagnosis or impression
- Plan: Treatment plan, medications, follow-up instructions

Instructions:
1. Extract relevant medical information from the transcription
2. Organize it into proper SOAP format
3. Use professional medical terminology
4. Be concise but thorough
5. Only include information that was actually mentioned
6. If information is missing for a section, note it appropriately

Return your response as a JSON object with this exact structure:
{
  "subjective": "string",
  "objective": "string", 
  "assessment": "string",
  "plan": "string"
}`;

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
          { role: 'user', content: `Please convert this clinical transcription into a SOAP note:\n\n${transcription}` }
        ],
        temperature: 0.3,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API Error:', response.status, errorText);
      throw new Error(`OpenAI API error (${response.status}): ${errorText}`);
    }

    const aiResponse = await response.json();
    console.log('OpenAI Response received:', aiResponse.choices?.[0]?.message?.content ? 'Success' : 'No content');
    
    if (!aiResponse.choices?.[0]?.message?.content) {
      throw new Error('No content returned from OpenAI API');
    }
    
    const soapNote = JSON.parse(aiResponse.choices[0].message.content);

    // Log the SOAP generation event for HIPAA audit
    const { error: auditError } = await supabase
      .from('audit_logs')
      .insert({
        user_id: userId,
        action: 'AI_SOAP_GENERATION',
        table_name: 'soap_notes',
        new_values: {
          transcriptionLength: transcription.length,
          timestamp: new Date().toISOString(),
          enhancedProcessing: enhancedProcessing,
          medicalTermsCount: medicalTerms.length,
          icd10SuggestionsCount: icd10Suggestions.length,
          complianceNote: 'SOAP note generated with AI assistance'
        }
      });

    if (auditError) {
      console.error('Audit logging error:', auditError);
    }

    return new Response(
      JSON.stringify({ 
        ...soapNote,
        generatedAt: new Date().toISOString(),
        complianceStatus: 'HIPAA_COMPLIANT',
        enhancedProcessing: enhancedProcessing
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('SOAP generation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
