import { useState, useRef, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSpecialty } from "@/contexts/SpecialtyContext";
import { 
  MessageSquare, 
  HelpCircle, 
  BookOpen, 
  Users, 
  Clock,
  CheckCircle,
  TrendingUp,
  Settings,
  Send,
  Search,
  Bot,
  Heart,
  Sparkles,
  Calendar,
  FileText,
  UserSearch,
  Stethoscope,
  Loader2
} from "lucide-react";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  action?: {
    type: string;
    data: any;
  };
}

interface SageCapability {
  id: string;
  name: string;
  description: string;
  icon: any;
  action: string;
}

const AssistIQ = () => {
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm Sage, your AI practice assistant. I can help you with:\n\n• Finding and searching patient records\n• Scheduling appointments and managing conflicts\n• Generating documents like insurance letters\n• Providing clinical guidance and protocols\n• Answering questions about practice operations\n\nWhat can I help you with today?",
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { specialty } = useSpecialty();

  const capabilities: SageCapability[] = [
    {
      id: 'search',
      name: 'Search Patients',
      description: 'Find patient records by name, ID, or contact info',
      icon: UserSearch,
      action: 'Find patient John Smith'
    },
    {
      id: 'schedule',
      name: 'Schedule Appointments',
      description: 'Book appointments and check availability',
      icon: Calendar,
      action: 'Show me available appointments for tomorrow'
    },
    {
      id: 'documents',
      name: 'Generate Documents',
      description: 'Create letters, forms, and reports',
      icon: FileText,
      action: 'Generate an insurance authorization letter'
    },
    {
      id: 'guidance',
      name: 'Clinical Guidance',
      description: 'Get protocols and treatment guidelines',
      icon: Stethoscope,
      action: 'What is the sleep apnea treatment protocol?'
    }
  ];

  const stats = {
    queriesHandled: 124,
    responseTime: 1.2,
    satisfactionRate: 96,
    activeChats: 8,
    knowledgeBase: 847,
    automatedResolutions: 89
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (messageText?: string) => {
    const message = messageText || inputMessage.trim();
    if (!message || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase.functions.invoke('sage-ai-assistant', {
        body: {
          message,
          userId: user.id,
          specialty: specialty,
          conversationHistory: messages.slice(-10).map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }
      });

      if (error) {
        throw error;
      }

      const assistantMessage: Message = {
        id: Date.now().toString() + '_response',
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        action: data.action
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Sage AI error:', error);
      toast({
        title: "Sorry, I encountered an error",
        description: "Please try again or contact support if the issue persists.",
        variant: "destructive",
      });

      const errorMessage: Message = {
        id: Date.now().toString() + '_error',
        role: 'assistant',
        content: "I apologize, but I encountered an error processing your request. Please try again or rephrase your question.",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleCapabilityClick = (capability: SageCapability) => {
    sendMessage(capability.action);
  };

  return (
    <Layout>
      <PageHeader 
        title="Sage AI Assistant"
        subtitle="Your friendly AI companion for practice support and guidance"
        badge="AI Agent"
      />
      
      <div className="p-6 space-y-6">
        {/* Sage Personality Header */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Bot className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-blue-900 mb-1">Hi there! I'm Sage 👋</h2>
                <p className="text-blue-700">Your AI practice companion, ready to help with questions, guidance, and support. What can I assist you with today?</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Online & Ready
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversations Today</CardTitle>
              <MessageSquare className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.queriesHandled}</div>
              <p className="text-xs text-muted-foreground">+18 from yesterday</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Response Time</CardTitle>
              <Clock className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.responseTime}s</div>
              <p className="text-xs text-muted-foreground">lightning fast!</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Staff Happiness</CardTitle>
              <Heart className="h-4 w-4 text-pink-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-600">{stats.satisfactionRate}%</div>
              <Progress value={stats.satisfactionRate} className="h-1 mt-1" />
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
              <Users className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.activeChats}</div>
              <p className="text-xs text-muted-foreground">ongoing conversations</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Knowledge Base</CardTitle>
              <BookOpen className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.knowledgeBase}</div>
              <p className="text-xs text-muted-foreground">articles ready</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Auto-Magic</CardTitle>
              <Sparkles className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.automatedResolutions}%</div>
              <p className="text-xs text-muted-foreground">resolved instantly</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Chat Interface */}
        <Card className="h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-600" />
              Chat with Sage
            </CardTitle>
            <CardDescription>Ask questions, get help, and let Sage assist with your practice needs</CardDescription>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-blue-600" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                      <div className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                    {message.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-medium">You</span>
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm text-gray-600">Sage is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Quick Actions */}
            <div className="border-t p-4">
              <div className="text-sm font-medium mb-2 text-gray-700">Quick Actions:</div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
                {capabilities.map((capability) => {
                  const IconComponent = capability.icon;
                  return (
                    <Button
                      key={capability.id}
                      variant="outline"
                      size="sm"
                      onClick={() => handleCapabilityClick(capability)}
                      className="justify-start text-left h-auto p-2"
                      disabled={isLoading}
                    >
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4" />
                        <div>
                          <div className="font-medium text-xs">{capability.name}</div>
                          <div className="text-xs text-muted-foreground">{capability.description}</div>
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>

              {/* Input Area */}
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Sage anything about your practice..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button 
                  onClick={() => sendMessage()}
                  disabled={isLoading || !inputMessage.trim()}
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AssistIQ;