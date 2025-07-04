import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useChat, ChatMessage, ChatConversation } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import { 
  MessageSquare, 
  Send, 
  Plus, 
  Clock,
  CheckCircle,
  User,
  Stethoscope
} from 'lucide-react';
import { format } from 'date-fns';

export const RealTimeChatInterface = () => {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    messages, 
    conversations, 
    loading, 
    sending, 
    sendMessage, 
    createConversation, 
    markAsRead,
    fetchMessages
  } = useChat(selectedConversation || undefined);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark messages as read when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      markAsRead(selectedConversation);
    }
  }, [selectedConversation, markAsRead]);

  const handleSendMessage = async () => {
    if (!selectedConversation || !newMessage.trim()) return;
    
    await sendMessage(selectedConversation, newMessage);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCreateNewConversation = async () => {
    const conversation = await createConversation('New Support Request');
    if (conversation) {
      setSelectedConversation(conversation.id);
    }
  };

  const getMessageSenderInfo = (message: ChatMessage) => {
    if (message.sender_type === 'patient') {
      return {
        name: 'You',
        icon: User,
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800'
      };
    } else {
      return {
        name: 'Staff',
        icon: Stethoscope,
        bgColor: 'bg-green-100',
        textColor: 'text-green-800'
      };
    }
  };

  const getUnreadCount = (conversationId: string) => {
    return messages.filter(msg => 
      msg.conversation_id === conversationId && 
      !msg.is_read && 
      msg.sender_id !== user?.id
    ).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-gray-600">Loading your conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[600px] border rounded-lg overflow-hidden">
      {/* Conversations Sidebar */}
      <div className="w-1/3 border-r bg-gray-50">
        <div className="p-4 border-b bg-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Conversations</h3>
            <Button size="sm" onClick={handleCreateNewConversation}>
              <Plus className="w-4 h-4 mr-1" />
              New
            </Button>
          </div>
          <p className="text-sm text-gray-600">Chat with your healthcare team</p>
        </div>
        
        <ScrollArea className="h-full">
          <div className="p-2">
            {conversations.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600 mb-3">No conversations yet</p>
                <Button size="sm" onClick={handleCreateNewConversation}>
                  Start a conversation
                </Button>
              </div>
            ) : (
              conversations.map((conversation) => {
                const unreadCount = getUnreadCount(conversation.id);
                const isSelected = selectedConversation === conversation.id;
                
                return (
                  <div
                    key={conversation.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                      isSelected 
                        ? 'bg-blue-100 border-blue-200 border' 
                        : 'bg-white hover:bg-gray-100 border border-gray-200'
                    }`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm truncate">
                        {conversation.title || 'Support Request'}
                      </h4>
                      {unreadCount > 0 && (
                        <Badge variant="default" className="text-xs">
                          {unreadCount}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {format(new Date(conversation.last_message_at), 'MMM d, h:mm a')}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-white">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    <Stethoscope className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">Healthcare Team</h3>
                  <p className="text-sm text-gray-600">Online support</p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => {
                  const senderInfo = getMessageSenderInfo(message);
                  const isOwnMessage = message.sender_id === user?.id;
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                        <div
                          className={`rounded-lg p-3 ${
                            isOwnMessage
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.message_text}</p>
                        </div>
                        <div className={`flex items-center gap-2 mt-1 text-xs text-gray-500 ${
                          isOwnMessage ? 'justify-end' : 'justify-start'
                        }`}>
                          <span>{format(new Date(message.created_at), 'h:mm a')}</span>
                          {isOwnMessage && (
                            <div className="flex items-center gap-1">
                              {message.is_read ? (
                                <CheckCircle className="w-3 h-3 text-green-500" />
                              ) : (
                                <Clock className="w-3 h-3 text-gray-400" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {!isOwnMessage && (
                        <Avatar className="w-8 h-8 order-1 mr-2">
                          <AvatarFallback className={senderInfo.bgColor}>
                            <senderInfo.icon className={`w-4 h-4 ${senderInfo.textColor}`} />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={sending}
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!newMessage.trim() || sending}
                  size="icon"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-600 mb-4">
                Choose a conversation from the sidebar or start a new one
              </p>
              <Button onClick={handleCreateNewConversation}>
                <Plus className="w-4 h-4 mr-2" />
                Start New Conversation
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};