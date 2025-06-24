
import { useState, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useVoiceRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
        
        // Process the audio
        await processAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      toast({
        title: "Recording Started",
        description: "AI is now listening and transcribing in real-time",
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
    }
  }, [isRecording]);

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      // Simulate transcription processing
      // In a real implementation, this would send to a speech-to-text service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock transcription result
      const mockTranscription = `Patient presents with chief complaint of tooth pain in the upper right quadrant. Pain started 3 days ago, described as sharp and throbbing, worsening with cold foods. Patient reports difficulty sleeping due to pain. No fever or facial swelling noted. Medical history significant for hypertension, currently taking lisinopril. No known drug allergies. On examination, tooth #3 shows large carious lesion on mesial surface. Percussion test positive. Radiographic examination reveals periapical radiolucency consistent with abscess. Diagnosis: Acute apical abscess tooth #3. Treatment plan: Emergency endodontic therapy, antibiotic therapy with amoxicillin 500mg TID for 7 days, ibuprofen for pain management.`;
      
      setTranscription(mockTranscription);
      
      toast({
        title: "Transcription Complete",
        description: "Audio has been processed and transcribed successfully",
      });
    } catch (error) {
      console.error('Error processing audio:', error);
      toast({
        title: "Processing Error",
        description: "Failed to process audio recording",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const clearRecording = useCallback(() => {
    setTranscription('');
    setAudioBlob(null);
    chunksRef.current = [];
  }, []);

  return {
    isRecording,
    isProcessing,
    transcription,
    audioBlob,
    startRecording,
    stopRecording,
    clearRecording,
    setTranscription
  };
};
