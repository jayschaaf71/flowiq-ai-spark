import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  context?: string;
}

export const useAIHelpAssistant = () => {
  const location = useLocation();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages from localStorage on component mount
  const loadPersistedMessages = (): ChatMessage[] => {
    // Always start with a fresh conversation to avoid showing old messages
    const defaultMessages = [
      {
        id: '1',
        type: 'assistant' as const,
        content: "Hi! I'm your FlowiQ AI assistant. I can help you navigate the app, explain features, and guide you through workflows. What would you like to know?",
        timestamp: new Date()
      }
    ];
    
    // Clear any old localStorage data
    localStorage.removeItem('flowiQ-ai-help-messages');
    
    return defaultMessages;
  };

  const [messages, setMessages] = useState<ChatMessage[]>(loadPersistedMessages);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Don't persist messages to localStorage to ensure fresh conversations
  // useEffect(() => {
  //   localStorage.setItem('flowiQ-ai-help-messages', JSON.stringify(messages));
  // }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getContextualInfo = () => {
    const currentPath = location.pathname;
    const contextMap: Record<string, string> = {
      '/dashboard': 'User is on the main dashboard page with overview widgets and metrics.',
      '/patient-management': 'User is viewing patient management and patient records.',
      '/ehr': 'User is in the Electronic Health Records (EHR) system.',
      '/agents/intake': 'User is in the Intake iQ section for patient intake forms.',
      '/agents/schedule': 'User is in the Schedule iQ section for appointment scheduling.',
      '/agents/scribe': 'User is in the Scribe iQ section for AI medical scribing.',
      '/agents/claims': 'User is in the Claims iQ section for insurance claims processing.',
      '/settings': 'User is in the settings/configuration area.',
      '/help': 'User is on the help page looking for assistance.'
    };

    return contextMap[currentPath] || `User is on page: ${currentPath}`;
  };

  const handleSendMessage = async (messageToSend?: string) => {
    const messageContent = messageToSend || inputMessage;
    if (!messageContent.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: messageContent,
      timestamp: new Date(),
      context: location.pathname
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Add retry logic with timeout for better reliability
      let retryCount = 0;
      const maxRetries = 2;
      let lastError;

      while (retryCount <= maxRetries) {
        try {
          // Add a timeout wrapper for the request
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Request timeout after 30 seconds')), 30000);
          });

          const requestPromise = supabase.functions.invoke('ai-help-assistant', {
            body: {
              message: messageContent,
              context: getContextualInfo(),
              conversationHistory: messages.slice(-5) // Last 5 messages for context
            }
          });

          const { data, error } = await Promise.race([requestPromise, timeoutPromise]) as any;

          if (error) {
            throw new Error(error.message || 'Edge Function error');
          }

          const assistantMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            type: 'assistant',
            content: data.response || "I'm sorry, I couldn't process that request. Please try again.",
            timestamp: new Date()
          };

          setMessages(prev => [...prev, assistantMessage]);

          // If actions were performed, show them
          if (data.actions_performed && data.actions_performed.length > 0) {
            const actionsMessage: ChatMessage = {
              id: (Date.now() + 2).toString(),
              type: 'system',
              content: `🔧 Actions performed:\n${data.actions_performed.map((action: any) => 
                `• ${action.function}: ${action.result.success ? '✅ ' + action.result.message : '❌ ' + action.result.error}`
              ).join('\n')}`,
              timestamp: new Date()
            };
            
            setMessages(prev => [...prev, actionsMessage]);
          }

          // Success - break out of retry loop
          break;

        } catch (retryError) {
          lastError = retryError;
          retryCount++;
          
          if (retryCount <= maxRetries) {
            console.log(`AI Help request failed, retrying (${retryCount}/${maxRetries})...`);
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount)); // Progressive delay
          }
        }
      }

      // If all retries failed, throw the last error
      if (retryCount > maxRetries && lastError) {
        throw lastError;
      }

    } catch (error) {
      console.error('AI Help error:', error);
      
      // More specific error messages
      let errorDescription = "Failed to get AI response. Please try again.";
      if (error instanceof Error) {
        if (error.message.includes('Edge Function')) {
          errorDescription = "AI service is temporarily unavailable. Please try again in a moment.";
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorDescription = "Network connection issue. Please check your connection and try again.";
        }
      }

      toast({
        title: "Error",
        description: errorDescription,
        variant: "destructive"
      });

      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'system',
        content: "Sorry, I'm having trouble responding right now. Please try again or check the help documentation.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearConversation = () => {
    const defaultMessages = [
      {
        id: '1',
        type: 'assistant' as const,
        content: "Hi! I'm your FlowiQ AI assistant. I can help you navigate the app, explain features, and guide you through workflows. What would you like to know?",
        timestamp: new Date()
      }
    ];
    
    setMessages(defaultMessages);
    localStorage.setItem('flowiQ-ai-help-messages', JSON.stringify(defaultMessages));
  };

  const handleQuickQuestion = (question: string) => {
    // Auto-send the question immediately instead of just populating the input
    setInputMessage(question);
    
    // Use setTimeout to ensure state update happens first
    setTimeout(() => {
      handleSendMessage(question);
    }, 50);
  };

  return {
    messages,
    inputMessage,
    isLoading,
    messagesEndRef,
    currentPath: location.pathname,
    setInputMessage,
    handleSendMessage,
    handleKeyPress,
    clearConversation,
    handleQuickQuestion
  };
};