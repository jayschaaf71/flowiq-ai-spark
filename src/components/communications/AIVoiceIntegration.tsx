import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Mic, MicOff, Play, Pause, Volume2, VolumeX, Settings, Zap, Brain, MessageSquare, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface VoiceMessage {
    id: string;
    text: string;
    audioUrl?: string;
    timestamp: string;
    type: 'incoming' | 'outgoing';
    status: 'processing' | 'completed' | 'failed';
    duration?: number;
}

interface VoiceSettings {
    voiceModel: string;
    speed: number;
    pitch: number;
    volume: number;
    autoTranscribe: boolean;
    language: string;
}

export const AIVoiceIntegration: React.FC = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentText, setCurrentText] = useState('');
    const [voiceMessages, setVoiceMessages] = useState<VoiceMessage[]>([]);
    const [settings, setSettings] = useState<VoiceSettings>({
        voiceModel: 'gpt-4',
        speed: 1.0,
        pitch: 1.0,
        volume: 0.8,
        autoTranscribe: true,
        language: 'en-US'
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedVoice, setSelectedVoice] = useState('alloy');
    const [showSettings, setShowSettings] = useState(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const { toast } = useToast();

    useEffect(() => {
        loadVoiceMessages();
        loadSettings();
    }, []);

    const loadVoiceMessages = async () => {
        try {
            const { data, error } = await supabase
                .from('voice_messages')
                .select('*')
                .order('timestamp', { ascending: false })
                .limit(20);

            if (error) throw error;
            setVoiceMessages(data || []);
        } catch (error) {
            console.error('Error loading voice messages:', error);
        }
    };

    const loadSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('voice_settings')
                .select('*')
                .single();

            if (data && !error) {
                setSettings(data);
            }
        } catch (error) {
            console.error('Error loading voice settings:', error);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                await processAudioRecording(audioBlob);
            };

            mediaRecorder.start();
            setIsRecording(true);
            toast({
                title: "Recording started",
                description: "Speak now to capture your message",
            });
        } catch (error) {
            toast({
                title: "Recording failed",
                description: "Unable to access microphone. Please check permissions.",
                variant: "destructive"
            });
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            setIsRecording(false);
        }
    };

    const processAudioRecording = async (audioBlob: Blob) => {
        setIsProcessing(true);
        try {
            // Simulate AI processing
            const formData = new FormData();
            formData.append('audio', audioBlob);
            formData.append('language', settings.language);

            // Simulate API call to OpenAI Whisper
            const transcribedText = await simulateTranscription(audioBlob);

            const newMessage: VoiceMessage = {
                id: Date.now().toString(),
                text: transcribedText,
                timestamp: new Date().toISOString(),
                type: 'incoming',
                status: 'completed'
            };

            setVoiceMessages(prev => [newMessage, ...prev]);
            setCurrentText(transcribedText);

            toast({
                title: "Voice transcribed",
                description: "Your message has been converted to text",
            });

        } catch (error) {
            toast({
                title: "Transcription failed",
                description: "Unable to process audio. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const simulateTranscription = async (audioBlob: Blob): Promise<string> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Return sample transcribed text
        const sampleTexts = [
            "Hello, I'd like to schedule an appointment for next week.",
            "I'm calling to confirm my dental appointment on Friday.",
            "Can you please send me the pre-appointment forms?",
            "I need to reschedule my appointment due to a conflict.",
            "What are your office hours for this week?"
        ];

        return sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    };

    const generateSpeech = async (text: string) => {
        if (!text.trim()) {
            toast({
                title: "Text required",
                description: "Please enter text to convert to speech",
                variant: "destructive"
            });
            return;
        }

        setIsProcessing(true);
        try {
            // Simulate TTS API call
            const audioUrl = await simulateTextToSpeech(text);

            const newMessage: VoiceMessage = {
                id: Date.now().toString(),
                text,
                audioUrl,
                timestamp: new Date().toISOString(),
                type: 'outgoing',
                status: 'completed'
            };

            setVoiceMessages(prev => [newMessage, ...prev]);

            toast({
                title: "Speech generated",
                description: "Text has been converted to speech",
            });

        } catch (error) {
            toast({
                title: "Speech generation failed",
                description: "Unable to generate speech. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const simulateTextToSpeech = async (text: string): Promise<string> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Return a mock audio URL
        return `data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT...`;
    };

    const playAudio = (audioUrl: string) => {
        if (audioRef.current) {
            audioRef.current.src = audioUrl;
            audioRef.current.play();
            setIsPlaying(true);

            audioRef.current.onended = () => {
                setIsPlaying(false);
            };
        }
    };

    const stopAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsPlaying(false);
        }
    };

    const handleSendMessage = () => {
        if (currentText.trim()) {
            generateSpeech(currentText);
            setCurrentText('');
        }
    };

    const formatTimestamp = (timestamp: string): string => {
        return new Date(timestamp).toLocaleString();
    };

    const getMessageStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'processing': return 'bg-yellow-100 text-yellow-800';
            case 'failed': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            {/* Voice Recording */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Mic className="w-5 h-5" />
                        Voice Recording
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="text-center">
                            <Button
                                size="lg"
                                variant={isRecording ? "destructive" : "default"}
                                onClick={isRecording ? stopRecording : startRecording}
                                disabled={isProcessing}
                                className="w-32 h-32 rounded-full"
                            >
                                {isRecording ? (
                                    <MicOff className="w-8 h-8" />
                                ) : (
                                    <Mic className="w-8 h-8" />
                                )}
                            </Button>
                            <p className="text-sm text-gray-600 mt-2">
                                {isRecording ? "Recording... Click to stop" : "Click to start recording"}
                            </p>
                        </div>

                        {isProcessing && (
                            <div className="text-center py-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="text-sm text-gray-600 mt-2">Processing audio...</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Text to Speech */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        Text to Speech
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="textInput">Enter text to convert to speech</Label>
                            <Textarea
                                id="textInput"
                                placeholder="Enter your message here..."
                                value={currentText}
                                onChange={(e) => setCurrentText(e.target.value)}
                                rows={4}
                            />
                        </div>

                        <div className="flex gap-2">
                            <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Select voice" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="alloy">Alloy (Male)</SelectItem>
                                    <SelectItem value="echo">Echo (Male)</SelectItem>
                                    <SelectItem value="fable">Fable (Male)</SelectItem>
                                    <SelectItem value="onyx">Onyx (Male)</SelectItem>
                                    <SelectItem value="nova">Nova (Female)</SelectItem>
                                    <SelectItem value="shimmer">Shimmer (Female)</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button
                                onClick={handleSendMessage}
                                disabled={isProcessing || !currentText.trim()}
                            >
                                <Zap className="w-4 h-4 mr-2" />
                                Generate Speech
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Voice Messages */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Voice Messages
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {voiceMessages.map((message) => (
                            <div key={message.id} className="border rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <Badge className={message.type === 'incoming' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                                            {message.type}
                                        </Badge>
                                        <Badge className={getMessageStatusColor(message.status)}>
                                            {message.status}
                                        </Badge>
                                    </div>
                                    <span className="text-xs text-gray-500">{formatTimestamp(message.timestamp)}</span>
                                </div>

                                <p className="text-sm mb-2">{message.text}</p>

                                {message.audioUrl && (
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => isPlaying ? stopAudio() : playAudio(message.audioUrl!)}
                                        >
                                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                            {isPlaying ? 'Stop' : 'Play'}
                                        </Button>
                                        <span className="text-xs text-gray-500">Audio available</span>
                                    </div>
                                )}
                            </div>
                        ))}

                        {voiceMessages.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                No voice messages yet
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* AI Voice Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        AI Voice Settings
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium">Auto Transcribe</div>
                                <div className="text-sm text-gray-600">Automatically transcribe voice recordings</div>
                            </div>
                            <Button
                                variant={settings.autoTranscribe ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSettings(prev => ({ ...prev, autoTranscribe: !prev.autoTranscribe }))}
                            >
                                {settings.autoTranscribe ? "Enabled" : "Disabled"}
                            </Button>
                        </div>

                        <div>
                            <Label>Speech Speed</Label>
                            <Slider
                                value={[settings.speed]}
                                onValueChange={(value) => setSettings(prev => ({ ...prev, speed: value[0] }))}
                                max={2}
                                min={0.5}
                                step={0.1}
                                className="mt-2"
                            />
                            <div className="text-xs text-gray-500 mt-1">{settings.speed}x</div>
                        </div>

                        <div>
                            <Label>Voice Pitch</Label>
                            <Slider
                                value={[settings.pitch]}
                                onValueChange={(value) => setSettings(prev => ({ ...prev, pitch: value[0] }))}
                                max={2}
                                min={0.5}
                                step={0.1}
                                className="mt-2"
                            />
                            <div className="text-xs text-gray-500 mt-1">{settings.pitch}x</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Hidden audio element for playback */}
            <audio ref={audioRef} style={{ display: 'none' }} />
        </div>
    );
}; 