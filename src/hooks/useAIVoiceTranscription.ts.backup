
import { useState, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useAIVoiceTranscription = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [confidenceScore, setConfidenceScore] = useState<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const durationInterval = useRef<NodeJS.Timeout | null>(null);
  const startTime = useRef<number>(0);
  const { toast } = useToast();
  const { user } = useAuth();

  const startRecording = useCallback(async () => {
    try {
      // Request high-quality audio for better transcription
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        }
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 128000
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      startTime.current = Date.now();
      setRecordingDuration(0);

      // Update duration every second
      durationInterval.current = setInterval(() => {
        setRecordingDuration(Math.floor((Date.now() - startTime.current) / 1000));
      }, 1000);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        if (durationInterval.current) {
          clearInterval(durationInterval.current);
        }
        
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
        
        // Process the audio with AI and store securely
        await processAudioWithAI(audioBlob);
      };

      mediaRecorder.start(1000); // Capture data every second for better chunking
      setIsRecording(true);
      
      toast({
        title: "AI Recording Started",
        description: "High-quality recording with real-time processing",
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording Error",
        description: "Unable to access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
        durationInterval.current = null;
      }
      
      toast({
        title: "Recording Stopped",
        description: `Recorded ${recordingDuration} seconds. Processing with AI...`,
      });
    }
  }, [isRecording, recordingDuration, toast]);

  const processAudioWithAI = async (audioBlob: Blob, patientId?: string) => {
    setIsProcessing(true);
    const processingStartTime = Date.now();
    
    try {
      if (!user) {
        throw new Error('User must be authenticated to process recordings');
      }

      // First, securely store the audio file
      const fileName = `${user.id}/${Date.now()}-recording.webm`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('voice-recordings')
        .upload(fileName, audioBlob, {
          contentType: 'audio/webm',
          metadata: {
            userId: user.id,
            duration: recordingDuration,
            timestamp: new Date().toISOString()
          }
        });

      if (uploadError) {
        throw new Error(`Storage error: ${uploadError.message}`);
      }

      // Convert audio to base64 for AI processing
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
      });
      reader.readAsDataURL(audioBlob);
      const base64Audio = await base64Promise;

      // Call our enhanced HIPAA-compliant AI transcription service
      const { data, error } = await supabase.functions.invoke('ai-voice-transcription', {
        body: {
          audio: base64Audio,
          userId: user.id,
          patientId,
          audioPath: uploadData.path,
          metadata: {
            duration: recordingDuration,
            fileSize: audioBlob.size,
            format: 'webm'
          }
        }
      });

      if (error) {
        throw error;
      }

      const processingTime = Date.now() - processingStartTime;
      
      setTranscription(data.transcription);
      setConfidenceScore(data.confidence || null);
      
      // Get user's current tenant for multi-tenant support
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('current_tenant_id')
        .eq('id', user.id)
        .single();

      // Store recording metadata in database
      const { error: dbError } = await supabase
        .from('voice_recordings')
        .insert({
          tenant_id: userProfile?.current_tenant_id || null,
          user_id: user.id,
          patient_id: patientId,
          transcription: data.transcription,
          audio_url: uploadData.path,
          duration_seconds: recordingDuration,
          file_size_bytes: audioBlob.size,
          confidence_score: data.confidence,
          processing_time_ms: processingTime,
          audio_format: 'webm',
          storage_path: uploadData.path,
          background_processed: true,
          status: 'completed',
          metadata: {
            containsPHI: data.containsPHI,
            complianceStatus: data.complianceStatus,
            processedAt: data.processedAt
          }
        });

      if (dbError) {
        console.error('Database storage error:', dbError);
      }
      
      toast({
        title: "AI Transcription Complete",
        description: `Processed ${data.transcription.length} characters in ${Math.round(processingTime / 1000)}s`,
      });

      return {
        transcription: data.transcription,
        confidence: data.confidence,
        processingTime
      };

    } catch (error) {
      console.error('Error processing audio:', error);
      toast({
        title: "AI Processing Error",
        description: error.message || "Failed to process audio recording",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const clearRecording = useCallback(() => {
    setTranscription('');
    setAudioBlob(null);
    setRecordingDuration(0);
    setConfidenceScore(null);
    chunksRef.current = [];
    
    if (durationInterval.current) {
      clearInterval(durationInterval.current);
      durationInterval.current = null;
    }
  }, []);

  return {
    isRecording,
    isProcessing,
    transcription,
    audioBlob,
    recordingDuration,
    confidenceScore,
    startRecording,
    stopRecording,
    processAudioWithAI,
    clearRecording,
    setTranscription
  };
};
