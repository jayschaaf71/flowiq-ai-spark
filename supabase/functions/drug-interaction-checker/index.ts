import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Comprehensive drug interaction database (subset for demo)
const drugInteractions = {
  'warfarin': {
    'aspirin': { severity: 'major', effect: 'Increased bleeding risk' },
    'ibuprofen': { severity: 'moderate', effect: 'Increased anticoagulant effect' },
    'amoxicillin': { severity: 'moderate', effect: 'Enhanced anticoagulation' }
  },
  'metformin': {
    'furosemide': { severity: 'moderate', effect: 'Risk of lactic acidosis' },
    'prednisone': { severity: 'moderate', effect: 'Hyperglycemia' }
  },
  'lisinopril': {
    'potassium': { severity: 'major', effect: 'Hyperkalemia risk' },
    'ibuprofen': { severity: 'moderate', effect: 'Reduced antihypertensive effect' }
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { medications, newMedication, patientConditions, allergies } = await req.json();

    console.log('Checking drug interactions for:', { medications, newMedication });

    // Check for known drug interactions
    const interactions = [];
    const allMedications = [...medications, newMedication].map(med => 
      typeof med === 'string' ? med.toLowerCase() : med.name.toLowerCase()
    );

    // Check pairwise interactions
    for (let i = 0; i < allMedications.length; i++) {
      for (let j = i + 1; j < allMedications.length; j++) {
        const med1 = allMedications[i];
        const med2 = allMedications[j];
        
        if (drugInteractions[med1] && drugInteractions[med1][med2]) {
          interactions.push({
            medication1: med1,
            medication2: med2,
            ...drugInteractions[med1][med2]
          });
        } else if (drugInteractions[med2] && drugInteractions[med2][med1]) {
          interactions.push({
            medication1: med2,
            medication2: med1,
            ...drugInteractions[med2][med1]
          });
        }
      }
    }

    // Use AI for comprehensive analysis
    const prompt = `As a clinical pharmacist, analyze the following medication regimen for interactions, contraindications, and safety concerns:

Current Medications: ${medications.join(', ')}
New Medication: ${newMedication}
Patient Conditions: ${patientConditions.join(', ')}
Known Allergies: ${allergies.join(', ')}

Please provide:
1. Drug-drug interactions (severity and mechanism)
2. Drug-disease contraindications
3. Allergy considerations
4. Dosing recommendations
5. Monitoring parameters
6. Alternative medications if interactions found

Format as JSON with structured data for each category.`;

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
            content: 'You are a clinical pharmacist with expertise in drug interactions, contraindications, and medication safety. Provide evidence-based recommendations.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    let aiAnalysis;

    try {
      aiAnalysis = JSON.parse(data.choices[0].message.content);
    } catch (e) {
      aiAnalysis = {
        error: "Could not parse AI response",
        rawResponse: data.choices[0].message.content
      };
    }

    console.log('Drug interaction analysis completed');

    return new Response(
      JSON.stringify({ 
        knownInteractions: interactions,
        aiAnalysis,
        timestamp: new Date().toISOString(),
        riskLevel: interactions.length > 0 ? 'high' : 'low',
        recommendationSummary: interactions.length > 0 
          ? 'Drug interactions detected - review required'
          : 'No major interactions detected'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in drug-interaction-checker:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to check drug interactions'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});