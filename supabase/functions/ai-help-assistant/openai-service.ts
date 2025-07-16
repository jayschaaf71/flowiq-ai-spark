// OpenAI Service for AI Assistant
import { AI_CONFIG, SYSTEM_PROMPT } from './config.ts';
import { AVAILABLE_FUNCTIONS } from './function-definitions.ts';

export async function callOpenAI(message: string, context: string, conversationHistory: any[]) {
  console.log('=== Calling OpenAI ===');
  console.log('Message:', message);
  console.log('Context:', context);
  console.log('History length:', conversationHistory?.length || 0);
  
  const historyContext = conversationHistory
    ?.map((msg: any) => `${msg.type}: ${msg.content}`)
    .join('\n') || '';

  const fullSystemPrompt = `${SYSTEM_PROMPT}

CURRENT USER CONTEXT: ${context}

CONVERSATION HISTORY:
${historyContext}`;

  console.log('Making OpenAI API call...');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: AI_CONFIG.model,
      messages: [
        { role: 'system', content: fullSystemPrompt },
        { role: 'user', content: message }
      ],
      tools: AVAILABLE_FUNCTIONS.map(func => ({ type: "function", function: func })),
      tool_choice: "auto",
      temperature: AI_CONFIG.temperature,
      max_tokens: AI_CONFIG.maxTokens,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('OpenAI API error response:', {
      status: response.status,
      statusText: response.statusText,
      errorText
    });
    throw new Error(`OpenAI API error (${response.status}): ${errorText}`);
  }

  const result = await response.json();
  console.log('OpenAI API call successful');
  return result;
}

export async function callOpenAISimple(message: string, context: string, conversationHistory: any[]) {
  console.log('=== Calling OpenAI Simple (no functions) ===');
  console.log('Message:', message);
  console.log('Context:', context);
  
  const historyContext = conversationHistory
    ?.map((msg: any) => `${msg.type}: ${msg.content}`)
    .join('\n') || '';

  const fullSystemPrompt = `${SYSTEM_PROMPT}

CURRENT USER CONTEXT: ${context}

CONVERSATION HISTORY:
${historyContext}

NOTE: Function calling is currently disabled. Please provide helpful guidance and information instead of trying to perform actions.`;

  console.log('Making OpenAI API call without functions...');

  // Add timeout to OpenAI request to prevent hanging
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 second timeout

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        messages: [
          { role: 'system', content: fullSystemPrompt },
          { role: 'user', content: message }
        ],
        temperature: AI_CONFIG.temperature,
        max_tokens: AI_CONFIG.maxTokens,
      }),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error response:', {
        status: response.status,
        statusText: response.statusText,
        errorText
      });
      throw new Error(`OpenAI API error (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    console.log('OpenAI API call successful');
    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.error('OpenAI API request timed out');
      throw new Error('AI request timed out - please try again');
    }
    throw error;
  }
}

export async function getFollowUpResponse(
  message: string, 
  context: string, 
  conversationHistory: any[], 
  assistantMessage: any, 
  functionResults: any[]
) {
  const historyContext = conversationHistory
    ?.map((msg: any) => `${msg.type}: ${msg.content}`)
    .join('\n') || '';

  const fullSystemPrompt = `${SYSTEM_PROMPT}

CURRENT USER CONTEXT: ${context}

CONVERSATION HISTORY:
${historyContext}`;

  const followUpMessages = [
    { role: 'system', content: fullSystemPrompt },
    { role: 'user', content: message },
    assistantMessage,
    ...functionResults.map(result => ({
      role: 'tool',
      tool_call_id: assistantMessage.tool_calls.find((tc: any) => tc.function.name === result.function)?.id,
      content: JSON.stringify(result.result)
    }))
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: AI_CONFIG.model,
      messages: followUpMessages,
      temperature: AI_CONFIG.temperature,
      max_tokens: AI_CONFIG.maxTokens,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI follow-up API error: ${errorText}`);
  }

  return await response.json();
}