import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { 
      symptoms, 
      patientHistory, 
      vitalSigns, 
      physicalExam, 
      labResults,
      specialty,
      patientAge,
      patientGender 
    } = await req.json();

    console.log('Generating clinical decision support for:', { specialty, patientAge, patientGender });

    const prompt = `As an expert ${specialty} physician, provide clinical decision support based on the following patient information:

Patient Demographics:
- Age: ${patientAge}
- Gender: ${patientGender}

Chief Complaint & Symptoms:
${symptoms}

Medical History:
${patientHistory}

Vital Signs:
${vitalSigns ? JSON.stringify(vitalSigns, null, 2) : 'Not provided'}

Physical Examination:
${physicalExam}

Laboratory Results:
${labResults || 'Not provided'}

Please provide a comprehensive clinical decision support analysis including:

1. DIFFERENTIAL DIAGNOSIS (ranked by likelihood with percentages):
   - List top 5 most likely diagnoses
   - Include ICD-10 codes
   - Provide brief rationale for each

2. RECOMMENDED DIAGNOSTIC TESTS:
   - Laboratory tests needed
   - Imaging studies if indicated
   - Other diagnostic procedures
   - Urgency level for each

3. TREATMENT RECOMMENDATIONS:
   - Immediate interventions needed
   - Medication recommendations with dosing
   - Non-pharmacological treatments
   - Lifestyle modifications

4. RED FLAGS & WARNINGS:
   - Critical symptoms to monitor
   - When to seek immediate care
   - Drug interactions or contraindications

5. FOLLOW-UP PLAN:
   - Recommended follow-up timeline
   - What to monitor during follow-up
   - When to refer to specialist

6. PATIENT EDUCATION POINTS:
   - Key information for patient
   - Warning signs to watch for

7. EVIDENCE LEVEL:
   - Rate recommendations (A, B, C evidence)
   - Include relevant guidelines

Format response as structured JSON for easy parsing.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { 
            role: 'system', 
            content: `You are an expert ${specialty} physician with extensive clinical experience. Provide evidence-based clinical decision support following current medical guidelines and best practices. Always emphasize the importance of clinical judgment and that AI recommendations should supplement, not replace, physician decision-making.` 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 2500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    let clinicalSupport;

    try {
      clinicalSupport = JSON.parse(data.choices[0].message.content);
    } catch (e) {
      // If JSON parsing fails, create a structured format
      const content = data.choices[0].message.content;
      clinicalSupport = {
        differentialDiagnosis: extractSection(content, 'DIFFERENTIAL DIAGNOSIS'),
        diagnosticTests: extractSection(content, 'RECOMMENDED DIAGNOSTIC TESTS'),
        treatmentRecommendations: extractSection(content, 'TREATMENT RECOMMENDATIONS'),
        redFlags: extractSection(content, 'RED FLAGS'),
        followUpPlan: extractSection(content, 'FOLLOW-UP PLAN'),
        patientEducation: extractSection(content, 'PATIENT EDUCATION'),
        evidenceLevel: extractSection(content, 'EVIDENCE LEVEL'),
        fullResponse: content
      };
    }

    console.log('Clinical decision support generated successfully');

    // Log the clinical decision support request for audit purposes
    await supabase
      .from('audit_logs')
      .insert({
        table_name: 'clinical_decision_support',
        action: 'AI_CONSULTATION',
        user_id: 'system',
        new_values: {
          specialty,
          patientAge,
          patientGender,
          symptoms: symptoms.substring(0, 200), // Truncate for storage
          timestamp: new Date().toISOString()
        }
      });

    return new Response(
      JSON.stringify({ 
        clinicalSupport,
        timestamp: new Date().toISOString(),
        specialty,
        disclaimer: "This AI-generated clinical decision support is for informational purposes only and should not replace professional medical judgment. Always consult with qualified healthcare professionals for patient care decisions."
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in clinical-decision-support:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to generate clinical decision support'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function extractSection(text: string, sectionName: string): string {
  const regex = new RegExp(`${sectionName}:?\\s*([\\s\\S]*?)(?=\\n\\n[A-Z]|$)`, 'i');
  const match = text.match(regex);
  return match ? match[1].trim() : '';
}