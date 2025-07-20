
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface SecureMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_type: 'patient' | 'staff';
  message_text: string;
  message_type: 'text' | 'voice' | 'image' | 'file';
  attachment_url?: string;
  is_read: boolean;
  created_at: string;
}

export interface SecureConversation {
  id: string;
  patient_id: string;
  staff_id?: string;
  title?: string;
  status: 'active' | 'closed';
  last_message_at: string;
  created_at: string;
}

export const useSecureMessaging = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<SecureConversation[]>([]);
  const [messages, setMessages] = useState<SecureMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // Fetch conversations for the current user
  const fetchConversations = async () => {
    if (!user) return;

    try {
      setLoading(true);
      let query = supabase
        .from('chat_conversations')
        .select('*')
        .order('last_message_at', { ascending: false });

      // Filter based on user role
      if (profile?.role === 'patient') {
        query = query.eq('patient_id', user.id);
      } else {
        // Staff can see all conversations or filter by assigned conversations
        query = query.or(`staff_id.eq.${user.id},staff_id.is.null`);
      }

      const { data, error } = await query;

      if (error) throw error;

      setConversations(data || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for a specific conversation
  const fetchMessages = async (conversationId: string) => {
    if (!conversationId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(data || []);
      setActiveConversationId(conversationId);

      // Mark messages as read
      await markMessagesAsRead(conversationId);
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

  // Send a new message
  const sendMessage = async (conversationId: string, messageText: string, messageType: 'text' | 'voice' = 'text') => {
    if (!user || !messageText.trim()) return;

    try {
      const senderType = profile?.role === 'patient' ? 'patient' : 'staff';
      
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          sender_type: senderType,
          message_text: messageText,
          message_type: messageType,
          is_read: false
        })
        .select()
        .single();

      if (error) throw error;

      // Add message to local state
      setMessages(prev => [...prev, data]);

      // Update conversation last message time
      await supabase
        .from('chat_conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', conversationId);

      toast({
        title: "Message Sent",
        description: "Your message has been delivered",
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

  // Create a new conversation (for patients)
  const createConversation = async (title?: string) => {
    if (!user || profile?.role !== 'patient') {
      toast({
        title: "Error",
        description: "Only patients can create conversations",
        variant: "destructive"
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .insert({
          patient_id: user.id,
          title: title || 'Health Inquiry',
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;

      setConversations(prev => [data, ...prev]);
      return data;
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

  // Mark messages as read
  const markMessagesAsRead = async (conversationId: string) => {
    if (!user) return;

    try {
      await supabase
        .from('chat_messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id); // Don't mark own messages as read
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  // Real-time subscription for new messages
  useEffect(() => {
    if (!user || !activeConversationId) return;

    const channel = supabase
      .channel(`messages:${activeConversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `conversation_id=eq.${activeConversationId}`
        },
        (payload) => {
          const newMessage = payload.new as SecureMessage;
          setMessages(prev => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, activeConversationId]);

  // Load conversations on mount
  useEffect(() => {
    fetchConversations();
  }, [user]);

  return {
    conversations,
    messages,
    loading,
    activeConversationId,
    fetchConversations,
    fetchMessages,
    sendMessage,
    createConversation,
    markMessagesAsRead
  };
};
