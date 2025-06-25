
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
      // Call the AI scheduling service
      const { data, error } = await supabase.functions.invoke('schedule-ai-chat', {
        body: {
          message: inputValue,
          context: {
            userRole: profile?.role || 'patient',
            userEmail: profile?.email,
            userName: `${profile?.first_name} ${profile?.last_name}`.trim(),
            scheduleData: scheduleContext,
            conversationHistory: messages.slice(-5) // Last 5 messages for context
          }
        }
      });

      if (error) {
        if (error.message?.includes('OpenAI API key')) {
          setNeedsApiKey(true);
          throw new Error('AI service requires OpenAI API key configuration');
        }
        throw error;
      }

      const aiResponse = data?.response || 'I apologize, but I encountered an issue processing your request.';
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
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `I apologize, but I encountered an error: ${error.message}. Please try again or contact support if the issue persists.`,
        timestamp: new Date(),
        suggestions: [
          "Try rephrasing your request",
          "Check my current appointments",
          "Show available time slots"
        ]
      };

      setMessages([...messages, userMessage, errorMessage]);

      toast({
        title: "AI Assistant Error",
        description: "There was an issue processing your request. Please try again.",
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
