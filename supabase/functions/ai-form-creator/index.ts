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
    const { content, formText, fileName } = await req.json();
    
    // Handle both parameter formats for flexibility
    const textContent = content || formText;
    
    if (!textContent) {
      throw new Error('Form content is required');
    }

    console.log('Processing AI form creation...');
    console.log('Form text length:', textContent.length);
    console.log('File name:', fileName);

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
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.1,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${errorText}`);
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
      throw new Error('Failed to process form structure from text');
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