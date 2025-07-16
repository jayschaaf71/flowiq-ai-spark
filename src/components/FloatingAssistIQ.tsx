import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ChatWindow } from './chat/ChatWindow';
import { useAIHelpAssistant } from '@/hooks/useAIHelpAssistant';
import { useSpecialty } from '@/contexts/SpecialtyContext';
import { 
  X, 
  Minimize2, 
  Maximize2, 
  Trash2,
  MessageCircle,
  Zap
} from 'lucide-react';

export const FloatingAssistIQ: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const { currentSpecialty, getBrandName } = useSpecialty();

  const {
    messages,
    inputMessage,
    isLoading,
    setInputMessage,
    handleSendMessage,
    handleKeyPress,
    clearConversation,
    handleQuickQuestion
  } = useAIHelpAssistant();

  const quickQuestions = [
    "Set up an appointment for a new patient",
    "Walk me through adding a patient record", 
    "How do I process a voice intake form?",
    "Show me how to submit an insurance claim",
    "Help me schedule a follow-up appointment",
    "Guide me through the patient check-in process"
  ];

  // Dragging logic
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMinimized) return;
    
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input') || target.closest('[data-radix-scroll-area-viewport]')) {
      return;
    }
    
    setIsDragging(true);
    const rect = windowRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      const maxX = window.innerWidth - 400;
      const maxY = window.innerHeight - 600;
      
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

  // Close with proper cleanup
  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  // Floating trigger button
  if (!isOpen) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setIsOpen(true)}
              className="fixed bottom-6 right-6 h-20 w-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-2xl z-50 group transition-all duration-300 hover:scale-110"
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
            <p>Sage AI - Your Practice Assistant</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Minimized state
  if (isMinimized) {
    return (
      <div 
        className="fixed z-50 w-80 shadow-2xl border-2 border-blue-200 bg-white rounded-lg overflow-hidden"
        style={{ 
          left: Math.max(20, Math.min(position.x, window.innerWidth - 340)),
          top: Math.max(20, Math.min(position.y, window.innerHeight - 120))
        }}
        ref={windowRef}
      >
        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white cursor-move">
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
                onClick={handleClose}
                className="h-6 w-6 text-white hover:bg-white/20"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full window
  return (
    <div
      className="fixed z-50 w-96 h-[600px] shadow-2xl border-2 border-blue-200 flex flex-col bg-white rounded-lg overflow-hidden"
      style={{ 
        left: Math.max(20, Math.min(position.x, window.innerWidth - 400)),
        top: Math.max(20, Math.min(position.y, window.innerHeight - 620))
      }}
      ref={windowRef}
    >
      {/* Header */}
      <div 
        className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white cursor-move select-none"
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
              onClick={handleClose}
              className="h-6 w-6 text-white hover:bg-white/20"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Questions */}
      {messages.length <= 1 && (
        <div className="p-3 border-b bg-gray-50">
          <div className="text-xs font-medium text-gray-600 mb-2">Quick Start</div>
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

      {/* Chat Window */}
      <div className="flex-1 overflow-hidden">
        <ChatWindow
          messages={messages}
          inputMessage={inputMessage}
          isLoading={isLoading}
          onInputChange={setInputMessage}
          onSendMessage={handleSendMessage}
          onKeyPress={handleKeyPress}
        />
      </div>

      {/* Status Bar */}
      <div className="px-3 py-1 border-t bg-gray-50 text-xs text-gray-500">
        {getBrandName()} • {currentSpecialty}
      </div>
    </div>
  );
};