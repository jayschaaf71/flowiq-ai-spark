import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  context?: string;
}

// Available functions that Sage can call
const availableFunctions = [
  {
    name: "create_appointment",
    description: "Create a new appointment for a patient. Use this when the user asks to schedule, book, or set up an appointment.",
    parameters: {
      type: "object",
      properties: {
        patientName: {
          type: "string",
          description: "Full name of the patient"
        },
        appointmentDate: {
          type: "string",
          description: "Date of the appointment in YYYY-MM-DD format"
        },
        appointmentTime: {
          type: "string", 
          description: "Time of the appointment in HH:MM format (24-hour)"
        },
        appointmentType: {
          type: "string",
          description: "Type of appointment (e.g., consultation, follow-up, sleep study)"
        },
        patientPhone: {
          type: "string",
          description: "Patient's phone number (optional)"
        },
        patientEmail: {
          type: "string", 
          description: "Patient's email address (optional)"
        },
        provider: {
          type: "string",
          description: "Provider name (optional)"
        },
        notes: {
          type: "string",
          description: "Additional notes for the appointment (optional)"
        }
      },
      required: ["patientName", "appointmentDate", "appointmentTime"]
    }
  },
  {
    name: "add_patient",
    description: "Add a new patient to the system. Use this when the user asks to add, create, or register a new patient.",
    parameters: {
      type: "object", 
      properties: {
        firstName: {
          type: "string",
          description: "Patient's first name"
        },
        lastName: {
          type: "string",
          description: "Patient's last name"
        },
        email: {
          type: "string",
          description: "Patient's email address (optional)"
        },
        phone: {
          type: "string", 
          description: "Patient's phone number (optional)"
        },
        dateOfBirth: {
          type: "string",
          description: "Patient's date of birth in YYYY-MM-DD format (optional)"
        },
        address: {
          type: "string",
          description: "Patient's address (optional)"
        },
        insuranceProvider: {
          type: "string",
          description: "Patient's insurance provider (optional)"
        },
        emergencyContactName: {
          type: "string",
          description: "Emergency contact name (optional)"
        },
        emergencyContactPhone: {
          type: "string",
          description: "Emergency contact phone (optional)"
        }
      },
      required: ["firstName", "lastName"]
    }
  }
];

async function callFunction(functionName: string, parameters: any) {
  console.log(`Calling function: ${functionName}`, parameters);
  
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
  
  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/${functionName.replace('_', '-')}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'apikey': supabaseAnonKey
      },
      body: JSON.stringify(parameters)
    });

    const result = await response.json();
    console.log(`Function ${functionName} result:`, result);
    
    return {
      success: response.ok,
      data: result
    };
  } catch (error) {
    console.error(`Error calling function ${functionName}:`, error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Helper function to parse natural language dates
function parseDate(dateString: string): string {
  const today = new Date();
  const lowerDate = dateString.toLowerCase();
  
  if (lowerDate.includes('today')) {
    return today.toISOString().split('T')[0];
  } else if (lowerDate.includes('tomorrow')) {
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  } else if (lowerDate.includes('next tuesday') || lowerDate.includes('tuesday')) {
    const nextTuesday = new Date(today);
    const daysUntilTuesday = (2 - today.getDay() + 7) % 7 || 7;
    nextTuesday.setDate(today.getDate() + daysUntilTuesday);
    return nextTuesday.toISOString().split('T')[0];
  } else if (lowerDate.includes('next wednesday') || lowerDate.includes('wednesday')) {
    const nextWednesday = new Date(today);
    const daysUntilWednesday = (3 - today.getDay() + 7) % 7 || 7;
    nextWednesday.setDate(today.getDate() + daysUntilWednesday);
    return nextWednesday.toISOString().split('T')[0];
  }
  
  // Try to parse YYYY-MM-DD format
  if (/\d{4}-\d{2}-\d{2}/.test(dateString)) {
    return dateString;
  }
  
  // Default to today if we can't parse
  return today.toISOString().split('T')[0];
}

// Helper function to parse natural language times
function parseTime(timeString: string): string {
  const lowerTime = timeString.toLowerCase();
  
  if (lowerTime.includes('2pm') || lowerTime.includes('2:00pm')) {
    return '14:00';
  } else if (lowerTime.includes('3pm') || lowerTime.includes('3:00pm')) {
    return '15:00';
  } else if (lowerTime.includes('10am') || lowerTime.includes('10:00am')) {
    return '10:00';
  } else if (lowerTime.includes('11am') || lowerTime.includes('11:00am')) {
    return '11:00';
  }
  
  // Try to parse HH:MM format
  if (/\d{1,2}:\d{2}/.test(timeString)) {
    return timeString;
  }
  
  // Default to 2pm if we can't parse
  return '14:00';
}

serve(async (req) => {
  console.log('=== AI Help Assistant Request ===');
  console.log('Request method:', req.method);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    console.error('OpenAI API key not configured');
    return new Response(JSON.stringify({ 
      error: 'OpenAI API key not configured' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { message, context, conversationHistory, specialty, brandName } = await req.json();
    
    console.log('Processing help request:', message);
    console.log('Context:', context);
    console.log('Brand:', brandName);
    console.log('Specialty:', specialty);

    // Enhanced system prompt with function calling capabilities
    const systemPrompt = `You are Sage AI, a highly capable practice management assistant for ${brandName || 'FlowiQ'}. You can both provide guidance AND take actions to help users accomplish their tasks.

CRITICAL INSTRUCTIONS:
- You can perform actual actions in the system, not just provide instructions
- When users ask you to DO something (like "schedule an appointment" or "add a patient"), you should USE the available functions to actually perform the action
- Only provide step-by-step instructions when users ask HOW to do something themselves
- ALWAYS be specific and actionable in your responses
- Use the context: ${context}

AVAILABLE ACTIONS YOU CAN PERFORM:
1. CREATE APPOINTMENTS: When asked to schedule, book, or set up appointments
2. ADD PATIENTS: When asked to add, create, or register new patients
3. MORE ACTIONS COMING SOON: Claims processing, forms, etc.

RESPONSE STYLE:
- Keep responses under 200 words but actionable
- When you perform an action, confirm what you did
- For guidance questions, provide specific navigation steps
- Focus on getting users to their goal quickly

Context: ${context}
Specialty: ${specialty}
Brand: ${brandName}`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.slice(-5).map((msg: ChatMessage) => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      { role: "user", content: message }
    ];

    console.log('Calling OpenAI with function calling capabilities...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: messages,
        functions: availableFunctions,
        function_call: "auto",
        temperature: 0.7,
        max_tokens: 300
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', response.status, errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response received:', data);

    let aiResponse = '';
    let actionsPerformed = [];

    // Check if the AI wants to call a function
    if (data.choices[0].message.function_call) {
      const functionCall = data.choices[0].message.function_call;
      const functionName = functionCall.name;
      let functionArgs = JSON.parse(functionCall.arguments);

      console.log('AI wants to call function:', functionName, functionArgs);

      // Special handling for appointment creation with natural language parsing
      if (functionName === 'create_appointment') {
        if (functionArgs.appointmentDate && !functionArgs.appointmentDate.match(/\d{4}-\d{2}-\d{2}/)) {
          functionArgs.appointmentDate = parseDate(functionArgs.appointmentDate);
        }
        if (functionArgs.appointmentTime && !functionArgs.appointmentTime.match(/\d{2}:\d{2}/)) {
          functionArgs.appointmentTime = parseTime(functionArgs.appointmentTime);
        }
      }

      // Call the function
      const functionResult = await callFunction(functionName, functionArgs);
      actionsPerformed.push({
        function: functionName,
        arguments: functionArgs,
        result: functionResult
      });

      // Generate a follow-up response based on the function result
      const followUpMessages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
        { role: "assistant", content: null, function_call: functionCall },
        { role: "function", name: functionName, content: JSON.stringify(functionResult) }
      ];

      const followUpResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-2025-04-14',
          messages: followUpMessages,
          temperature: 0.7,
          max_tokens: 200
        }),
      });

      if (followUpResponse.ok) {
        const followUpData = await followUpResponse.json();
        aiResponse = followUpData.choices[0].message.content;
      } else {
        aiResponse = functionResult.success 
          ? `✅ Action completed successfully! ${functionResult.data.message}` 
          : `❌ Action failed: ${functionResult.error}`;
      }
    } else {
      // Regular response without function call
      aiResponse = data.choices[0].message.content;
    }

    console.log('AI Help response generated successfully');
    console.log('Successfully generated AI response');

    return new Response(JSON.stringify({
      response: aiResponse,
      context: context,
      specialty: specialty,
      brandName: brandName,
      timestamp: new Date().toISOString(),
      actions_performed: actionsPerformed
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in AI Help Assistant:', error);
    return new Response(JSON.stringify({
      error: 'Failed to process request',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});