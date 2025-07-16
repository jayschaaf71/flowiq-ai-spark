import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Appointment type templates from the reference templates
const appointmentTypes = [
  {
    type: 'Sleep Apnea Consultation',
    keywords: ['snoring', 'sleep apnea', 'apnea', 'sleep study', 'CPAP', 'consultation', 'initial', 'epworth', 'sleepiness', 'fatigue'],
    specialty: 'Dental Sleep Medicine'
  },
  {
    type: 'Oral Appliance Delivery',
    keywords: ['appliance delivery', 'mandibular advancement', 'oral appliance', 'fitting', 'MAD', 'delivery', 'titration'],
    specialty: 'Dental Sleep Medicine'
  },
  {
    type: 'Oral Appliance Follow-up',
    keywords: ['follow-up', 'adjustment', 'appliance', 'compliance', 'titration', 'advancement', 'TMJ', 'side effects'],
    specialty: 'Dental Sleep Medicine'
  },
  {
    type: 'Sleep Bruxism Evaluation',
    keywords: ['bruxism', 'grinding', 'clenching', 'wear facets', 'night guard', 'TMJ', 'jaw pain', 'headaches'],
    specialty: 'Dental Sleep Medicine'
  },
  {
    type: 'General Consultation',
    keywords: ['consultation', 'examination', 'chief complaint', 'history', 'physical exam'],
    specialty: 'Primary Care'
  },
  {
    type: 'Follow-up Visit',
    keywords: ['follow-up', 'routine', 'monitoring', 'progress', 'medication', 'treatment response'],
    specialty: 'General'
  },
  {
    type: 'Acute Care Visit',
    keywords: ['acute', 'urgent', 'emergency', 'sudden onset', 'immediate', 'pain', 'infection'],
    specialty: 'Emergency/Urgent Care'
  },
  {
    type: 'Preventive Care',
    keywords: ['annual', 'physical', 'screening', 'prevention', 'wellness', 'checkup', 'vaccination'],
    specialty: 'Primary Care'
  }
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { transcription, soapNotes, recordingId } = await req.json();

    if (!transcription || !soapNotes) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Analyzing appointment type for recording:', recordingId);

    // Analyze transcription to determine appointment type
    const appointmentTypeAnalysis = await analyzeAppointmentType(transcription, soapNotes);
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    // Update the voice recording with appointment type
    const { error: updateError } = await supabase
      .from('voice_recordings')
      .update({
        metadata: {
          appointment_type: appointmentTypeAnalysis.type,
          appointment_specialty: appointmentTypeAnalysis.specialty,
          confidence_score: appointmentTypeAnalysis.confidence,
          analysis_timestamp: new Date().toISOString()
        }
      })
      .eq('id', recordingId);

    if (updateError) {
      console.error('Error updating voice recording:', updateError);
      throw updateError;
    }

    // Get the recording to find patient_id
    const { data: recording, error: recordingError } = await supabase
      .from('voice_recordings')
      .select('patient_id, tenant_id, user_id')
      .eq('id', recordingId)
      .single();

    if (recordingError || !recording) {
      console.error('Error fetching recording:', recordingError);
      throw recordingError || new Error('Recording not found');
    }

    // Create medical record entry if patient is linked
    if (recording.patient_id) {
      const medicalRecord = {
        patient_id: recording.patient_id,
        record_type: 'soap_note',
        content: {
          ...soapNotes,
          appointment_type: appointmentTypeAnalysis.type,
          appointment_specialty: appointmentTypeAnalysis.specialty,
          voice_recording_id: recordingId,
          transcription_summary: transcription.substring(0, 500) + '...'
        },
        diagnosis: soapNotes.assessment || '',
        treatment: soapNotes.plan || '',
        notes: `AI-generated SOAP note from ${appointmentTypeAnalysis.type}`,
        created_by: recording.user_id,
        tenant_id: recording.tenant_id
      };

      const { error: medicalRecordError } = await supabase
        .from('medical_records')
        .insert(medicalRecord);

      if (medicalRecordError) {
        console.error('Error creating medical record:', medicalRecordError);
        // Don't throw here - the appointment type analysis was successful
        console.log('Medical record creation failed, but appointment type analysis completed');
      } else {
        console.log('Medical record created successfully for patient:', recording.patient_id);
      }
    }

    return new Response(JSON.stringify({
      appointmentType: appointmentTypeAnalysis.type,
      specialty: appointmentTypeAnalysis.specialty,
      confidence: appointmentTypeAnalysis.confidence,
      medicalRecordCreated: !!recording.patient_id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-soap-appointment-type function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function analyzeAppointmentType(transcription: string, soapNotes: any) {
  const combinedText = `${transcription} ${soapNotes.subjective || ''} ${soapNotes.objective || ''} ${soapNotes.assessment || ''} ${soapNotes.plan || ''}`.toLowerCase();

  // Score each appointment type based on keyword matches
  const scores = appointmentTypes.map(type => {
    const matchCount = type.keywords.filter(keyword => 
      combinedText.includes(keyword.toLowerCase())
    ).length;
    
    return {
      type: type.type,
      specialty: type.specialty,
      score: matchCount,
      confidence: Math.min(matchCount / type.keywords.length, 1.0)
    };
  });

  // Sort by score and get the best match
  scores.sort((a, b) => b.score - a.score);
  const bestMatch = scores[0];

  // If confidence is too low, use AI to make a more informed decision
  if (bestMatch.confidence < 0.3) {
    try {
      const aiAnalysis = await analyzeWithAI(transcription, soapNotes);
      return aiAnalysis;
    } catch (error) {
      console.error('AI analysis failed, using keyword match:', error);
      return bestMatch.score > 0 ? bestMatch : {
        type: 'General Consultation',
        specialty: 'Primary Care',
        confidence: 0.5
      };
    }
  }

  return bestMatch;
}

async function analyzeWithAI(transcription: string, soapNotes: any) {
  const prompt = `Analyze this medical transcription and SOAP note to determine the appointment type.

Transcription: ${transcription.substring(0, 1000)}

SOAP Note:
Subjective: ${soapNotes.subjective || 'N/A'}
Objective: ${soapNotes.objective || 'N/A'}
Assessment: ${soapNotes.assessment || 'N/A'}
Plan: ${soapNotes.plan || 'N/A'}

Available appointment types:
${appointmentTypes.map(t => `- ${t.type} (${t.specialty})`).join('\n')}

Return only a JSON object with:
{
  "type": "exact appointment type name",
  "specialty": "specialty name", 
  "confidence": 0.0-1.0
}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a medical appointment classifier. Return only valid JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.1,
      max_tokens: 200
    }),
  });

  const data = await response.json();
  const aiResult = JSON.parse(data.choices[0].message.content);
  
  return {
    type: aiResult.type,
    specialty: aiResult.specialty,
    confidence: aiResult.confidence
  };
}