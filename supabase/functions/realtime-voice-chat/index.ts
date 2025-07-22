import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RealtimeMessage {
  type: string;
  [key: string]: any;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  
  // Check if this is a WebSocket upgrade request
  if (req.headers.get("upgrade") !== "websocket") {
    return new Response("Expected websocket connection", { status: 400 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  
  let openaiWs: WebSocket | null = null;
  let sessionInitialized = false;

  console.log("WebSocket connection established with client");

  socket.onopen = () => {
    console.log("Client WebSocket opened, connecting to OpenAI...");
    
    // Connect to OpenAI Realtime API
    const openaiUrl = "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01";
    openaiWs = new WebSocket(openaiUrl, [
      "realtime",
      `openai-beta`,
      `openai-insecure-api-key.${Deno.env.get('OPENAI_API_KEY')}`
    ]);

    openaiWs.onopen = () => {
      console.log("Connected to OpenAI Realtime API");
    };

    openaiWs.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received from OpenAI:", data.type);

        // Initialize session after connection
        if (data.type === 'session.created' && !sessionInitialized) {
          console.log("Session created, sending session update...");
          
          const sessionUpdate = {
            type: "session.update",
            session: {
              modalities: ["text", "audio"],
              instructions: `You are a helpful medical assistant AI. You can help patients with:
- General health questions and concerns
- Appointment scheduling assistance  
- Basic symptom assessment (not diagnosis)
- Medication reminders and information
- Post-visit follow-up questions

Important guidelines:
- Always be empathetic and professional
- Never provide medical diagnoses - recommend consulting healthcare providers
- Keep responses concise and clear
- Ask clarifying questions when needed
- Maintain patient confidentiality`,
              voice: "alloy",
              input_audio_format: "pcm16", 
              output_audio_format: "pcm16",
              input_audio_transcription: {
                model: "whisper-1"
              },
              turn_detection: {
                type: "server_vad",
                threshold: 0.5,
                prefix_padding_ms: 300,
                silence_duration_ms: 1000
              },
              tools: [
                {
                  type: "function",
                  name: "schedule_appointment",
                  description: "Help schedule an appointment for the patient",
                  parameters: {
                    type: "object",
                    properties: {
                      preferred_date: { type: "string" },
                      preferred_time: { type: "string" },
                      appointment_type: { type: "string" },
                      urgency: { type: "string" }
                    },
                    required: ["appointment_type"]
                  }
                },
                {
                  type: "function", 
                  name: "get_patient_info",
                  description: "Retrieve basic patient information when needed",
                  parameters: {
                    type: "object",
                    properties: {
                      patient_id: { type: "string" }
                    },
                    required: ["patient_id"]
                  }
                },
                {
                  type: "function",
                  name: "log_call_outcome",
                  description: "Log the outcome and summary of the patient call",
                  parameters: {
                    type: "object", 
                    properties: {
                      summary: { type: "string" },
                      outcome_type: { type: "string" },
                      follow_up_required: { type: "boolean" },
                      urgency_level: { type: "string" }
                    },
                    required: ["summary", "outcome_type"]
                  }
                }
              ],
              tool_choice: "auto",
              temperature: 0.7,
              max_response_output_tokens: "inf"
            }
          };

          openaiWs?.send(JSON.stringify(sessionUpdate));
          sessionInitialized = true;
        }

        // Handle function calls
        if (data.type === 'response.function_call_arguments.done') {
          console.log("Function call received:", data.name, data.arguments);
          
          const args = JSON.parse(data.arguments);
          let functionResult = {};

          switch (data.name) {
            case 'schedule_appointment':
              functionResult = {
                status: "appointment_request_received",
                message: "I've noted your appointment request. A staff member will contact you shortly to confirm the details.",
                next_steps: "Please ensure your contact information is up to date"
              };
              break;
              
            case 'get_patient_info':
              functionResult = {
                status: "info_retrieved",
                message: "I have access to your basic information to assist you better."
              };
              break;
              
            case 'log_call_outcome':
              functionResult = {
                status: "logged",
                message: "Call summary has been recorded for your healthcare team.",
                reference_id: `call_${Date.now()}`
              };
              break;
              
            default:
              functionResult = {
                status: "unknown_function",
                message: "I'm not sure how to handle that request."
              };
          }

          // Send function result back to OpenAI
          const functionResponse = {
            type: "conversation.item.create",
            item: {
              type: "function_call_output",
              call_id: data.call_id,
              output: JSON.stringify(functionResult)
            }
          };
          
          openaiWs?.send(JSON.stringify(functionResponse));
          openaiWs?.send(JSON.stringify({ type: "response.create" }));
        }

        // Forward all messages to client
        socket.send(event.data);
        
      } catch (error) {
        console.error("Error processing OpenAI message:", error);
      }
    };

    openaiWs.onerror = (error) => {
      console.error("OpenAI WebSocket error:", error);
      socket.send(JSON.stringify({
        type: "error",
        message: "Connection to AI service failed"
      }));
    };

    openaiWs.onclose = () => {
      console.log("OpenAI WebSocket closed");
      socket.close();
    };
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log("Received from client:", data.type);
      
      // Forward client messages to OpenAI
      if (openaiWs && openaiWs.readyState === WebSocket.OPEN) {
        openaiWs.send(event.data);
      }
    } catch (error) {
      console.error("Error processing client message:", error);
    }
  };

  socket.onerror = (error) => {
    console.error("Client WebSocket error:", error);
  };

  socket.onclose = () => {
    console.log("Client WebSocket closed");
    if (openaiWs) {
      openaiWs.close();
    }
  };

  return response;
});