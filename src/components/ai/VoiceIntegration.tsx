import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSageAI } from '@/contexts/SageAIContext';
import { toast } from '@/hooks/use-toast';
import {
    Mic,
    MicOff,
    Volume2,
    VolumeX,
    Play,
    Pause,
    Square,
    Settings,
    Languages,
    Globe,
    Smartphone,
    Monitor,
    Wifi,
    WifiOff
} from 'lucide-react';

interface VoiceIntegrationProps {
    onTranscript?: (text: string) => void;
    onSpeak?: (text: string) => void;
}

export const VoiceIntegration: React.FC<VoiceIntegrationProps> = ({
    onTranscript,
    onSpeak
}) => {
    const { applicationType } = useSageAI();

    // Voice states
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voiceEnabled, setVoiceEnabled] = useState(false);
    const [voiceLanguage, setVoiceLanguage] = useState('en-US');
    const [voiceSpeed, setVoiceSpeed] = useState(1);
    const [voiceVolume, setVoiceVolume] = useState(0.8);
    const [transcript, setTranscript] = useState('');
    const [isSupported, setIsSupported] = useState(false);

    // Refs
    const recognitionRef = useRef<any>(null);
    const synthesisRef = useRef<SpeechSynthesis | null>(null);

    const languages = [
        { code: 'en-US', name: 'English (US)' },
        { code: 'es-ES', name: 'Spanish' },
        { code: 'fr-FR', name: 'French' },
        { code: 'de-DE', name: 'German' },
        { code: 'it-IT', name: 'Italian' },
        { code: 'pt-BR', name: 'Portuguese' },
        { code: 'ja-JP', name: 'Japanese' },
        { code: 'ko-KR', name: 'Korean' },
        { code: 'zh-CN', name: 'Chinese (Simplified)' }
    ];

    // Check browser support
    useEffect(() => {
        const checkSupport = () => {
            const hasSpeechRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
            const hasSpeechSynthesis = 'speechSynthesis' in window;
            setIsSupported(hasSpeechRecognition && hasSpeechSynthesis);
        };

        checkSupport();
    }, []);

    // Initialize speech recognition
    useEffect(() => {
        if (!isSupported) return;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = voiceLanguage;

            recognitionRef.current.onstart = () => {
                setIsListening(true);
                toast({
                    title: "Voice Recognition Active",
                    description: "Listening for voice input...",
                });
            };

            recognitionRef.current.onresult = (event: any) => {
                let finalTranscript = '';
                let interimTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                    } else {
                        interimTranscript += transcript;
                    }
                }

                const fullTranscript = finalTranscript || interimTranscript;
                setTranscript(fullTranscript);

                if (finalTranscript && onTranscript) {
                    onTranscript(finalTranscript);
                }
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
                toast({
                    title: "Voice Recognition Error",
                    description: event.error,
                    variant: "destructive"
                });
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }

        // Initialize speech synthesis
        synthesisRef.current = window.speechSynthesis;
    }, [isSupported, voiceLanguage, onTranscript]);

    // Handle voice input
    const handleStartListening = () => {
        if (!isSupported) {
            toast({
                title: "Voice Not Supported",
                description: "Voice recognition is not supported in this browser.",
                variant: "destructive"
            });
            return;
        }

        if (recognitionRef.current) {
            try {
                recognitionRef.current.start();
            } catch (error) {
                console.error('Error starting speech recognition:', error);
                toast({
                    title: "Voice Recognition Error",
                    description: "Failed to start voice recognition.",
                    variant: "destructive"
                });
            }
        }
    };

    const handleStopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    };

    // Handle voice output
    const handleSpeak = (text: string) => {
        if (!isSupported || !synthesisRef.current) {
            toast({
                title: "Voice Not Supported",
                description: "Text-to-speech is not supported in this browser.",
                variant: "destructive"
            });
            return;
        }

        // Stop any current speech
        synthesisRef.current.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = voiceLanguage;
        utterance.rate = voiceSpeed;
        utterance.volume = voiceVolume;

        utterance.onstart = () => {
            setIsSpeaking(true);
        };

        utterance.onend = () => {
            setIsSpeaking(false);
        };

        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            setIsSpeaking(false);
            toast({
                title: "Speech Synthesis Error",
                description: "Failed to speak the text.",
                variant: "destructive"
            });
        };

        synthesisRef.current.speak(utterance);
    };

    const handleStopSpeaking = () => {
        if (synthesisRef.current) {
            synthesisRef.current.cancel();
            setIsSpeaking(false);
        }
    };

    // Test voice functionality
    const handleTestVoice = () => {
        const testText = `Hello! I'm Sage AI, your ${applicationType} assistant. How can I help you today?`;
        handleSpeak(testText);
    };

    if (!isSupported) {
        return (
            <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-800">
                        <WifiOff className="h-4 w-4" />
                        Voice Not Supported
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-orange-700">
                        Voice recognition and text-to-speech are not supported in this browser.
                        Please use Chrome, Edge, or Safari for voice features.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {/* Voice Controls */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Mic className="h-4 w-4" />
                        Voice Controls
                    </CardTitle>
                    <CardDescription>
                        Control voice input and output for hands-free interaction
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Voice Input */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label>Voice Input</Label>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant={isListening ? "destructive" : "default"}
                                    onClick={isListening ? handleStopListening : handleStartListening}
                                    disabled={!voiceEnabled}
                                >
                                    {isListening ? (
                                        <>
                                            <MicOff className="h-4 w-4 mr-2" />
                                            Stop Listening
                                        </>
                                    ) : (
                                        <>
                                            <Mic className="h-4 w-4 mr-2" />
                                            Start Listening
                                        </>
                                    )}
                                </Button>
                                {isListening && (
                                    <Badge variant="secondary" className="animate-pulse">
                                        Listening...
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {transcript && (
                            <div className="p-3 bg-gray-100 rounded-lg">
                                <Label className="text-sm font-medium">Transcript:</Label>
                                <p className="text-sm mt-1">{transcript}</p>
                            </div>
                        )}
                    </div>

                    {/* Voice Output */}
                    <div className="space-y-3 pt-4 border-t">
                        <div className="flex items-center justify-between">
                            <Label>Voice Output</Label>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant={isSpeaking ? "destructive" : "default"}
                                    onClick={isSpeaking ? handleStopSpeaking : () => handleTestVoice()}
                                    disabled={!voiceEnabled}
                                >
                                    {isSpeaking ? (
                                        <>
                                            <Pause className="h-4 w-4 mr-2" />
                                            Stop Speaking
                                        </>
                                    ) : (
                                        <>
                                            <Play className="h-4 w-4 mr-2" />
                                            Test Voice
                                        </>
                                    )}
                                </Button>
                                {isSpeaking && (
                                    <Badge variant="secondary" className="animate-pulse">
                                        Speaking...
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Voice Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Voice Settings
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <Label>Enable Voice</Label>
                            <p className="text-sm text-gray-500">
                                Enable voice input and output capabilities
                            </p>
                        </div>
                        <Switch
                            checked={voiceEnabled}
                            onCheckedChange={setVoiceEnabled}
                        />
                    </div>

                    {voiceEnabled && (
                        <div className="space-y-4 pt-4 border-t">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Language</Label>
                                    <Select value={voiceLanguage} onValueChange={setVoiceLanguage}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {languages.map((lang) => (
                                                <SelectItem key={lang.code} value={lang.code}>
                                                    <div className="flex items-center gap-2">
                                                        <Globe className="h-3 w-3" />
                                                        {lang.name}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Voice Speed: {voiceSpeed}x</Label>
                                    <Slider
                                        value={[voiceSpeed]}
                                        onValueChange={(value) => setVoiceSpeed(value[0])}
                                        max={2}
                                        min={0.5}
                                        step={0.1}
                                        className="w-full"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>Slow</span>
                                        <span>Fast</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Volume: {Math.round(voiceVolume * 100)}%</Label>
                                <Slider
                                    value={[voiceVolume]}
                                    onValueChange={(value) => setVoiceVolume(value[0])}
                                    max={1}
                                    min={0}
                                    step={0.1}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>Quiet</span>
                                    <span>Loud</span>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Voice Status */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Monitor className="h-4 w-4" />
                        Voice Status
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${isSupported ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className="text-sm">Browser Support</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${voiceEnabled ? 'bg-green-500' : 'bg-gray-300'}`} />
                            <span className="text-sm">Voice Enabled</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-green-500' : 'bg-gray-300'}`} />
                            <span className="text-sm">Listening</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-green-500' : 'bg-gray-300'}`} />
                            <span className="text-sm">Speaking</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}; 