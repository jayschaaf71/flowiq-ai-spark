import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { transcript, formFields, currentFormData } = await req.json();
    
    if (!transcript || !formFields) {
      throw new Error('Transcript and form fields are required');
    }

    console.log('Processing AI form completion...');
    console.log('Transcript:', transcript);
    console.log('Form fields:', formFields.map((f: any) => f.label));

    // Create detailed prompt for AI processing
    const systemPrompt = `You are an AI assistant that helps extract and organize patient information from voice transcripts into structured form data.

Your task is to:
1. Extract relevant information from the voice transcript
2. Map it to the appropriate form fields
3. Validate and format the data correctly
4. Return a JSON object with the extracted information

Form Fields Available:
${formFields.map((field: any) => `- ${field.label} (${field.type}): ${field.description || ''}`).join('\n')}

Current Form Data:
${JSON.stringify(currentFormData, null, 2)}

Rules:
- Only extract information that is clearly stated in the transcript
- Use proper formatting (dates as YYYY-MM-DD, phone numbers as (XXX) XXX-XXXX)
- For multiple choice fields, match to the closest option
- If information is unclear or missing, leave the field empty
- Return only the JSON object, no additional text
- Preserve existing form data and only update fields mentioned in the transcript`;

    const userPrompt = `Voice transcript to process: "${transcript}"

Please extract and structure the information into the form fields. Return a JSON object with field names as keys and extracted values as values.`;

    // Call OpenAI GPT for intelligent form processing
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.1,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${errorText}`);
    }

    const aiResponse = await response.json();
    const extractedData = aiResponse.choices[0].message.content;
    
    console.log('AI extracted data:', extractedData);

    // Parse AI response as JSON
    let processedData;
    try {
      processedData = JSON.parse(extractedData);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', extractedData);
      throw new Error('Failed to process form data from transcript');
    }

    // Validate extracted data against form fields
    const validatedData = validateAndFormatData(processedData, formFields);

    // Generate completion suggestions
    const completionSuggestions = generateCompletionSuggestions(validatedData, formFields);

    return new Response(
      JSON.stringify({ 
        extractedData: validatedData,
        completionSuggestions,
        confidence: calculateConfidence(validatedData, formFields)
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('AI form processor error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function validateAndFormatData(data: any, formFields: any[]) {
  const validated: any = {};
  
  formFields.forEach(field => {
    const value = data[field.name] || data[field.label];
    if (value !== undefined && value !== null && value !== '') {
      
      switch (field.type) {
        case 'email':
          if (isValidEmail(value)) {
            validated[field.name] = value.toLowerCase();
          }
          break;
          
        case 'phone':
          const formattedPhone = formatPhoneNumber(value);
          if (formattedPhone) {
            validated[field.name] = formattedPhone;
          }
          break;
          
        case 'date':
          const formattedDate = formatDate(value);
          if (formattedDate) {
            validated[field.name] = formattedDate;
          }
          break;
          
        case 'select':
          if (field.options && field.options.some((opt: any) => 
            opt.value.toLowerCase() === value.toLowerCase() || 
            opt.label.toLowerCase() === value.toLowerCase()
          )) {
            validated[field.name] = value;
          }
          break;
          
        default:
          validated[field.name] = value;
      }
    }
  });
  
  return validated;
}

function generateCompletionSuggestions(data: any, formFields: any[]) {
  const suggestions: string[] = [];
  const missingFields = formFields.filter(field => 
    field.required && !data[field.name]
  );
  
  if (missingFields.length > 0) {
    suggestions.push(`Missing required information: ${missingFields.map(f => f.label).join(', ')}`);
  }
  
  return suggestions;
}

function calculateConfidence(data: any, formFields: any[]) {
  const totalFields = formFields.length;
  const filledFields = Object.keys(data).length;
  return Math.min(0.95, (filledFields / totalFields) * 0.8 + 0.2);
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function formatPhoneNumber(phone: string): string | null {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  } else if (digits.length === 11 && digits[0] === '1') {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return null;
}

function formatDate(dateStr: string): string | null {
  try {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
  } catch {
    // Try to parse common date formats
    const formats = [
      /(\d{1,2})\/(\d{1,2})\/(\d{4})/,  // MM/DD/YYYY
      /(\d{1,2})-(\d{1,2})-(\d{4})/,   // MM-DD-YYYY
      /(\d{4})-(\d{1,2})-(\d{1,2})/    // YYYY-MM-DD
    ];
    
    for (const format of formats) {
      const match = dateStr.match(format);
      if (match) {
        const [, p1, p2, p3] = match;
        if (format === formats[2]) { // YYYY-MM-DD
          return `${p1}-${p2.padStart(2, '0')}-${p3.padStart(2, '0')}`;
        } else { // MM/DD/YYYY or MM-DD-YYYY
          return `${p3}-${p1.padStart(2, '0')}-${p2.padStart(2, '0')}`;
        }
      }
    }
  }
  return null;
}