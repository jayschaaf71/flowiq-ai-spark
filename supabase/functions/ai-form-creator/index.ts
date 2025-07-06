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
    const body = await req.json();
    console.log('Received request body:', body);
    
    const { content, formText, fileName } = body;
    
    // Handle both parameter formats for flexibility
    const textContent = content || formText;
    
    if (!textContent) {
      console.error('No form content provided');
      return new Response(
        JSON.stringify({ error: 'Form content is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Processing AI form creation...');
    console.log('Form text length:', textContent.length);
    console.log('File name:', fileName);
    
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      console.error('OpenAI API key not found');
      return new Response(
        JSON.stringify({ 
          error: 'OpenAI API key not configured. Please add your OpenAI API key in Supabase Edge Function secrets.' 
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    console.log('OpenAI API key found:', apiKey.slice(0, 10) + '...');

    // Create detailed prompt for AI form processing
    const systemPrompt = `You are an AI assistant that converts unstructured form text into structured form field definitions.

Your task is to:
1. Analyze the provided form text
2. Extract field labels, types, and properties
3. Determine field validation requirements
4. Generate a JSON structure for form creation

Field types available:
- text: Single line text input
- textarea: Multi-line text input  
- email: Email input with validation
- phone: Phone number input
- date: Date picker
- number: Numeric input
- select: Dropdown with options
- radio: Radio button group
- checkbox: Checkbox input

Return a JSON object with this structure:
{
  "title": "Form Title",
  "description": "Brief description", 
  "fields": [
    {
      "id": "unique_field_id",
      "type": "field_type",
      "label": "Field Label", 
      "placeholder": "Placeholder text",
      "required": true/false,
      "options": ["option1", "option2"] // only for select/radio fields
    }
  ]
}

Rules:
- Generate meaningful field IDs using snake_case
- Detect field types from context (email for email, phone for phone, etc.)
- Mark fields as required if indicated with * or context suggests it
- For select/radio fields, extract all options
- Use appropriate placeholders
- Generate a descriptive form title and description`;

    const userPrompt = `Convert this form text into structured fields:

${textContent}

Please analyze and convert to JSON format.`;

    // Call OpenAI GPT for intelligent form processing
    console.log('Making OpenAI API call...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.1,
        max_tokens: 3000,
      }),
    });
    
    console.log('OpenAI response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      return new Response(
        JSON.stringify({ 
          error: `OpenAI API error: ${response.status} ${response.statusText}`,
          details: errorText
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const aiResponse = await response.json();
    const structuredForm = aiResponse.choices[0].message.content;
    
    console.log('AI generated form:', structuredForm);

    // Parse AI response as JSON
    let formData;
    try {
      formData = JSON.parse(structuredForm);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', structuredForm);
      console.error('Parse error:', parseError);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to process AI response. The AI returned invalid JSON format.',
          details: structuredForm
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate and clean the form data
    const validatedFields = validateFormFields(formData.fields || []);

    return new Response(
      JSON.stringify({ 
        title: formData.title || 'AI Generated Form',
        description: formData.description || 'Form created from uploaded content',
        fields: validatedFields
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('AI form creator error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function validateFormFields(fields: any[]): any[] {
  const validTypes = ['text', 'textarea', 'email', 'phone', 'date', 'number', 'select', 'radio', 'checkbox'];
  
  return fields.map((field, index) => {
    // Ensure valid field structure
    const validatedField = {
      id: field.id || `field_${Date.now()}_${index}`,
      type: validTypes.includes(field.type) ? field.type : 'text',
      label: field.label || `Field ${index + 1}`,
      required: Boolean(field.required),
      placeholder: field.placeholder || undefined,
      options: field.options && Array.isArray(field.options) ? field.options : undefined
    };

    // Remove options for non-select/radio fields
    if (validatedField.type !== 'select' && validatedField.type !== 'radio') {
      delete validatedField.options;
    }

    return validatedField;
  }).filter(field => field.label && field.label.trim().length > 0);
}