
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  contextUsed?: any;
}

interface AIMessageHandlerProps {
  profile: any;
  scheduleContext: any;
  messages: Message[];
  setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void;
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
}: AIMessageHandlerProps) => {
  const { toast } = useToast();
  const [isTyping, setIsTyping] = useState(false);
  const [needsApiKey, setNeedsApiKey] = useState(false);

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim() || !profile) {
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Refresh context before sending to AI for most current data
      await onContextRefresh();

      const { data, error } = await supabase.functions.invoke('schedule-ai-chat', {
        body: {
          message: messageText,
          context: scheduleContext,
          userProfile: profile,
          enableAutomation: true
        }
      });

      if (error) {
        if (error.message?.includes('OpenAI API key')) {
          setNeedsApiKey(true);
          throw new Error('OpenAI API key not configured. Please add your API key to continue.');
        }
        throw error;
      }

      // Check if AI wants to create an appointment automatically
      if (data.createAppointment) {
        try {
          const appointment = await onAppointmentCreated(data.appointmentData);
          
          // Update the AI response to include confirmation
          data.response += `\n\n✅ **Appointment Created Successfully!**\n\nAppointment Details:\n• Date: ${format(new Date(data.appointmentData.date), 'MMMM d, yyyy')}\n• Time: ${data.appointmentData.time}\n• Provider: ${data.appointmentData.providerName}\n• Type: ${data.appointmentData.appointmentType}\n• Confirmation sent to: ${data.appointmentData.email}\n• Reminders scheduled automatically\n\nYour appointment is now confirmed and you'll receive reminder notifications.`;
          
          toast({
            title: "Appointment Created!",
            description: `Appointment scheduled for ${format(new Date(data.appointmentData.date), 'MMM d')} at ${data.appointmentData.time}`,
          });
        } catch (appointmentError) {
          console.error('Failed to create appointment:', appointmentError);
          data.response += `\n\n❌ I found an available slot but encountered an error creating the appointment. Please try again or contact support.`;
        }
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.response,
        timestamp: new Date(),
        suggestions: data.suggestions || [],
        contextUsed: {
          ...data.contextUsed,
          nextAvailableSlots: scheduleContext?.nextAvailableSlots || []
        }
      };
      
      setMessages(prev => [...prev, aiResponse]);

    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `I apologize, but I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
        timestamp: new Date(),
        suggestions: ["Try again", "Refresh the page", "Check system status"]
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  };

  return {
    handleSendMessage,
    isTyping,
    needsApiKey
  };
};
