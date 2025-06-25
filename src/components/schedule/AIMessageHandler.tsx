
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  contextUsed?: any;
}

interface UseAIMessageHandlerProps {
  profile: any;
  scheduleContext: any;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  onAppointmentCreated: (appointmentData: any) => Promise<any>;
  onContextRefresh: () => Promise<void>;
}

export const useAIMessageHandler = ({
  profile,
  scheduleContext,
  messages,
  setMessages,
  onAppointmentCreated,
  onContextRefresh
}: UseAIMessageHandlerProps) => {
  const [isTyping, setIsTyping] = useState(false);
  const [needsApiKey, setNeedsApiKey] = useState(false);
  const { toast } = useToast();

  const callEdgeFunction = async (payload: any, retries = 3): Promise<any> => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`Attempting Edge Function call (attempt ${attempt}/${retries})`);
        
        const { data, error } = await supabase.functions.invoke('schedule-ai-chat', {
          body: payload
        });

        if (error) {
          console.error(`Edge Function error (attempt ${attempt}):`, error);
          if (attempt === retries) {
            throw error;
          }
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          continue;
        }

        console.log('Edge Function call successful:', data);
        return data;
      } catch (err) {
        console.error(`Network error (attempt ${attempt}):`, err);
        if (attempt === retries) {
          throw err;
        }
        // Wait before retry with exponential backoff
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
      }
    }
  };

  const handleSendMessage = useCallback(async (inputValue: string) => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setIsTyping(true);

    try {
      console.log('Sending message to AI:', inputValue);
      
      const payload = {
        message: inputValue,
        context: {
          userRole: profile?.role || 'patient',
          userEmail: profile?.email,
          userName: `${profile?.first_name} ${profile?.last_name}`.trim(),
          scheduleData: scheduleContext,
          conversationHistory: messages.slice(-5) // Last 5 messages for context
        }
      };

      const data = await callEdgeFunction(payload);

      // Handle API key configuration error
      if (data?.error && data.error.includes('OpenAI API key')) {
        setNeedsApiKey(true);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: 'I need an OpenAI API key to function properly. Please configure your OpenAI API key in the Supabase Edge Function secrets.',
          timestamp: new Date(),
          suggestions: ['Contact your administrator', 'Check setup instructions']
        };
        setMessages([...messages, userMessage, errorMessage]);
        return;
      }

      const aiResponse = data?.response || 'I apologize, but I encountered an issue processing your request. Please try again.';
      const suggestions = data?.suggestions || [];
      const appointmentData = data?.appointmentData;

      // If AI suggests creating an appointment, try to create it
      if (appointmentData && appointmentData.shouldCreate) {
        try {
          const appointment = await onAppointmentCreated(appointmentData);
          
          toast({
            title: "Appointment Created Successfully!",
            description: `Appointment scheduled for ${appointmentData.date} at ${appointmentData.time}`,
          });

          // Refresh context after successful booking
          await onContextRefresh();
        } catch (appointmentError) {
          console.error('Error creating appointment:', appointmentError);
          toast({
            title: "Booking Failed",
            description: appointmentError.message || "Could not create appointment",
            variant: "destructive"
          });
        }
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
        suggestions: suggestions.length > 0 ? suggestions : undefined,
        contextUsed: scheduleContext
      };

      setMessages([...messages, userMessage, aiMessage]);

    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      
      // Provide user-friendly error message
      let errorContent = 'I apologize, but I encountered a technical issue. ';
      
      if (error.message?.includes('Failed to fetch') || error.message?.includes('Network')) {
        errorContent += 'There seems to be a connection problem. Please check your internet connection and try again.';
      } else if (error.message?.includes('timeout')) {
        errorContent += 'The request took too long to process. Please try with a shorter message.';
      } else {
        errorContent += 'Please try again in a moment. If the problem persists, contact support.';
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: errorContent,
        timestamp: new Date(),
        suggestions: [
          "Try a simpler request",
          "Check your internet connection",
          "Refresh the page",
          "Contact support if issue persists"
        ]
      };

      setMessages([...messages, userMessage, errorMessage]);

      toast({
        title: "Connection Error",
        description: "Unable to connect to AI assistant. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsTyping(false);
    }
  }, [messages, isTyping, profile, scheduleContext, setMessages, onAppointmentCreated, onContextRefresh, toast]);

  return {
    handleSendMessage,
    isTyping,
    needsApiKey
  };
};
