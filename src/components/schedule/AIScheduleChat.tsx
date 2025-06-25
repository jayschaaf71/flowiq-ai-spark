
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Brain, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useScheduleContext } from "@/hooks/useScheduleContext";
import { useAppointmentCreation } from "@/hooks/useAppointmentCreation";
import { useAIMessageHandler } from "@/components/schedule/AIMessageHandler";
import { AIQuickActions } from "@/components/schedule/AIQuickActions";
import { WelcomeMessage, getInitialSuggestions } from "@/components/schedule/chat/WelcomeMessage";
import { ContextStatus } from "@/components/schedule/chat/ContextStatus";
import { MessagesArea } from "@/components/schedule/chat/MessagesArea";
import { MessageSuggestions } from "@/components/schedule/chat/MessageSuggestions";
import { ChatInput } from "@/components/schedule/chat/ChatInput";

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

  const { handleSendMessage, isTyping, needsApiKey } = useAIMessageHandler({
    profile,
    scheduleContext,
    messages,
    setMessages,
    onAppointmentCreated: createAppointmentAutomatically,
    onContextRefresh: loadScheduleContext
  });

  // Initialize with role-specific welcome message
  useEffect(() => {
    if (profile) {
      const welcomeMessage = WelcomeMessage({ 
        role: profile.role, 
        firstName: profile.first_name 
      });
      
      setMessages([{
        id: '1',
        type: 'ai',
        content: welcomeMessage,
        timestamp: new Date(),
        suggestions: getInitialSuggestions(profile.role)
      }]);
    }
  }, [profile]);

  const handleQuickAction = async (action: string) => {
    if (!action || !action.trim()) return;
    try {
      await handleSendMessage(action);
    } catch (error) {
      console.error('Error in handleQuickAction:', error);
    }
  };

  const handleSuggestionClick = async (suggestion: string) => {
    await handleSendMessage(suggestion);
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

  const lastMessage = messages[messages.length - 1];
  const showSuggestions = messages.length > 0 && 
    lastMessage?.type === 'ai' && 
    lastMessage?.suggestions && 
    !isTyping;

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

          <ContextStatus 
            scheduleContext={scheduleContext}
            userRole={profile.role}
          />

          <MessagesArea 
            messages={messages}
            isTyping={isTyping}
            userRole={profile.role}
          />

          {showSuggestions && (
            <MessageSuggestions
              suggestions={lastMessage.suggestions!}
              userRole={profile.role}
              isTyping={isTyping}
              onSuggestionClick={handleSuggestionClick}
            />
          )}

          <ChatInput
            userRole={profile.role}
            isTyping={isTyping}
            onSendMessage={handleSendMessage}
          />
        </CardContent>
      </Card>
    </div>
  );
};
