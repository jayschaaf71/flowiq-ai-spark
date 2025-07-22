import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Bot, 
  Calendar, 
  Clock, 
  Send, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  User,
  Phone,
  Mail
} from 'lucide-react';

interface AISchedulingMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  actions?: {
    type: 'book_appointment' | 'suggest_times' | 'resolve_conflict';
    data?: Record<string, unknown>;
  }[];
}

interface AppointmentSuggestion {
  date: string;
  time: string;
  provider: string;
  duration: number;
  confidence: number;
}

export const AISchedulingAssistant = () => {
  const [messages, setMessages] = useState<AISchedulingMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm your AI scheduling assistant. I can help you book appointments, resolve conflicts, and find optimal time slots. What would you like to do today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<AppointmentSuggestion[]>([]);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: AISchedulingMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('schedule-ai-chat', {
        body: {
          message: input,
          context: {
            conversationHistory: messages.slice(-5), // Last 5 messages for context
            currentDate: new Date().toISOString(),
            userRole: 'staff'
          }
        }
      });

      if (error) throw error;

      const assistantMessage: AISchedulingMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.message,
        timestamp: new Date(),
        actions: data.actions
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Handle any suggestions or actions
      if (data.suggestions) {
        setSuggestions(data.suggestions);
      }

      if (data.actions) {
        handleAIActions(data.actions);
      }

    } catch (error: unknown) {
      console.error('AI scheduling error:', error);
      
      const errorMessage: AISchedulingMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I apologize, but I'm having trouble processing your request right now. Please try again or contact support if the issue persists.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "AI Assistant Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAIActions = (actions: Array<{ type: string; data?: Record<string, unknown> }>) => {
    actions.forEach(action => {
      switch (action.type) {
        case 'book_appointment':
          toast({
            title: "Appointment Suggestion",
            description: "I found some available time slots. Would you like me to book one?",
          });
          break;
        case 'suggest_times':
          toast({
            title: "Time Suggestions Ready",
            description: "I've analyzed your schedule and found optimal time slots.",
          });
          break;
        case 'resolve_conflict':
          toast({
            title: "Conflict Detected",
            description: "I've identified a scheduling conflict and prepared solutions.",
            variant: "destructive",
          });
          break;
      }
    });
  };

  const handleQuickAction = (action: string) => {
    setInput(action);
    handleSendMessage();
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const quickActions = [
    "Book an appointment for tomorrow morning",
    "Find available slots for Dr. Smith this week", 
    "Check for scheduling conflicts today",
    "Show me the busiest times this month"
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-blue-600" />
            AI Scheduling Assistant
          </CardTitle>
          <CardDescription>
            Intelligent appointment booking, conflict resolution, and schedule optimization
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="justify-start text-left h-auto p-3"
                onClick={() => handleQuickAction(action)}
              >
                {action}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Appointment Suggestions */}
      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-600" />
              AI Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-sm">
                      <p className="font-medium">{suggestion.date} at {suggestion.time}</p>
                      <p className="text-gray-600">{suggestion.provider} • {suggestion.duration} min</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={suggestion.confidence > 0.8 ? "default" : "secondary"}
                      className={suggestion.confidence > 0.8 ? "bg-green-100 text-green-800" : ""}
                    >
                      {Math.round(suggestion.confidence * 100)}% match
                    </Badge>
                    <Button size="sm">Book</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat Interface */}
      <Card className="h-96 flex flex-col">
        <CardHeader>
          <CardTitle className="text-lg">AI Chat</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">AI is thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me about scheduling, conflicts, or availability..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!input.trim() || isLoading}
              size="icon"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};