import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff,
  Monitor,
  MessageSquare,
  FileText,
  Camera,
  Settings,
  Users,
  Clock,
  Wifi,
  WifiOff,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  CircleDot,
  Share,
  Download
} from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  role: 'provider' | 'patient' | 'nurse';
  avatar?: string;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'file' | 'system';
}

const VirtualConsultation = () => {
  const { toast } = useToast();
  const [callStatus, setCallStatus] = useState<'idle' | 'connecting' | 'connected' | 'ended'>('idle');
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState<'good' | 'poor' | 'disconnected'>('good');
  const [activeTab, setActiveTab] = useState('video');
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const [participants] = useState<Participant[]>([
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      role: 'provider',
      isAudioEnabled: true,
      isVideoEnabled: true,
      connectionStatus: 'connected'
    },
    {
      id: '2',
      name: 'John Smith',
      role: 'patient',
      isAudioEnabled: true,
      isVideoEnabled: true,
      connectionStatus: 'connected'
    }
  ]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      senderId: '1',
      senderName: 'Dr. Sarah Johnson',
      message: 'Hello! I can see you clearly. How are you feeling today?',
      timestamp: new Date(Date.now() - 300000),
      type: 'text'
    },
    {
      id: '2',
      senderId: '2',
      senderName: 'John Smith',
      message: 'Hi Dr. Johnson, I\'m doing better than last week. The medication seems to be helping.',
      timestamp: new Date(Date.now() - 240000),
      type: 'text'
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [consultationNotes, setConsultationNotes] = useState('');

  useEffect(() => {
    // Simulate connection quality monitoring
    const interval = setInterval(() => {
      const qualities = ['good', 'poor'];
      setConnectionQuality(qualities[Math.floor(Math.random() * qualities.length)] as any);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const startCall = async () => {
    setCallStatus('connecting');
    
    try {
      // Simulate WebRTC connection
      setTimeout(() => {
        setCallStatus('connected');
        toast({
          title: "Call Connected",
          description: "Virtual consultation has started successfully",
        });
      }, 2000);
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Unable to start the call. Please check your connection.",
        variant: "destructive",
      });
      setCallStatus('idle');
    }
  };

  const endCall = () => {
    setCallStatus('ended');
    toast({
      title: "Call Ended",
      description: "Virtual consultation has been completed",
    });
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    toast({
      title: isVideoEnabled ? "Camera Off" : "Camera On",
      description: `Video has been ${isVideoEnabled ? 'disabled' : 'enabled'}`,
    });
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    toast({
      title: isAudioEnabled ? "Microphone Off" : "Microphone On", 
      description: `Audio has been ${isAudioEnabled ? 'muted' : 'unmuted'}`,
    });
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    toast({
      title: isScreenSharing ? "Screen Share Stopped" : "Screen Share Started",
      description: `Screen sharing has been ${isScreenSharing ? 'stopped' : 'started'}`,
    });
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    toast({
      title: isRecording ? "Recording Stopped" : "Recording Started",
      description: `Session recording has been ${isRecording ? 'stopped' : 'started'}`,
    });
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: '2', // Current user
      senderName: 'John Smith',
      message: newMessage,
      timestamp: new Date(),
      type: 'text'
    };
    
    setChatMessages([...chatMessages, message]);
    setNewMessage('');
  };

  const getConnectionIcon = () => {
    switch (connectionQuality) {
      case 'good': return <Wifi className="h-4 w-4 text-green-500" />;
      case 'poor': return <Wifi className="h-4 w-4 text-yellow-500" />;
      default: return <WifiOff className="h-4 w-4 text-red-500" />;
    }
  };

  const getCallStatusDisplay = () => {
    switch (callStatus) {
      case 'connecting': return { text: 'Connecting...', color: 'bg-yellow-500' };
      case 'connected': return { text: 'Connected', color: 'bg-green-500' };
      case 'ended': return { text: 'Call Ended', color: 'bg-red-500' };
      default: return { text: 'Ready to Connect', color: 'bg-gray-500' };
    }
  };

  const callStatusDisplay = getCallStatusDisplay();

  if (callStatus === 'idle') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl bg-card border-border">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Video className="h-8 w-8 text-primary" />
              Virtual Consultation
            </CardTitle>
            <CardDescription>
              Start your secure video consultation with Dr. Sarah Johnson
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-medium text-foreground">Appointment Details</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Date: January 25, 2024</p>
                  <p>Time: 2:00 PM - 2:30 PM</p>
                  <p>Provider: Dr. Sarah Johnson</p>
                  <p>Type: Follow-up Consultation</p>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-foreground">Pre-Call Checklist</h3>
                <div className="text-sm space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    Camera ready
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    Microphone ready
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    Internet connection stable
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button 
                onClick={startCall}
                size="lg"
                className="px-8 py-3"
              >
                <Video className="mr-2 h-5 w-5" />
                Join Consultation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Badge className={`${callStatusDisplay.color} text-white`}>
            {callStatusDisplay.text}
          </Badge>
          <div className="flex items-center gap-2">
            {getConnectionIcon()}
            <span className="text-sm text-muted-foreground">
              Connection: {connectionQuality}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Clock className="h-4 w-4 mr-2" />
            15:32
          </Button>
          <Button variant="outline" size="sm">
            <Users className="h-4 w-4 mr-2" />
            {participants.length}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-120px)]">
        {/* Main Video Area */}
        <div className="lg:col-span-3 space-y-4">
          <div className="relative bg-black rounded-lg overflow-hidden h-96 lg:h-full">
            {/* Remote Video */}
            <video
              ref={remoteVideoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
            />
            
            {/* Local Video (Picture-in-Picture) */}
            <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-white">
              <video
                ref={localVideoRef}
                className="w-full h-full object-cover mirror"
                autoPlay
                playsInline
                muted
              />
              {!isVideoEnabled && (
                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                  <VideoOff className="h-8 w-8 text-white" />
                </div>
              )}
            </div>

            {/* Participant Info Overlay */}
            <div className="absolute bottom-4 left-4">
              <Badge variant="secondary" className="bg-black/50 text-white">
                Dr. Sarah Johnson
              </Badge>
            </div>

            {/* Recording Indicator */}
            {isRecording && (
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full">
                <CircleDot className="h-3 w-3 animate-pulse" />
                <span className="text-xs">Recording</span>
              </div>
            )}
          </div>

          {/* Control Bar */}
          <div className="flex items-center justify-center gap-4 p-4 bg-card rounded-lg border">
            <Button
              variant={isAudioEnabled ? "default" : "destructive"}
              size="sm"
              onClick={toggleAudio}
            >
              {isAudioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </Button>

            <Button
              variant={isVideoEnabled ? "default" : "destructive"}
              size="sm"
              onClick={toggleVideo}
            >
              {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
            </Button>

            <Button
              variant={isScreenSharing ? "secondary" : "outline"}
              size="sm"
              onClick={toggleScreenShare}
            >
              <Monitor className="h-4 w-4" />
            </Button>

            <Button
              variant={isRecording ? "destructive" : "outline"}
              size="sm"
              onClick={toggleRecording}
            >
              <CircleDot className="h-4 w-4" />
            </Button>

            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={endCall}
            >
              <PhoneOff className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
            </TabsList>

            {/* Chat Tab */}
            <TabsContent value="chat" className="space-y-4">
              <Card className="h-80">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Chat</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-64 overflow-y-auto p-4 space-y-3">
                    {chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === '2' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs p-2 rounded-lg text-sm ${
                            message.senderId === '2'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="font-medium text-xs opacity-70 mb-1">
                            {message.senderName}
                          </p>
                          <p>{message.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-4 border-t flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className="flex-1"
                    />
                    <Button size="sm" onClick={sendMessage}>
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notes Tab */}
            <TabsContent value="notes" className="space-y-4">
              <Card className="h-80">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Consultation Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={consultationNotes}
                    onChange={(e) => setConsultationNotes(e.target.value)}
                    placeholder="Enter consultation notes..."
                    className="h-52 resize-none"
                  />
                  <Button size="sm" className="mt-2 w-full">
                    Save Notes
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Files Tab */}
            <TabsContent value="files" className="space-y-4">
              <Card className="h-80">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Shared Files</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-center text-muted-foreground text-sm">
                    No files shared yet
                  </div>
                  <Button size="sm" className="w-full">
                    <Share className="h-4 w-4 mr-2" />
                    Share File
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Participants */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Participants ({participants.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {participants.map((participant) => (
                <div key={participant.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-medium">
                        {participant.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{participant.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{participant.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {participant.isAudioEnabled ? (
                      <Mic className="h-3 w-3 text-green-500" />
                    ) : (
                      <MicOff className="h-3 w-3 text-red-500" />
                    )}
                    {participant.isVideoEnabled ? (
                      <Video className="h-3 w-3 text-green-500" />
                    ) : (
                      <VideoOff className="h-3 w-3 text-red-500" />
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VirtualConsultation;