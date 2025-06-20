
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Brain, Send, User, Bot, Calendar, Clock, Users, Loader2, Zap, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  contextUsed?: {
    todaysAppointments: number;
    availableSlots: number;
    providersActive: number;
  };
}

export const AIScheduleChat = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm Schedule iQ, your AI scheduling assistant. I have access to your real scheduling data and can help you with:\n\n• Booking and managing appointments\n• Optimizing your calendar for better efficiency\n• Resolving scheduling conflicts\n• Analyzing scheduling patterns\n• Setting up automated reminders\n• Finding available time slots\n\nI can see your current schedule and provide specific, data-driven recommendations. What would you like to work on today?",
      timestamp: new Date(),
      suggestions: [
        "Show me today's schedule overview",
        "Find the next available appointment slot",
        "Optimize my calendar for better flow",
        "Check for any scheduling conflicts"
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [scheduleContext, setScheduleContext] = useState<any>(null);
  const [needsApiKey, setNeedsApiKey] = useState(false);

  // Load scheduling context with more detailed information
  useEffect(() => {
    loadScheduleContext();
    
    // Refresh context every 30 seconds for real-time updates
    const interval = setInterval(loadScheduleContext, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadScheduleContext = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      // Load current appointments with more details
      const { data: appointments } = await supabase
        .from('appointments')
        .select('*')
        .gte('date', today)
        .order('date')
        .order('time')
        .limit(50);

      // Load active providers with specialty information
      const { data: providers } = await supabase
        .from('providers')
        .select('first_name, last_name, specialty')
        .eq('is_active', true);

      // Load available slots for today and tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const { data: availableSlots } = await supabase
        .from('availability_slots')
        .select('*')
        .gte('date', today)
        .lte('date', tomorrow.toISOString().split('T')[0])
        .eq('is_available', true);

      // Calculate today's appointments
      const todaysAppointments = appointments?.filter(apt => apt.date === today).length || 0;
      
      // Calculate this week's appointments
      const thisWeekAppointments = appointments?.filter(apt => {
        const aptDate = new Date(apt.date);
        return aptDate >= weekStart && aptDate <= weekEnd;
      }).length || 0;

      const contextData = {
        appointments: thisWeekAppointments,
        providers: providers?.map(p => `${p.first_name} ${p.last_name} (${p.specialty})`).join(', ') || 'None configured',
        availableSlots: availableSlots?.length || 0,
        todaysAppointments: todaysAppointments,
        totalProviders: providers?.length || 0,
        upcomingAppointments: appointments?.slice(0, 5) || []
      };

      setScheduleContext(contextData);

    } catch (error) {
      console.error('Error loading schedule context:', error);
      toast({
        title: "Context Loading Error",
        description: "Some scheduling data may not be current",
        variant: "destructive"
      });
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const { data, error } = await supabase.functions.invoke('schedule-ai-chat', {
        body: {
          message: inputValue,
          context: scheduleContext
        }
      });

      if (error) {
        if (error.message?.includes('OpenAI API key')) {
          setNeedsApiKey(true);
          throw new Error('OpenAI API key not configured. Please add your API key to continue.');
        }
        throw error;
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.response,
        timestamp: new Date(),
        suggestions: data.suggestions || [],
        contextUsed: data.contextUsed
      };
      
      setMessages(prev => [...prev, aiResponse]);

      // Refresh context after AI interaction to get latest data
      await loadScheduleContext();

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

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const handleQuickAction = async (action: string) => {
    const quickActions = {
      "Show today's schedule overview": "Give me a detailed overview of today's appointments and schedule",
      "Find next available slot": "What's the next available appointment slot across all providers?",
      "Optimize calendar": "Analyze my current schedule and suggest optimizations for better efficiency",
      "Check conflicts": "Check for any scheduling conflicts or issues I should address",
      "Send reminders": "Help me manage appointment reminders for upcoming appointments",
      "Provider availability": "Show me current provider availability and utilization"
    };

    const message = quickActions[action as keyof typeof quickActions] || action;
    setInputValue(message);
    await handleSendMessage();
  };

  if (needsApiKey) {
    return (
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Schedule iQ AI Assistant
            <Badge className="bg-red-100 text-red-700">Setup Required</Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col justify-center items-center gap-4">
          <Alert>
            <Brain className="h-4 w-4" />
            <AlertDescription>
              To enable AI scheduling assistance, please configure your OpenAI API key in the Supabase Edge Function secrets.
            </AlertDescription>
          </Alert>
          <Button 
            onClick={() => window.open('https://docs.lovable.dev/', '_blank')}
            variant="outline"
          >
            View Setup Instructions
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          Schedule iQ AI Assistant
          <div className="flex gap-2">
            <Badge className="bg-green-100 text-green-700">
              {scheduleContext ? `${scheduleContext.todaysAppointments} today` : 'Loading...'}
            </Badge>
            <Badge className="bg-blue-100 text-blue-700">
              <Zap className="h-3 w-3 mr-1" />
              AI Enhanced
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-4">
        {/* Enhanced Quick Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          {[
            "Show today's schedule overview", 
            "Find next available slot", 
            "Optimize calendar", 
            "Check conflicts"
          ].map((action) => (
            <Button
              key={action}
              variant="outline"
              size="sm"
              className="text-xs h-8"
              onClick={() => handleQuickAction(action)}
            >
              {action}
            </Button>
          ))}
        </div>

        {/* Context Status */}
        {scheduleContext && (
          <div className="flex items-center gap-4 text-xs text-gray-600 bg-gray-50 p-2 rounded">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {scheduleContext.appointments} this week
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {scheduleContext.totalProviders} providers
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {scheduleContext.availableSlots} slots available
            </span>
          </div>
        )}

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-2 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-purple-100 text-purple-600'
                  }`}>
                    {message.type === 'user' ? <User className="w-4 h-4" /> : <Brain className="w-4 h-4" />}
                  </div>
                  
                  <div className={`p-3 rounded-lg ${
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    
                    {/* Context indicators for AI messages */}
                    {message.type === 'ai' && message.contextUsed && (
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200">
                        <TrendingUp className="h-3 w-3 text-gray-500" />
                        <span className="text-xs text-gray-500">
                          Used live data: {message.contextUsed.todaysAppointments} appointments, {message.contextUsed.availableSlots} slots
                        </span>
                      </div>
                    )}
                    
                    <p className={`text-xs mt-1 ${
                      message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                    <Brain className="w-4 h-4" />
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm text-gray-600">Analyzing your schedule...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Enhanced AI Suggestions */}
        {messages.length > 0 && messages[messages.length - 1].type === 'ai' && messages[messages.length - 1].suggestions && !isTyping && (
          <div className="space-y-2">
            <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Smart suggestions:
            </p>
            <div className="flex flex-wrap gap-2">
              {messages[messages.length - 1].suggestions!.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 hover:bg-purple-50 hover:border-purple-200"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Input Area */}
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me about scheduling, optimization, conflicts, or any calendar management task..."
            onKeyPress={(e) => e.key === 'Enter' && !isTyping && handleSendMessage()}
            className="flex-1"
            disabled={isTyping}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!inputValue.trim() || isTyping}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
