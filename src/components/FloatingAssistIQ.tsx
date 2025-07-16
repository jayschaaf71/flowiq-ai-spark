import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAIHelpAssistant } from '@/hooks/useAIHelpAssistant';
import { 
  Sparkles, 
  X, 
  Send, 
  Minimize2, 
  Maximize2, 
  Trash2,
  MessageCircle,
  Zap,
  Mic,
  MicOff
} from 'lucide-react';

// Extend Window interface for Speech Recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const FloatingAssistIQ: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    inputMessage,
    isLoading,
    messagesEndRef,
    currentPath,
    setInputMessage,
    handleSendMessage,
    handleKeyPress,
    clearConversation,
    handleQuickQuestion
  } = useAIHelpAssistant();

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsRecording(false);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognitionInstance.onend = () => {
        setIsRecording(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [setInputMessage]);

  // Voice recording functions
  const startRecording = () => {
    if (recognition) {
      setIsRecording(true);
      recognition.start();
    }
  };

  const stopRecording = () => {
    if (recognition) {
      recognition.stop();
      setIsRecording(false);
    }
  };

  const quickQuestions = [
    "How do I add a new patient?",
    "How does voice intake work?", 
    "How do I schedule an appointment?",
    "Show me today's appointments",
    "What are the AI agents?",
    "How do I process insurance claims?"
  ];

  // Handle dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMinimized) return;
    setIsDragging(true);
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Keep within viewport bounds with proper boundaries
      const cardWidth = 400; // Approximate width of the widget
      const cardHeight = 600; // Height of the widget
      const maxX = window.innerWidth - cardWidth;
      const maxY = window.innerHeight - cardHeight;
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Floating trigger button
  if (!isOpen) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setIsOpen(true)}
              className="fixed bottom-6 right-6 h-20 w-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-2xl z-40 group transition-all duration-300 hover:scale-110"
              size="icon"
            >
              <div className="relative flex flex-col items-center">
                <Zap className="h-8 w-8 text-white mb-1" />
                <span className="text-xs font-semibold text-white">SAGE AI</span>
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-400 rounded-full animate-pulse border-2 border-white" />
              </div>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Sage AI - Your Friendly AI Assistant</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Minimized state
  if (isMinimized) {
    return (
      <Card 
        className="fixed z-50 w-80 shadow-2xl border-2 border-blue-200 bg-white rounded-lg overflow-hidden"
        style={{ 
          left: Math.max(20, Math.min(position.x, window.innerWidth - 340)), // 340px = w-80 + padding
          top: Math.max(20, Math.min(position.y, window.innerHeight - 120))   // 120px for header height + padding
        }}
        ref={cardRef}
      >
        <CardHeader className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white cursor-move">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              <span className="font-semibold">Sage AI</span>
              <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                AI
              </Badge>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMinimized(false)}
                className="h-6 w-6 text-white hover:bg-white/20"
              >
                <Maximize2 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost" 
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 text-white hover:bg-white/20"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  // Full widget
  return (
    <Card 
      className="fixed z-50 w-96 h-[600px] shadow-2xl border-2 border-blue-200 flex flex-col bg-white rounded-lg overflow-hidden"
      style={{ 
        left: Math.max(20, Math.min(position.x, window.innerWidth - 400)), // 400px = w-96 + padding
        top: Math.max(20, Math.min(position.y, window.innerHeight - 620))   // 620px = h-[600px] + padding
      }}
      ref={cardRef}
      onClick={(e) => e.stopPropagation()} // Prevent event bubbling
    >
      <CardHeader 
        className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Zap className="h-5 w-5" />
              <div className="absolute -top-1 -right-1 h-2 w-2 bg-green-400 rounded-full animate-pulse" />
            </div>
            <span className="font-semibold">Sage AI</span>
            <Badge variant="secondary" className="bg-white/20 text-white text-xs">
              Assistant
            </Badge>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={clearConversation}
              className="h-6 w-6 text-white hover:bg-white/20"
              title="Clear conversation"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(true)}
              className="h-6 w-6 text-white hover:bg-white/20"
            >
              <Minimize2 className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 text-white hover:bg-white/20"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Quick Questions */}
        {messages.length <= 1 && (
          <div className="p-3 border-b bg-gray-50">
            <div className="flex items-center gap-1 mb-2">
              <Sparkles className="h-3 w-3 text-blue-500" />
              <span className="text-xs font-medium text-gray-600">Quick Start</span>
            </div>
            <div className="grid grid-cols-1 gap-1">
              {quickQuestions.slice(0, 3).map((question, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="justify-start text-xs h-auto p-2 text-gray-600 hover:text-gray-800 hover:bg-white"
                  onClick={() => handleQuickQuestion(question)}
                >
                  <MessageCircle className="h-3 w-3 mr-1" />
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <ScrollArea 
          className="flex-1 p-3"
          style={{ 
            touchAction: 'pan-y',
            overscrollBehavior: 'contain'
          }}
        >
          <div 
            className="space-y-3"
            onWheel={(e) => {
              // Prevent event from bubbling to parent/document
              e.stopPropagation();
              
              // Allow scrolling within this container
              const element = e.currentTarget.parentElement; // ScrollArea viewport
              if (element) {
                const atTop = element.scrollTop === 0;
                const atBottom = element.scrollTop >= element.scrollHeight - element.clientHeight;
                
                // Only prevent default if we can scroll in the direction
                if ((e.deltaY < 0 && !atTop) || (e.deltaY > 0 && !atBottom)) {
                  e.preventDefault();
                }
              }
            }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-lg text-sm ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : message.type === 'system' 
                        ? 'bg-orange-100 text-orange-800 border border-orange-200'
                        : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="whitespace-pre-wrap break-words">{message.content}</div>
                  <div className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-xs text-gray-500">Sage is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-3 border-t bg-white">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask Sage anything about your practice..."
              onKeyPress={handleKeyPress}
              className="flex-1 text-sm"
              disabled={isLoading}
            />
            <Button 
              onClick={isRecording ? stopRecording : startRecording}
              size="icon"
              variant={isRecording ? "destructive" : "outline"}
              disabled={isLoading}
              className={isRecording ? "animate-pulse" : ""}
              title={isRecording ? "Stop recording" : "Start voice input"}
            >
              {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button 
              onClick={handleSendMessage}
              size="icon"
              disabled={isLoading || !inputMessage.trim()}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex justify-between items-center mt-1">
            <div className="text-xs text-gray-500">
              Current page: {currentPath}
            </div>
            {isRecording && (
              <div className="text-xs text-red-500 animate-pulse">
                🎤 Recording...
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
