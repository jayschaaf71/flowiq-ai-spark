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
    "Set up an appointment for a new patient",
    "Walk me through adding a patient record", 
    "How do I process a voice intake form?",
    "Show me how to submit an insurance claim",
    "Help me schedule a follow-up appointment",
    "Guide me through the patient check-in process",
    "How do I generate a sleep study report?",
    "Walk me through scheduling a consultation",
    "Help me set up oral appliance tracking",
    "Show me how to send appointment reminders",
    "Guide me through the billing workflow",
    "How do I access today's patient schedule?"
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