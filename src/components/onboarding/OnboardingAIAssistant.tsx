import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { 
  Bot, 
  Send, 
  MessageCircle, 
  CheckCircle, 
  AlertCircle, 
  Lightbulb,
  ArrowRight,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { OnboardingData } from '@/hooks/useOnboardingFlow';

interface Message {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  helpful?: boolean;
}

interface OnboardingAIAssistantProps {
  currentStep: string;
  onboardingData: OnboardingData;
  isMinimized?: boolean;
  onToggleSize?: () => void;
  onSuggestionApply?: (suggestion: any) => void;
}

export const OnboardingAIAssistant: React.FC<OnboardingAIAssistantProps> = ({
  currentStep,
  onboardingData,
  isMinimized = false,
  onToggleSize,
  onSuggestionApply
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Initialize with welcome message based on current step
    const welcomeMessage = getStepWelcomeMessage(currentStep, onboardingData);
    if (welcomeMessage) {
      setMessages([{
        id: '1',
        type: 'ai',
        content: welcomeMessage.content,
        timestamp: new Date(),
        suggestions: welcomeMessage.suggestions
      }]);
    }
  }, [currentStep]);

  const getStepWelcomeMessage = (step: string, data: OnboardingData) => {
    switch (step) {
      case 'specialty':
        return {
          content: "Hi! I'm your FlowIQ setup assistant. I'll help you configure your practice management system step by step. Let's start with your practice specialty - this helps me customize everything for your specific needs. What type of practice are you setting up?",
          suggestions: [
            "I run a chiropractic clinic",
            "I have a dental practice", 
            "I'm setting up a med spa",
            "What's the difference between specialties?"
          ]
        };
      
      case 'practice':
        return {
          content: `Great choice with ${data.specialty || 'your specialty'}! Now let's set up your practice details. I'll help you configure the information that will appear on all your forms, communications, and patient interactions. What's your practice name?`,
          suggestions: [
            "Help me choose a good practice name",
            "What information do I need to provide?",
            "Can I change this later?",
            "Skip to essential fields only"
          ]
        };
      
      case 'team':
        return {
          content: "Now let's add your team members! I can help you set up roles, permissions, and send invitations. Team members will get instant access to collaborate on patient care. Who would you like to add first?",
          suggestions: [
            "Add a provider/doctor",
            "Add front desk staff",
            "Add an office manager",
            "I'll add team members later"
          ]
        };
      
      case 'agents':
        return {
          content: "Time to configure your AI agents! These will automate routine tasks and help your practice run more efficiently. I recommend starting with 1-2 agents and adding more as you get comfortable. Which would help you most?",
          suggestions: [
            "Start with scheduling automation",
            "Set up phone answering agent",
            "Configure billing assistant",
            "Show me all options"
          ]
        };
      
      default:
        return {
          content: "I'm here to help with any questions about setting up your FlowIQ practice. What would you like to know?",
          suggestions: [
            "Explain this step",
            "What are best practices?",
            "Can I skip this?",
            "How long will setup take?"
          ]
        };
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response (in production, this would call your AI service)
    setTimeout(() => {
      const aiResponse = generateAIResponse(input.trim(), currentStep, onboardingData);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse.content,
        timestamp: new Date(),
        suggestions: aiResponse.suggestions
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string, step: string, data: OnboardingData) => {
    const lowerInput = userInput.toLowerCase();

    // Context-aware responses based on current step and user input
    if (step === 'specialty') {
      if (lowerInput.includes('chiropractic')) {
        return {
          content: "Perfect! Chiropractic practices benefit greatly from FlowIQ's specialized features like SOAP note templates, treatment plan automation, and insurance billing integration. I'll configure everything specifically for chiropractic workflows.",
          suggestions: ["What makes chiropractic setup different?", "Continue to practice details"]
        };
      }
      if (lowerInput.includes('difference') || lowerInput.includes('specialties')) {
        return {
          content: "Each specialty comes with pre-built templates, workflows, and integrations. For example:\n\n• Chiropractic: SOAP notes, treatment plans, insurance billing\n• Med Spa: Consent forms, treatment tracking, aftercare protocols\n• Dental: Treatment plans, insurance pre-authorization, recall systems\n\nChoosing the right specialty ensures you get the most relevant tools from day one.",
          suggestions: ["I run a chiropractic clinic", "Show me med spa features", "I have a dental practice"]
        };
      }
    }

    if (step === 'practice' && (lowerInput.includes('name') || lowerInput.includes('choose'))) {
      return {
        content: "For your practice name, use your official business name exactly as it appears on your license and insurance forms. This ensures consistency across all patient communications and legal documents. For example: 'Smith Family Chiropractic' rather than 'Dr. Smith's Office'.",
        suggestions: ["What about phone and email?", "Continue with my practice name", "Can I use a DBA name?"]
      };
    }

    if (lowerInput.includes('skip') || lowerInput.includes('later')) {
      return {
        content: "Absolutely! You can skip optional steps and come back to them later from your settings. Required steps (marked with *) ensure FlowIQ works properly for your practice. Would you like me to show you which steps you can safely skip?",
        suggestions: ["Show me required vs optional", "Skip this step", "Continue with current step"]
      };
    }

    if (lowerInput.includes('help') || lowerInput.includes('how') || lowerInput.includes('what')) {
      return {
        content: `For the ${step} step, I recommend focusing on the core requirements first. This ensures FlowIQ is functional quickly, then you can enhance features over time. Would you like me to walk you through the essentials?`,
        suggestions: ["Show me the essentials", "Explain each field", "What happens next?"]
      };
    }

    // Generic helpful response
    return {
      content: "I understand you're asking about the setup process. I'm here to help make this as smooth as possible. Each step builds on the previous one to create your complete practice management system. What specific aspect would you like help with?",
      suggestions: [
        "Explain this step in detail",
        "What are the requirements?", 
        "How long will this take?",
        "Show me a quick overview"
      ]
    };
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    handleSendMessage();
  };

  if (isMinimized) {
    return (
      <Card className="fixed bottom-4 right-4 w-16 h-16 bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={onToggleSize}>
        <CardContent className="p-0 flex items-center justify-center h-full">
          <Bot className="h-6 w-6" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 h-[500px] shadow-xl border border-primary/20 bg-background">
      <CardHeader className="bg-primary text-primary-foreground p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary-accent text-primary-foreground">
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-sm font-medium">FlowIQ Setup Assistant</CardTitle>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 bg-success rounded-full"></div>
                <span className="text-xs opacity-90">Online</span>
              </div>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onToggleSize}
            className="text-primary-foreground hover:bg-primary-accent"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex flex-col h-[420px]">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  {message.suggestions && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-1 text-xs opacity-75">
                        <Lightbulb className="h-3 w-3" />
                        <span>Quick actions:</span>
                      </div>
                      {message.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="w-full justify-start text-xs h-8"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          <ArrowRight className="h-3 w-3 mr-1" />
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted text-muted-foreground rounded-lg p-3">
                  <div className="flex items-center gap-1">
                    <div className="flex gap-1">
                      <div className="h-2 w-2 bg-current rounded-full animate-bounce"></div>
                      <div className="h-2 w-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="h-2 w-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs ml-2">Assistant is typing...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about setup..."
              className="min-h-[40px] max-h-[100px] resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!input.trim() || isTyping}
              className="self-end"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>Press Enter to send, Shift+Enter for new line</span>
            <Badge variant="outline" className="text-xs">
              <CheckCircle className="h-3 w-3 mr-1" />
              Step {currentStep}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};