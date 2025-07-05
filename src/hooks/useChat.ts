import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface ChatConversation {
  id: string;
  patient_id: string;
  provider_id?: string;
  status: string;
  last_message_at: string;
  created_at: string;
  title?: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_type: 'patient' | 'provider';
  message_text: string;
  message_type: string;
  created_at: string;
  read_at?: string;
  is_read?: boolean;
}

export const useChat = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const markAsRead = async (messageId: string) => {
    // Mock mark as read
    console.log('Marking message as read:', messageId);
  };

  const fetchConversations = async (userId?: string) => {
    if (!user && !userId) return;

    try {
      // Mock conversations until chat_conversations table is created
      const mockConversations: ChatConversation[] = [];
      setConversations(mockConversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive"
      });
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      setLoading(true);
      // Mock messages until chat_messages table is created
      const mockMessages: ChatMessage[] = [];
      setMessages(mockMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (conversationId: string, messageText: string) => {
    if (!user || !messageText.trim()) return;

    try {
      // Mock sending message
      console.log('Sending message:', conversationId, messageText);
      
      toast({
        title: "Message Sent",
        description: "Your message has been sent",
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  const createConversation = async (providerId?: string) => {
    if (!user) return null;

    try {
      // Mock conversation creation
      const mockConversation: ChatConversation = {
        id: `conv-${Date.now()}`,
        patient_id: user.id,
        provider_id: providerId,
        status: 'active',
        last_message_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      };

      setConversations(prev => [mockConversation, ...prev]);
      return mockConversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Error",
        description: "Failed to create conversation",
        variant: "destructive"
      });
      return null;
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [user]);

  return {
    conversations,
    messages,
    loading,
    sending,
    fetchConversations,
    fetchMessages,
    sendMessage,
    createConversation,
    markAsRead
  };
};