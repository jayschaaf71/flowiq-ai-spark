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
import { useAvailability } from "@/hooks/useAvailability";
import { useProviders } from "@/hooks/useProviders";
import { format, addDays, parseISO } from "date-fns";

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
    nextAvailableSlots?: any[];
  };
}

export const AIScheduleChat = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const { checkAvailability } = useAvailability();
  const { providers } = useProviders();
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
      return `Hello${name}! I'm Schedule iQ, your personal appointment assistant. I have real-time access to your scheduling information and can help you with:\n\n• Finding and booking your next appointment\n• Checking actual provider availability\n• Rescheduling existing appointments\n• Setting up appointment reminders\n• Answering questions about your visits\n\nI can see current availability and provide personalized assistance based on real data. What would you like help with today?`;
    } else {
      return `Hello${name}! I'm Schedule iQ, your AI scheduling assistant with real-time access to your practice data. I can help you with:\n\n• Managing appointments with live availability data\n• Optimizing provider schedules based on actual bookings\n• Resolving scheduling conflicts with real-time information\n• Analyzing current scheduling patterns and trends\n• Setting up automated reminders\n• Generating reports from actual appointment data\n• Improving practice efficiency with data-driven insights\n\nI have access to your current schedule and can provide actionable recommendations. What would you like to work on today?`;
    }
  };

  const getRoleSpecificInitialSuggestions = (role: string) => {
    if (role === 'patient') {
      return [
        "Find my next available appointment",
        "Check availability with any provider", 
        "Show me upcoming appointments",
        "Set up appointment reminders"
      ];
    } else {
      return [
        "Show me today's real-time schedule",
        "Find the next available slot with any provider",
        "Check current provider availability",
        "Analyze today's appointment patterns"
      ];
    }
  };

  // Load comprehensive scheduling context with real data
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
      const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');
      const nextWeek = format(addDays(new Date(), 7), 'yyyy-MM-dd');

      // Load appointments based on user role
      let appointmentsQuery = supabase
        .from('appointments')
        .select('*')
        .gte('date', today)
        .order('date')
        .order('time');

      // If patient, only show their appointments
      if (profile.role === 'patient') {
        appointmentsQuery = appointmentsQuery.eq('email', profile.email);
      }

      const { data: appointments } = await appointmentsQuery.limit(100);

      // Load active providers with their details
      const { data: providersData } = await supabase
        .from('providers')
        .select('*')
        .eq('is_active', true);

      // Load team members
      const { data: teamMembers } = await supabase
        .from('team_members')
        .select('*')
        .eq('status', 'active');

      // Get real availability data for next few days
      const availabilityPromises = (providersData || []).map(async (provider) => {
        const slots = await checkAvailability(provider.id, today, 60);
        const tomorrowSlots = await checkAvailability(provider.id, tomorrow, 60);
        return {
          providerId: provider.id,
          providerName: `${provider.first_name} ${provider.last_name}`,
          specialty: provider.specialty,
          todayAvailable: slots.filter(slot => slot.available).length,
          tomorrowAvailable: tomorrowSlots.filter(slot => slot.available).length,
          nextSlots: slots.filter(slot => slot.available).slice(0, 3)
        };
      });

      const availabilityData = await Promise.all(availabilityPromises);
      
      const todaysAppointments = appointments?.filter(apt => apt.date === today).length || 0;
      const weekAppointments = appointments?.filter(apt => {
        const aptDate = parseISO(apt.date);
        const today = new Date();
        const weekFromNow = addDays(today, 7);
        return aptDate >= today && aptDate <= weekFromNow;
      }).length || 0;

      const totalAvailableSlots = availabilityData.reduce((sum, provider) => sum + provider.todayAvailable, 0);
      const nextAvailableSlots = availabilityData
        .filter(provider => provider.nextSlots.length > 0)
        .map(provider => ({
          provider: provider.providerName,
          specialty: provider.specialty,
          slots: provider.nextSlots
        }));

      const contextData = {
        appointments: weekAppointments,
        providers: providersData?.map(p => `${p.first_name} ${p.last_name} (${p.specialty})`).join(', ') || 'None configured',
        availableSlots: totalAvailableSlots,
        todaysAppointments: todaysAppointments,
        totalProviders: (providersData?.length || 0) + (teamMembers?.length || 0),
        upcomingAppointments: appointments?.slice(0, 5) || [],
        userRole: profile.role,
        availabilityDetails: availabilityData,
        nextAvailableSlots: nextAvailableSlots,
        totalActiveProviders: providersData?.length || 0,
        realTimeData: {
          lastUpdated: new Date().toISOString(),
          todayDate: today,
          totalSlotsChecked: availabilityData.length * 18, // Assuming 9 hour day with 30min slots
        }
      };

      setScheduleContext(contextData);

    } catch (error) {
      console.error('Error loading comprehensive schedule context:', error);
      toast({
        title: "Context Loading Error",
        description: "Some scheduling data may not be current",
        variant: "destructive"
      });
    }
  };

  const handleSendMessage = async (messageText?: string) => {
    const messageToSend = messageText || inputValue;
    if (!messageToSend.trim() || !profile) {
      return;
    }

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
      // Refresh context before sending to AI for most current data
      await loadScheduleContext();

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

  const handleSuggestionClick = async (suggestion: string) => {
    await handleSendMessage(suggestion);
  };

  const handleQuickAction = async (action: string) => {
    if (!action || !action.trim()) {
      return;
    }
    try {
      await handleSendMessage(action);
    } catch (error) {
      console.error('Error in handleQuickAction:', error);
      toast({
        title: "Error",
        description: "Failed to process action. Please try again.",
        variant: "destructive",
      });
    }
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

  const roleBasedQuickActions = profile?.role === 'patient' 
    ? ["Find next available appointment with any provider", "Check availability this week", "Show my upcoming appointments", "Set up reminders"]
    : ["Show real-time availability for all providers", "Find next open slot", "Check today's schedule status", "Analyze current booking patterns"];

  // Enhanced Quick AI Actions for real-time data
  const quickAIActions = profile?.role === 'patient' 
    ? [
        { icon: Calendar, label: "Find Next Available", action: "Find the next available appointment slot with any provider, showing real appointment times and provider availability" },
        { icon: Clock, label: "Check This Week", action: "Show me all available appointment times this week with provider details and specialties" },
        { icon: Mail, label: "Setup Reminders", action: "Help me set up appointment reminders via email or SMS for my upcoming visits" },
        { icon: Target, label: "Provider Availability", action: "Show me which providers have availability today and tomorrow with their specialties and time slots" }
      ]
    : [
        { icon: Zap, label: "Real-Time Availability", action: "Show me current real-time availability for all providers with specific time slots and provider details" },
        { icon: BarChart3, label: "Today's Schedule Status", action: "Analyze today's appointment schedule showing booked vs available slots and provider utilization" },
        { icon: Target, label: "Find Open Slots", action: "Identify all open appointment slots today and tomorrow across all providers with specific times" },
        { icon: Mail, label: "Schedule Optimization", action: "Analyze current scheduling patterns and suggest optimizations based on real appointment data" }
      ];

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          Schedule iQ AI Assistant
          <div className="flex gap-2">
            <Badge className={`${profile?.role === 'patient' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
              {profile?.role === 'patient' ? 'Patient Mode' : 'Staff Mode'}
            </Badge>
            <Badge className="bg-green-100 text-green-700">
              {scheduleContext ? `${scheduleContext.todaysAppointments} today` : 'Loading...'}
            </Badge>
            <Badge className="bg-purple-100 text-purple-700">
              <Zap className="h-3 w-3 mr-1" />
              Real-Time Data
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-4">
        {/* Enhanced Quick AI Actions with real-time context */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700">Smart Actions (Real-Time Data)</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickAIActions.map((actionItem, index) => {
              const IconComponent = actionItem.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="h-16 flex flex-col gap-2 text-xs hover:bg-purple-50 hover:border-purple-200"
                  onClick={() => handleQuickAction(actionItem.action)}
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
              onClick={() => handleQuickAction(action)}
              disabled={isTyping}
            >
              {action}
            </Button>
          ))}
        </div>

        {/* Enhanced Context Status with real-time information */}
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
                  {scheduleContext.totalActiveProviders} providers
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {scheduleContext.availableSlots} slots available today
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  Live data
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
                    
                    {/* Enhanced context indicators for AI messages */}
                    {message.type === 'ai' && message.contextUsed && (
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200">
                        <TrendingUp className="h-3 w-3 text-gray-500" />
                        <span className="text-xs text-gray-500">
                          {message.contextUsed.userRole === 'patient' ? 'Personalized' : 'Live data'}: {message.contextUsed.todaysAppointments} appointments, {message.contextUsed.availableSlots} slots available
                          {message.contextUsed.nextAvailableSlots && message.contextUsed.nextAvailableSlots.length > 0 && (
                            `, ${message.contextUsed.nextAvailableSlots.length} providers with availability`
                          )}
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
                        {profile.role === 'patient' ? 'Checking real-time availability...' : 'Analyzing live schedule data...'}
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
                  onClick={() => handleSuggestionClick(suggestion)}
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
            placeholder={profile.role === 'patient' ? "Ask about appointments, availability, or booking..." : "Ask about schedules, availability, optimization..."}
            onKeyPress={(e) => e.key === 'Enter' && !isTyping && handleSendMessage()}
            disabled={isTyping}
            className="flex-1"
          />
          <Button 
            onClick={() => handleSendMessage()} 
            disabled={isTyping || !inputValue.trim()}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
