
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { clinicalNotes, procedureType, diagnosis, specialty } = await req.json();
    
    console.log('Processing medical coding request for specialty:', specialty);

    const systemPrompt = `You are an expert medical coder with extensive knowledge of CPT, ICD-10-CM, and HCPCS codes. 
Your task is to analyze clinical documentation and assign appropriate medical codes with confidence scores.

Instructions:
1. Analyze the clinical notes and procedure information
2. Assign the most appropriate CPT codes for procedures
3. Assign relevant ICD-10-CM codes for diagnoses
4. Include HCPCS codes if applicable
5. Provide confidence scores (0.0 to 1.0) for each code
6. Include modifiers where appropriate
7. Flag cases that require human review (confidence < 0.8)

Specialty context: ${specialty}
Return response as JSON with this structure:
{
  "codes": [
    {
      "code": "string",
      "codeType": "CPT|ICD-10-CM|HCPCS",
      "description": "string",
      "confidence": number,
      "modifiers": ["string"] (optional)
    }
  ],
  "overallConfidence": number,
  "suggestions": ["string"],
  "requiresReview": boolean
}`;

    const userPrompt = `Clinical Notes: ${clinicalNotes}
Procedure Type: ${procedureType}
Diagnoses: ${diagnosis.join(', ')}
Specialty: ${specialty}

Please provide appropriate medical codes for this clinical documentation.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 1000
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log('AI Response:', aiResponse);

    try {
      const codingResult = JSON.parse(aiResponse);
      return new Response(JSON.stringify(codingResult), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      
      // Fallback response
      return new Response(JSON.stringify({
        codes: [
          {
            code: procedureType === 'consultation' ? '99213' : '99213',
            codeType: 'CPT',
            description: 'Office visit - established patient',
            confidence: 0.7
          }
        ],
        overallConfidence: 0.7,
        suggestions: ['AI parsing failed - manual review recommended'],
        requiresReview: true
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Medical coding error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      codes: [],
      overallConfidence: 0,
      suggestions: ['System error - manual coding required'],
      requiresReview: true
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
