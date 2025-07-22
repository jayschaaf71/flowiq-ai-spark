import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { VoiceChat } from '@/utils/VoiceChat';
import { 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Send,
  Volume2,
  VolumeX,
  MessageSquare,
  Activity
} from 'lucide-react';

interface Message {
  type: 'user_message' | 'ai_response' | 'system';
  text: string;
  timestamp: string;
}

interface VoiceInterfaceProps {
  patientId?: string;
  onCallEnd?: (summary: any) => void;
}

export const VoiceInterface = ({ patientId, onCallEnd }: VoiceInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [textMessage, setTextMessage] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  
  const voiceChatRef = useRef<VoiceChat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleMessage = (message: any) => {
    console.log('Voice interface received message:', message);
    
    if (message.type === 'user_message' || message.type === 'ai_response') {
      setMessages(prev => [...prev, message]);
    }
  };

  const handleConnectionChange = (connected: boolean) => {
    setIsConnected(connected);
    setConnectionStatus(connected ? 'connected' : 'disconnected');
    
    if (connected) {
      toast({
        title: "Voice Call Connected",
        description: "You can now speak with the AI assistant",
      });
    } else {
      toast({
        title: "Voice Call Disconnected",
        description: "The voice connection has been closed",
        variant: "destructive",
      });
    }
  };

  const handleSpeakingChange = (speaking: boolean) => {
    setIsSpeaking(speaking);
  };

  const startCall = async () => {
    try {
      setConnectionStatus('connecting');
      
      if (!voiceChatRef.current) {
        voiceChatRef.current = new VoiceChat(
          handleMessage,
          handleConnectionChange,
          handleSpeakingChange
        );
      }
      
      await voiceChatRef.current.connect();
      
    } catch (error: any) {
      console.error('Error starting voice call:', error);
      setConnectionStatus('disconnected');
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to start voice call. Please check your microphone permissions.",
        variant: "destructive",
      });
    }
  };

  const endCall = () => {
    if (voiceChatRef.current) {
      voiceChatRef.current.disconnect();
      voiceChatRef.current = null;
    }
    
    setConnectionStatus('disconnected');
    setIsConnected(false);
    setIsSpeaking(false);
    
    // Generate call summary
    if (onCallEnd && messages.length > 0) {
      const summary = {
        duration: 'N/A',
        messageCount: messages.length,
        patientId,
        timestamp: new Date().toISOString(),
        transcript: messages.map(m => `${m.type === 'user_message' ? 'Patient' : 'AI'}: ${m.text}`).join('\n')
      };
      onCallEnd(summary);
    }
  };

  const sendTextMessage = () => {
    if (!textMessage.trim() || !voiceChatRef.current?.connected) return;
    
    try {
      voiceChatRef.current.sendTextMessage(textMessage);
      setMessages(prev => [...prev, {
        type: 'user_message',
        text: textMessage,
        timestamp: new Date().toISOString()
      }]);
      setTextMessage('');
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500';
      default: return 'bg-red-500';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Connected';
      case 'connecting': return 'Connecting...';
      default: return 'Disconnected';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              AI Voice Assistant
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
              <Badge variant={isConnected ? "default" : "secondary"}>
                {getStatusText()}
              </Badge>
              {isSpeaking && (
                <Badge variant="outline" className="animate-pulse">
                  <Activity className="h-3 w-3 mr-1" />
                  AI Speaking
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Call Controls */}
          <div className="flex items-center justify-center gap-4">
            {!isConnected ? (
              <Button
                onClick={startCall}
                disabled={connectionStatus === 'connecting'}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {connectionStatus === 'connecting' ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Connecting...
                  </>
                ) : (
                  <>
                    <Phone className="w-4 h-4 mr-2" />
                    Start Voice Call
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={endCall}
                variant="destructive"
              >
                <PhoneOff className="w-4 h-4 mr-2" />
                End Call
              </Button>
            )}
          </div>

          {/* Call Info */}
          {isConnected && (
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Mic className="h-4 w-4" />
                  <span>Microphone Active</span>
                </div>
                <div className="flex items-center gap-1">
                  <Volume2 className="h-4 w-4" />
                  <span>Audio Output Ready</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Speak naturally or type a message below. The AI can help with health questions, appointment scheduling, and more.
              </p>
            </div>
          )}

          {/* Messages */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Conversation ({messages.length} messages)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64 w-full">
                <div className="space-y-3">
                  {messages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No messages yet. Start by speaking or typing a message.</p>
                    </div>
                  ) : (
                    messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message.type === 'user_message' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.type === 'user_message'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Text Input */}
          {isConnected && (
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={textMessage}
                onChange={(e) => setTextMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendTextMessage()}
              />
              <Button onClick={sendTextMessage} disabled={!textMessage.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};