

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Brain, Send, User, Bot, Calendar, Clock, Users, Loader2, Zap, TrendingUp, Shield, BarChart3, Mail, Target } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

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
    userRole: string;
  };
}

export const AIScheduleChat = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [scheduleContext, setScheduleContext] = useState<any>(null);
  const [needsApiKey, setNeedsApiKey] = useState(false);

  // Initialize with role-specific welcome message
  useEffect(() => {
    if (profile) {
      const welcomeMessage = getWelcomeMessage(profile.role);
      setMessages([{
        id: '1',
        type: 'ai',
        content: welcomeMessage,
        timestamp: new Date(),
        suggestions: getRoleSpecificInitialSuggestions(profile.role)
      }]);
    }
  }, [profile]);

  const getWelcomeMessage = (role: string) => {
    const name = profile?.first_name ? ` ${profile.first_name}` : '';
    
    if (role === 'patient') {
      return `Hello${name}! I'm Schedule iQ, your personal appointment assistant. I'm here to help you with:\n\n• Booking your next appointment\n• Rescheduling existing appointments\n• Finding available time slots\n• Setting up appointment reminders\n• Answering questions about your visits\n\nI can see your scheduling information and provide personalized assistance. What would you like help with today?`;
    } else {
      return `Hello${name}! I'm Schedule iQ, your AI scheduling assistant for healthcare practice management. I have access to your real scheduling data and can help you with:\n\n• Managing appointments for all patients\n• Optimizing provider schedules\n• Resolving scheduling conflicts\n• Analyzing scheduling patterns and trends\n• Setting up automated reminders\n• Generating scheduling reports\n• Improving practice efficiency\n\nI can see your current schedule and provide data-driven recommendations. What would you like to work on today?`;
    }
  };

  const getRoleSpecificInitialSuggestions = (role: string) => {
    if (role === 'patient') {
      return [
        "Book my next appointment",
        "Check my upcoming appointments", 
        "Find available appointment times",
        "Set up appointment reminders"
      ];
    } else {
      return [
        "Show me today's schedule overview",
        "Find the next available appointment slot",
        "Optimize my calendar for better flow",
        "Check for any scheduling conflicts"
      ];
    }
  };

  // Load scheduling context with role-based filtering
  useEffect(() => {
    if (profile) {
      loadScheduleContext();
      
      // Refresh context every 30 seconds for real-time updates
      const interval = setInterval(loadScheduleContext, 30000);
      return () => clearInterval(interval);
    }
  }, [profile]);

  const loadScheduleContext = async () => {
    if (!profile) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      // Load appointments based on user role
      let appointmentsQuery = supabase
        .from('appointments')
        .select('*')
        .gte('date', today)
        .order('date')
        .order('time');

      // If patient, only show their appointments
      if (profile.role === 'patient') {
        // Note: In a real implementation, you'd link user to patient record
        appointmentsQuery = appointmentsQuery.eq('email', profile.email);
      }

      const { data: appointments } = await appointmentsQuery.limit(50);

      // Load provider data (staff can see all, patients see limited info)
      const { data: providers } = await supabase
        .from('providers')
        .select('first_name, last_name, specialty')
        .eq('is_active', true);

      // Load available slots
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const { data: availableSlots } = await supabase
        .from('availability_slots')
        .select('*')
        .gte('date', today)
        .lte('date', tomorrow.toISOString().split('T')[0])
        .eq('is_available', true);

      const todaysAppointments = appointments?.filter(apt => apt.date === today).length || 0;
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
        upcomingAppointments: appointments?.slice(0, 5) || [],
        userRole: profile.role
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

  const handleSendMessage = async (messageText?: string) => {
    const messageToSend = messageText || inputValue;
    if (!messageToSend.trim() || !profile) return;

    console.log('Sending message:', messageToSend);

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const { data, error } = await supabase.functions.invoke('schedule-ai-chat', {
        body: {
          message: messageToSend,
          context: scheduleContext,
          userProfile: profile
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

  const handleSuggestionClick = async (suggestion: string) => {
    console.log('Suggestion clicked:', suggestion);
    await handleSendMessage(suggestion);
  };

  const handleQuickAction = async (action: string) => {
    console.log('Quick action clicked:', action);
    await handleSendMessage(action);
  };

  if (!user || !profile) {
    return (
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Schedule iQ AI Assistant
            <Badge className="bg-yellow-100 text-yellow-700">Authentication Required</Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col justify-center items-center gap-4">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Please log in to access your personalized AI scheduling assistant.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

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

  const roleBasedQuickActions = profile.role === 'patient' 
    ? ["Book my next appointment", "Check my appointments", "Find available times", "Set up reminders"]
    : ["Show today's schedule overview", "Find next available slot", "Optimize calendar", "Check conflicts"];

  // Quick AI Actions for larger buttons
  const quickAIActions = profile.role === 'patient' 
    ? [
        { icon: Calendar, label: "Book Next Appointment", action: "Help me book my next appointment with the best available time slot" },
        { icon: Clock, label: "Check My Schedule", action: "Show me all my upcoming appointments and any important details" },
        { icon: Mail, label: "Setup Reminders", action: "Help me set up appointment reminders via email or SMS" },
        { icon: Target, label: "Find Specialists", action: "Help me find available specialists for my specific needs" }
      ]
    : [
        { icon: Zap, label: "Optimize Today's Schedule", action: "Analyze today's schedule and suggest optimizations to improve efficiency and reduce gaps" },
        { icon: Mail, label: "Send Batch Reminders", action: "Send appointment reminders to all patients with appointments in the next 24-48 hours" },
        { icon: Target, label: "Fill Empty Slots", action: "Identify empty time slots today and tomorrow and suggest how to fill them from the waitlist" },
        { icon: BarChart3, label: "Generate Report", action: "Generate a comprehensive scheduling report with utilization rates, no-show patterns, and recommendations" }
      ];

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          Schedule iQ AI Assistant
          <div className="flex gap-2">
            <Badge className={`${profile.role === 'patient' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
              {profile.role === 'patient' ? 'Patient Mode' : 'Staff Mode'}
            </Badge>
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
        {/* Quick AI Actions - Large Buttons */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700">Quick AI Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickAIActions.map((actionItem, index) => {
              const IconComponent = actionItem.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="h-16 flex flex-col gap-2 text-xs hover:bg-purple-50 hover:border-purple-200"
                  onClick={() => {
                    console.log('Quick AI Action button clicked:', actionItem.label, actionItem.action);
                    handleQuickAction(actionItem.action);
                  }}
                  disabled={isTyping}
                >
                  <IconComponent className="h-5 w-5 text-purple-600" />
                  <span className="text-center leading-tight">{actionItem.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Role-based Quick Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          {roleBasedQuickActions.map((action) => (
            <Button
              key={action}
              variant="outline"
              size="sm"
              className="text-xs h-8"
              onClick={() => {
                console.log('Role-based action clicked:', action);
                handleQuickAction(action);
              }}
              disabled={isTyping}
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
              {profile.role === 'patient' ? 'Your appointments' : `${scheduleContext.appointments} this week`}
            </span>
            {profile.role !== 'patient' && (
              <>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {scheduleContext.totalProviders} providers
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {scheduleContext.availableSlots} slots available
                </span>
              </>
            )}
          </div>
        )}

        {/* Messages Area */}
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
                          {message.contextUsed.userRole === 'patient' ? 'Personalized' : 'Live data'}: {message.contextUsed.todaysAppointments} appointments, {message.contextUsed.availableSlots} slots
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
                      <span className="text-sm text-gray-600">
                        {profile.role === 'patient' ? 'Checking your schedule...' : 'Analyzing your schedule...'}
                      </span>
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
              {profile.role === 'patient' ? 'Suggested actions:' : 'Smart suggestions:'}
            </p>
            <div className="flex flex-wrap gap-2">
              {messages[messages.length - 1].suggestions!.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 hover:bg-purple-50 hover:border-purple-200"
                  onClick={() => {
                    console.log('Suggestion button clicked:', suggestion);
                    handleSuggestionClick(suggestion);
                  }}
                  disabled={isTyping}
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
            placeholder={profile.role === 'patient' 
              ? "Ask me about your appointments, booking, or rescheduling..."
              : "Ask me about scheduling, optimization, conflicts, or any calendar management task..."
            }
            onKeyPress={(e) => e.key === 'Enter' && !isTyping && handleSendMessage()}
            className="flex-1"
            disabled={isTyping}
          />
          <Button 
            onClick={() => handleSendMessage()} 
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

