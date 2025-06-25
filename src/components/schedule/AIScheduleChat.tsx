
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Brain, Send, User, Bot, Calendar, Clock, Users, Loader2, Zap, TrendingUp, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useScheduleContext } from "@/hooks/useScheduleContext";
import { useAppointmentCreation } from "@/hooks/useAppointmentCreation";
import { useAIMessageHandler } from "@/components/schedule/AIMessageHandler";
import { AIQuickActions } from "@/components/schedule/AIQuickActions";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  contextUsed?: any;
}

export const AIScheduleChat = () => {
  const { user, profile } = useAuth();
  const { scheduleContext, loadScheduleContext } = useScheduleContext(profile);
  const { createAppointmentAutomatically } = useAppointmentCreation(user, profile);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { handleSendMessage, isTyping, needsApiKey } = useAIMessageHandler({
    profile,
    scheduleContext,
    messages,
    setMessages,
    onAppointmentCreated: createAppointmentAutomatically,
    onContextRefresh: loadScheduleContext
  });

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

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
      return `Hello${name}! I'm Schedule iQ, your personal appointment assistant. I have real-time access to your scheduling information and can help you with:\n\n• Finding and booking your next appointment automatically\n• Checking actual provider availability\n• Rescheduling existing appointments\n• Setting up appointment reminders\n• Answering questions about your visits\n\nI can see current availability, book appointments instantly, and send confirmations automatically. What would you like help with today?`;
    } else {
      return `Hello${name}! I'm Schedule iQ, your AI scheduling assistant with real-time access to your practice data. I can help you with:\n\n• Managing appointments with live availability data\n• Automatically creating appointments for patients\n• Optimizing provider schedules based on actual bookings\n• Resolving scheduling conflicts with real-time information\n• Analyzing current scheduling patterns and trends\n• Setting up automated reminders and confirmations\n• Generating reports from actual appointment data\n• Improving practice efficiency with data-driven insights\n\nI have access to your current schedule and can create appointments automatically with confirmations. What would you like to work on today?`;
    }
  };

  const getRoleSpecificInitialSuggestions = (role: string) => {
    if (role === 'patient') {
      return [
        "Book my next available appointment automatically",
        "Find and schedule with any available provider", 
        "Show me upcoming appointments",
        "Set up appointment reminders"
      ];
    } else {
      return [
        "Book next available slot for a patient automatically",
        "Find and create appointment with any provider",
        "Check current provider availability",
        "Analyze today's appointment patterns"
      ];
    }
  };

  const handleQuickAction = async (action: string) => {
    if (!action || !action.trim()) {
      return;
    }
    try {
      await handleSendMessage(action);
    } catch (error) {
      console.error('Error in handleQuickAction:', error);
    }
  };

  const handleSuggestionClick = async (suggestion: string) => {
    await handleSendMessage(suggestion);
  };

  const handleInputSubmit = async () => {
    if (!inputValue.trim() || isTyping) return;
    await handleSendMessage(inputValue);
    setInputValue("");
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

  return (
    <div className="h-full flex flex-col max-h-[calc(100vh-120px)]">
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardHeader className="pb-3 flex-shrink-0">
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
                Auto-Booking
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
          <div className="flex-shrink-0">
            <AIQuickActions 
              userRole={profile?.role || 'patient'}
              isTyping={isTyping}
              onActionClick={handleQuickAction}
            />
          </div>

          {/* Enhanced Context Status */}
          {scheduleContext && (
            <div className="flex items-center gap-4 text-xs text-gray-600 bg-gray-50 p-2 rounded flex-shrink-0">
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
                </>
              )}
              <span className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Auto-booking enabled
              </span>
            </div>
          )}

          {/* Messages Area - Fixed Height with Proper Scrolling */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="space-y-4 p-1">
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
                              Auto-booking enabled: {message.contextUsed.todaysAppointments} appointments, {message.contextUsed.availableSlots} slots available
                              {message.contextUsed.nextAvailableSlots && message.contextUsed.nextAvailableSlots.length > 0 && (
                                `, ${message.contextUsed.nextAvailableSlots.length} providers ready for instant booking`
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
                            {profile.role === 'patient' ? 'Finding appointment and preparing auto-booking...' : 'Analyzing schedule and preparing appointment creation...'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </div>

          {/* Enhanced AI Suggestions */}
          {messages.length > 0 && messages[messages.length - 1].type === 'ai' && messages[messages.length - 1].suggestions && !isTyping && (
            <div className="space-y-2 flex-shrink-0">
              <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                <Zap className="h-3 w-3" />
                {profile.role === 'patient' ? 'Quick auto-booking actions:' : 'Smart booking suggestions:'}
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
          <div className="flex gap-2 flex-shrink-0">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={profile.role === 'patient' ? "Ask to book appointments automatically..." : "Request automatic appointment creation..."}
              onKeyPress={(e) => e.key === 'Enter' && !isTyping && handleInputSubmit()}
              disabled={isTyping}
              className="flex-1"
            />
            <Button 
              onClick={handleInputSubmit} 
              disabled={isTyping || !inputValue.trim()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
