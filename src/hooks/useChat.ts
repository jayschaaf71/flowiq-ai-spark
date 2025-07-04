import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_type: 'patient' | 'staff';
  message_text: string;
  message_type: 'text' | 'image' | 'file';
  attachment_url?: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatConversation {
  id: string;
  patient_id: string;
  staff_id?: string;
  title?: string;
  status: string;
  last_message_at: string;
  created_at: string;
  updated_at: string;
  tenant_id?: string;
}

export const useChat = (conversationId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Fetch conversations
  const fetchConversations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .select('*')
        .order('last_message_at', { ascending: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive"
      });
    }
  };

  // Fetch messages for a specific conversation
  const fetchMessages = async (convId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages((data || []) as ChatMessage[]);
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

  // Create a new conversation
  const createConversation = async (title?: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .insert([{
          patient_id: user.id,
          title: title || 'New Conversation',
          status: 'active'
        }])
        .select()
        .single();

      if (error) throw error;
      
      await fetchConversations();
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

  // Send a message
  const sendMessage = async (conversationId: string, messageText: string) => {
    if (!user || !messageText.trim()) return;

    setSending(true);
    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert([{
          conversation_id: conversationId,
          sender_id: user.id,
          sender_type: 'patient', // This will be dynamic based on user role
          message_text: messageText.trim(),
          message_type: 'text'
        }]);

      if (error) throw error;

      // Messages will be updated via real-time subscription
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  // Mark messages as read
  const markAsRead = async (conversationId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('chat_messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    // Subscribe to conversations
    const conversationsChannel = supabase
      .channel('chat_conversations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_conversations'
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    // Subscribe to messages if we have a conversation ID
    let messagesChannel;
    if (conversationId) {
      messagesChannel = supabase
        .channel(`chat_messages_${conversationId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'chat_messages',
            filter: `conversation_id=eq.${conversationId}`
          },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              setMessages(prev => [...prev, payload.new as ChatMessage]);
            } else if (payload.eventType === 'UPDATE') {
              setMessages(prev => prev.map(msg => 
                msg.id === payload.new.id ? payload.new as ChatMessage : msg
              ));
            } else if (payload.eventType === 'DELETE') {
              setMessages(prev => prev.filter(msg => msg.id !== payload.old.id));
            }
          }
        )
        .subscribe();
    }

    return () => {
      supabase.removeChannel(conversationsChannel);
      if (messagesChannel) {
        supabase.removeChannel(messagesChannel);
      }
    };
  }, [user, conversationId]);

  // Initial data fetch
  useEffect(() => {
    if (user) {
      fetchConversations();
      if (conversationId) {
        fetchMessages(conversationId);
      }
    }
  }, [user, conversationId]);

  return {
    messages,
    conversations,
    loading,
    sending,
    sendMessage,
    createConversation,
    markAsRead,
    fetchMessages
  };
};