import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useLocation } from 'react-router-dom';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  RefreshCw,
  HelpCircle,
  Mic,
  Volume2
} from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  context?: string;
}

export const AIHelpAssistant: React.FC = () => {
  // Load messages from localStorage on component mount
  const loadPersistedMessages = (): ChatMessage[] => {
    try {
      const stored = localStorage.getItem('flowiQ-ai-help-messages');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        return parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      }
    } catch (error) {
      console.error('Failed to load persisted messages:', error);
    }
    
    // Return default initial message
    return [
      {
        id: '1',
        type: 'assistant',
        content: "Hi! I'm your FlowiQ AI assistant. I can help you navigate the app, explain features, and guide you through workflows. What would you like to know?",
        timestamp: new Date()
      }
    ];
  };

  const [messages, setMessages] = useState<ChatMessage[]>(loadPersistedMessages);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showVoiceMode, setShowVoiceMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    localStorage.setItem('flowiQ-ai-help-messages', JSON.stringify(messages));
  }, [messages]);

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

  const generateSystemPrompt = () => {
    return `You are FlowiQ AI Assistant, a helpful support agent for the FlowiQ healthcare practice management platform. Your role is to help healthcare staff navigate and use the application effectively.

CONTEXT: ${getContextualInfo()}

KEY CAPABILITIES TO HELP WITH:
- Patient Management: Adding patients, viewing records, updating information
- Appointment Scheduling: Booking, rescheduling, managing calendars
- AI Agents: Intake iQ, Schedule iQ, Scribe iQ, Claims iQ functionality
- EHR Integration: Electronic health records, SOAP notes, medical coding
- Voice-Enabled Forms: How to use voice input for patient intake
- Claims Processing: Insurance claims, denials, revenue cycle
- Settings & Configuration: Practice setup, integrations, user management

RESPONSE GUIDELINES:
- Be conversational and helpful
- Provide step-by-step instructions when appropriate
- Mention specific UI elements (buttons, tabs, menus) when relevant
- If the user asks about a feature not yet implemented, politely explain and suggest alternatives
- Keep responses concise but thorough
- Use healthcare terminology appropriately
- Always prioritize patient privacy and HIPAA compliance in your guidance

Answer the user's question about using FlowiQ:`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      context: location.pathname
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-help-assistant', {
        body: {
          message: inputMessage,
          context: getContextualInfo(),
          conversationHistory: messages.slice(-5) // Last 5 messages for context
        }
      });

      if (error) {
        throw new Error(error.message);
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

    } catch (error) {
      console.error('AI Help error:', error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
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

  const quickQuestions = [
    "How do I add a new patient?",
    "How does voice intake work?",
    "How do I schedule an appointment?",
    "What are the AI agents?",
    "How do I process insurance claims?",
    "How do I use the EHR system?"
  ];

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">FlowiQ AI Assistant</h2>
              <p className="text-sm text-gray-600 font-normal">Get instant help with any FlowiQ feature</p>
            </div>
            <Badge variant="outline" className="ml-auto">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Powered
            </Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Quick Questions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            Quick Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {quickQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickQuestion(question)}
                className="justify-start text-left h-auto py-2 px-3"
              >
                {question}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className="h-[500px] flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Chat with AI Assistant</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clearConversation}
                className="flex items-center gap-1"
              >
                <RefreshCw className="w-4 h-4" />
                Clear
              </Button>
            </div>
          </div>
          <Alert className="bg-blue-50 border-blue-200">
            <MessageCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Currently on: <strong>{location.pathname}</strong> - I can provide context-specific help for this page.
            </AlertDescription>
          </Alert>
        </CardHeader>

        {/* Messages */}
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.type !== 'user' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : message.type === 'assistant'
                    ? 'bg-gray-100 text-gray-900 rounded-bl-sm'
                    : 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>

              {message.type === 'user' && (
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-100 p-3 rounded-lg rounded-bl-sm animate-pulse">
                <p className="text-sm text-gray-600">AI is thinking...</p>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </CardContent>

        {/* Input */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about FlowiQ..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            💡 I can help with features, navigation, workflows, and troubleshooting
          </p>
        </div>
      </Card>
    </div>
  );
};