import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, PhoneCall, PhoneOff, Mic, MicOff, Volume2, VolumeX, Clock, User, Calendar, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Call {
    id: string;
    patientName: string;
    phoneNumber: string;
    status: 'incoming' | 'outgoing' | 'active' | 'ended' | 'missed';
    duration: number;
    timestamp: string;
    notes?: string;
}

interface CallSettings {
    autoAnswer: boolean;
    callRecording: boolean;
    voicemailEnabled: boolean;
    businessHours: {
        start: string;
        end: string;
    };
}

export const VoiceCallManager: React.FC = () => {
    const [isInCall, setIsInCall] = useState(false);
    const [currentCall, setCurrentCall] = useState<Call | null>(null);
    const [callHistory, setCallHistory] = useState<Call[]>([]);
    const [settings, setSettings] = useState<CallSettings>({
        autoAnswer: false,
        callRecording: true,
        voicemailEnabled: true,
        businessHours: {
            start: '09:00',
            end: '17:00'
        }
    });
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isMuted, setIsMuted] = useState(false);
    const [isSpeakerOn, setIsSpeakerOn] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const { toast } = useToast();

    useEffect(() => {
        loadCallHistory();
        loadSettings();
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isInCall && currentCall) {
            interval = setInterval(() => {
                setCallDuration(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isInCall, currentCall]);

    const loadCallHistory = async () => {
        try {
            const { data, error } = await supabase
                .from('call_history')
                .select('*')
                .order('timestamp', { ascending: false })
                .limit(50);

            if (error) throw error;
            setCallHistory(data || []);
        } catch (error) {
            console.error('Error loading call history:', error);
        }
    };

    const loadSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('call_settings')
                .select('*')
                .single();

            if (data && !error) {
                setSettings(data);
            }
        } catch (error) {
            console.error('Error loading call settings:', error);
        }
    };

    const handleMakeCall = async () => {
        if (!phoneNumber.trim()) {
            toast({
                title: "Phone number required",
                description: "Please enter a phone number to call",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);
        try {
            // Simulate call initiation
            const newCall: Call = {
                id: Date.now().toString(),
                patientName: 'Unknown',
                phoneNumber,
                status: 'outgoing',
                duration: 0,
                timestamp: new Date().toISOString()
            };

            setCurrentCall(newCall);
            setIsInCall(true);
            setCallDuration(0);

            toast({
                title: "Call initiated",
                description: `Calling ${phoneNumber}...`,
            });

            // Simulate call connection
            setTimeout(() => {
                if (currentCall) {
                    setCurrentCall(prev => prev ? { ...prev, status: 'active' } : null);
                }
            }, 2000);

        } catch (error) {
            toast({
                title: "Call failed",
                description: "Unable to initiate call. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleEndCall = () => {
        if (currentCall) {
            const endedCall = {
                ...currentCall,
                status: 'ended' as const,
                duration: callDuration
            };

            setCallHistory(prev => [endedCall, ...prev]);
            setCurrentCall(null);
            setIsInCall(false);
            setCallDuration(0);
            setPhoneNumber('');

            toast({
                title: "Call ended",
                description: `Call duration: ${formatDuration(callDuration)}`,
            });
        }
    };

    const handleToggleMute = () => {
        setIsMuted(!isMuted);
        toast({
            title: isMuted ? "Microphone enabled" : "Microphone muted",
            description: isMuted ? "Your voice is now audible" : "Your voice is now muted",
        });
    };

    const handleToggleSpeaker = () => {
        setIsSpeakerOn(!isSpeakerOn);
        toast({
            title: isSpeakerOn ? "Speaker disabled" : "Speaker enabled",
            description: isSpeakerOn ? "Using earpiece" : "Using speaker",
        });
    };

    const formatDuration = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const formatTimestamp = (timestamp: string): string => {
        return new Date(timestamp).toLocaleString();
    };

    const getCallStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'ended': return 'bg-gray-100 text-gray-800';
            case 'missed': return 'bg-red-100 text-red-800';
            case 'incoming': return 'bg-blue-100 text-blue-800';
            case 'outgoing': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            {/* Current Call */}
            {isInCall && currentCall && (
                <Card className="border-green-200 bg-green-50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-800">
                            <PhoneCall className="w-5 h-5" />
                            Active Call
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center space-y-4">
                            <div className="text-2xl font-bold">{currentCall.patientName || currentCall.phoneNumber}</div>
                            <div className="text-lg text-gray-600">{formatDuration(callDuration)}</div>

                            <div className="flex justify-center gap-4">
                                <Button
                                    variant={isMuted ? "destructive" : "outline"}
                                    size="lg"
                                    onClick={handleToggleMute}
                                >
                                    {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                                </Button>

                                <Button
                                    variant={isSpeakerOn ? "default" : "outline"}
                                    size="lg"
                                    onClick={handleToggleSpeaker}
                                >
                                    {isSpeakerOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                                </Button>

                                <Button
                                    variant="destructive"
                                    size="lg"
                                    onClick={handleEndCall}
                                >
                                    <PhoneOff className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Make Call */}
            {!isInCall && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Phone className="w-5 h-5" />
                            Make Call
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="phoneNumber">Phone Number</Label>
                                <Input
                                    id="phoneNumber"
                                    type="tel"
                                    placeholder="+1 (555) 123-4567"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                            </div>

                            <Button
                                onClick={handleMakeCall}
                                disabled={isLoading || !phoneNumber.trim()}
                                className="w-full"
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Connecting...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        Make Call
                                    </div>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Call History */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Call History
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {callHistory.map((call) => (
                            <div key={call.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="flex flex-col">
                                        <div className="font-medium">{call.patientName || call.phoneNumber}</div>
                                        <div className="text-sm text-gray-600">{formatTimestamp(call.timestamp)}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge className={getCallStatusColor(call.status)}>
                                        {call.status}
                                    </Badge>
                                    {call.duration > 0 && (
                                        <span className="text-sm text-gray-500">
                                            {formatDuration(call.duration)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}

                        {callHistory.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                No call history available
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Call Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        Call Settings
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium">Auto Answer</div>
                                <div className="text-sm text-gray-600">Automatically answer incoming calls</div>
                            </div>
                            <Button
                                variant={settings.autoAnswer ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSettings(prev => ({ ...prev, autoAnswer: !prev.autoAnswer }))}
                            >
                                {settings.autoAnswer ? "Enabled" : "Disabled"}
                            </Button>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium">Call Recording</div>
                                <div className="text-sm text-gray-600">Record calls for quality assurance</div>
                            </div>
                            <Button
                                variant={settings.callRecording ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSettings(prev => ({ ...prev, callRecording: !prev.callRecording }))}
                            >
                                {settings.callRecording ? "Enabled" : "Disabled"}
                            </Button>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium">Voicemail</div>
                                <div className="text-sm text-gray-600">Enable voicemail for missed calls</div>
                            </div>
                            <Button
                                variant={settings.voicemailEnabled ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSettings(prev => ({ ...prev, voicemailEnabled: !prev.voicemailEnabled }))}
                            >
                                {settings.voicemailEnabled ? "Enabled" : "Disabled"}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}; 