// OpenAI Service for AI Assistant
import { AI_CONFIG, SYSTEM_PROMPT } from './config.ts';
import { AVAILABLE_FUNCTIONS } from './function-definitions.ts';

export async function callOpenAI(message: string, context: string, conversationHistory: any[]) {
  const historyContext = conversationHistory
    ?.map((msg: any) => `${msg.type}: ${msg.content}`)
    .join('\n') || '';

  const fullSystemPrompt = `${SYSTEM_PROMPT}

CURRENT USER CONTEXT: ${context}

CONVERSATION HISTORY:
${historyContext}`;

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
    throw new Error(`OpenAI API error: ${errorText}`);
  }

  return await response.json();
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