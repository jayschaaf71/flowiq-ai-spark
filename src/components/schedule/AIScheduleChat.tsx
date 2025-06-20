
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, Send, User, Bot, Calendar, Clock, Users } from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export const AIScheduleChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your Schedule iQ AI assistant. I can help you with appointment scheduling, calendar optimization, and managing your practice schedule. What would you like to do today?",
      timestamp: new Date(),
      suggestions: [
        "Show me today's schedule",
        "Find available slots for next week",
        "Optimize my calendar",
        "Send appointment reminders"
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
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

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: getAIResponse(inputValue),
        timestamp: new Date(),
        suggestions: getAISuggestions(inputValue)
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('schedule') || lowerInput.includes('today')) {
      return "I can see you have 8 appointments scheduled for today. Your busiest time is between 2-4 PM with back-to-back appointments. Would you like me to suggest some optimizations or show you the detailed schedule?";
    } else if (lowerInput.includes('available') || lowerInput.includes('slots')) {
      return "I found 12 available slots for next week. The best availability is on Tuesday and Thursday mornings. I can automatically fill these slots from your waitlist, or would you prefer to review them first?";
    } else if (lowerInput.includes('optimize')) {
      return "I've analyzed your current schedule and found 3 optimization opportunities: 1) Moving Dr. Smith's 3 PM appointment to 2 PM would create a better flow, 2) Blocking lunch time consistently, 3) Grouping similar appointment types. Should I implement these changes?";
    } else if (lowerInput.includes('reminder')) {
      return "I can send automated reminders for tomorrow's appointments. I have 15 patients scheduled. Would you like me to send SMS, email, or both? I can also customize the message content.";
    } else {
      return "I understand you're asking about scheduling. I can help with appointment booking, calendar optimization, availability checking, and sending reminders. Could you be more specific about what you need?";
    }
  };

  const getAISuggestions = (input: string): string[] => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('schedule') || lowerInput.includes('today')) {
      return ["Show detailed schedule", "Optimize today's appointments", "Check for conflicts"];
    } else if (lowerInput.includes('available') || lowerInput.includes('slots')) {
      return ["Fill from waitlist", "Show slot details", "Block time for admin"];
    } else if (lowerInput.includes('optimize')) {
      return ["Apply optimizations", "Show details", "Schedule for later"];
    } else {
      return ["Book new appointment", "Check availability", "Send reminders", "View analytics"];
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          Schedule iQ AI Assistant
          <Badge className="bg-purple-100 text-purple-700">Online</Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-4">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-purple-100 text-purple-600'
                  }`}>
                    {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  
                  <div className={`p-3 rounded-lg ${
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{message.content}</p>
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
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* AI Suggestions */}
        {messages.length > 0 && messages[messages.length - 1].type === 'ai' && messages[messages.length - 1].suggestions && (
          <div className="space-y-2">
            <p className="text-xs text-gray-500 font-medium">Quick actions:</p>
            <div className="flex flex-wrap gap-2">
              {messages[messages.length - 1].suggestions!.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me about scheduling, availability, or optimizations..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isTyping}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
