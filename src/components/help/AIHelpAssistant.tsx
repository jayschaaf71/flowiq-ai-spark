import React from 'react';
import { AIHelpAssistantUI } from './AIHelpAssistantUI';
import { ChatInterface } from './ChatInterface';
import { useAIHelpAssistant } from '@/hooks/useAIHelpAssistant';

export const AIHelpAssistant: React.FC = () => {
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

  const quickQuestions = [
    "How do I add a new patient?",
    "How does voice intake work?",
    "How do I schedule an appointment?",
    "Show me today's appointments",
    "Search for a patient named John",
    "What are pending intake submissions?",
    "Check recent claims status",
    "How do I cancel an appointment?",
    "What are the AI agents?",
    "How do I process insurance claims?",
    "Send a reminder to a patient",
    "Check provider availability for tomorrow"
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <AIHelpAssistantUI 
        quickQuestions={quickQuestions}
        onQuickQuestion={handleQuickQuestion}
      />
      
      <ChatInterface
        messages={messages}
        inputMessage={inputMessage}
        isLoading={isLoading}
        currentPath={currentPath}
        onInputChange={setInputMessage}
        onSendMessage={handleSendMessage}
        onKeyPress={handleKeyPress}
        onClearConversation={clearConversation}
        messagesEndRef={messagesEndRef}
      />
    </div>
  );
};