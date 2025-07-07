import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Mic, 
  MicOff, 
  Square, 
  Play, 
  Pause,
  Trash2,
  Check,
  AlertCircle,
  Volume2,
  Loader2
} from 'lucide-react';

interface VoiceRecorderProps {
  onTranscriptionComplete: (transcript: string, confidence: number) => void;
  isDisabled?: boolean;
  placeholder?: string;
  maxDuration?: number; // in seconds
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onTranscriptionComplete,
  isDisabled = false,
  placeholder = "Tap to speak your answer",
  maxDuration = 120
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000
        } 
      });
      
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      
      const audioChunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        setHasRecording(true);
        
        // Clean up stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
      
      // Start duration timer
      durationIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => {
          const newDuration = prev + 1;
          if (newDuration >= maxDuration) {
            // Stop recording directly without calling stopRecording to avoid circular dependency
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
              mediaRecorderRef.current.stop();
              setIsRecording(false);
            }
          }
          return newDuration;
        });
      }, 1000);
      
    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Failed to access microphone. Please check permissions.');
      toast({
        title: "Microphone Error",
        description: "Unable to access microphone. Please check your permissions.",
        variant: "destructive",
      });
    }
  }, [maxDuration, toast]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }
    }
  }, []);

  const playRecording = useCallback(() => {
    if (audioBlob && !isPlaying) {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
      audio.onerror = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
        setError('Failed to play recording');
      };
      
      audio.play().catch(err => {
        console.error('Error playing audio:', err);
        setError('Failed to play recording');
        setIsPlaying(false);
      });
    }
  }, [audioBlob]);

  const pausePlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const deleteRecording = useCallback(() => {
    setAudioBlob(null);
    setHasRecording(false);
    setRecordingDuration(0);
    setError(null);
    
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const processRecording = useCallback(async () => {
    const currentAudioBlob = audioBlob;
    if (!currentAudioBlob) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // Convert blob to base64
      const arrayBuffer = await currentAudioBlob.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      
      console.log('Sending audio for transcription...');
      
      // Send to voice-to-text edge function
      const { data, error } = await supabase.functions.invoke('voice-to-text', {
        body: { audio: base64Audio }
      });
      
      if (error) {
        console.error('Transcription error:', error);
        throw new Error(error.message || 'Failed to transcribe audio');
      }
      
      if (data?.text) {
        console.log('Transcription successful:', data.text);
        onTranscriptionComplete(data.text, data.confidence || 0.9);
        
        toast({
          title: "Transcription Complete",
          description: "Your voice has been converted to text successfully.",
        });
        
        // Clean up - inline the deleteRecording logic to avoid circular dependency
        setAudioBlob(null);
        setHasRecording(false);
        setRecordingDuration(0);
        setError(null);
        
        if (audioRef.current) {
          audioRef.current.pause();
          setIsPlaying(false);
        }
      } else {
        throw new Error('No transcription received');
      }
      
    } catch (err) {
      console.error('Processing error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to process recording';
      setError(errorMessage);
      
      toast({
        title: "Processing Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [onTranscriptionComplete, toast]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isDisabled) {
    return (
      <Card className="opacity-50">
        <CardContent className="p-4 text-center">
          <Mic className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Voice input not available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Volume2 className="h-5 w-5 text-primary" />
              <span className="font-medium">Voice Input</span>
            </div>
            <p className="text-sm text-muted-foreground">{placeholder}</p>
          </div>

          {/* Recording State */}
          {isRecording && (
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <span className="text-red-600 font-medium">Recording...</span>
              </div>
              <Badge variant="outline">
                {formatDuration(recordingDuration)} / {formatDuration(maxDuration)}
              </Badge>
            </div>
          )}

          {/* Error State */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Controls */}
          <div className="flex justify-center gap-3">
            {!isRecording && !hasRecording && (
              <Button
                onClick={startRecording}
                size="lg"
                className="bg-primary hover:bg-primary/90"
              >
                <Mic className="h-5 w-5 mr-2" />
                Start Recording
              </Button>
            )}

            {isRecording && (
              <Button
                onClick={stopRecording}
                size="lg"
                variant="destructive"
              >
                <Square className="h-5 w-5 mr-2" />
                Stop
              </Button>
            )}

            {hasRecording && !isProcessing && (
              <>
                 <Button
                  onClick={() => isPlaying ? pausePlayback() : playRecording()}
                  variant="outline"
                  size="sm"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4 mr-1" />
                  ) : (
                    <Play className="h-4 w-4 mr-1" />
                  )}
                  {isPlaying ? 'Pause' : 'Play'}
                </Button>

                <Button
                  onClick={deleteRecording}
                  variant="outline"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>

                <Button
                  onClick={processRecording}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Use This
                </Button>
              </>
            )}

            {isProcessing && (
              <Button disabled size="lg">
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Processing...
              </Button>
            )}
          </div>

          {/* Recording Info */}
          {hasRecording && !isProcessing && (
            <div className="text-center">
              <Badge variant="secondary">
                Recording ready • {formatDuration(recordingDuration)}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};