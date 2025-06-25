
import { supabase } from '@/integrations/supabase/client';
import { PlaudRecording, PlaudConfig } from '@/types/plaud';

export const processNewRecording = async (recording: any, config: PlaudConfig): Promise<PlaudRecording> => {
  try {
    // Download audio file from Plaud
    const audioResponse = await fetch(recording.downloadUrl, {
      headers: { 'Authorization': `Bearer ${config.apiKey}` }
    });

    if (!audioResponse.ok) throw new Error('Failed to download recording');

    const audioBlob = await audioResponse.blob();
    
    // Convert to base64 for our transcription service
    const reader = new FileReader();
    const base64Promise = new Promise<string>((resolve) => {
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
    });
    reader.readAsDataURL(audioBlob);
    const base64Audio = await base64Promise;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Send to our AI transcription service
    const { data, error } = await supabase.functions.invoke('ai-voice-transcription', {
      body: {
        audio: base64Audio,
        userId: user.id,
        source: 'plaud',
        recordingId: recording.id
      }
    });

    if (error) throw error;

    // Store in voice_recordings table
    const { error: dbError } = await supabase
      .from('voice_recordings')
      .insert({
        user_id: user.id,
        source: 'plaud',
        external_id: recording.id,
        filename: recording.filename,
        duration: recording.duration,
        transcription: data.transcription,
        processed_at: new Date().toISOString(),
        metadata: {
          originalUrl: recording.downloadUrl,
          plaudRecordingId: recording.id
        }
      });

    if (dbError) throw dbError;

    return {
      id: recording.id,
      filename: recording.filename,
      duration: recording.duration,
      timestamp: recording.timestamp,
      processed: true,
      transcription: data.transcription
    };
  } catch (error) {
    console.error('Failed to process recording:', error);
    
    // Return as unprocessed recording
    return {
      id: recording.id,
      filename: recording.filename,
      duration: recording.duration,
      timestamp: recording.timestamp,
      processed: false
    };
  }
};

export const uploadRecording = async (file: File): Promise<PlaudRecording> => {
  // Convert file to base64
  const reader = new FileReader();
  const base64Promise = new Promise<string>((resolve) => {
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
  });
  reader.readAsDataURL(file);
  const base64Audio = await base64Promise;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Send to AI transcription service
  const { data, error } = await supabase.functions.invoke('ai-voice-transcription', {
    body: {
      audio: base64Audio,
      userId: user.id,
      source: 'manual_upload'
    }
  });

  if (error) throw error;

  // Store in voice_recordings table
  const { error: dbError } = await supabase
    .from('voice_recordings')
    .insert({
      user_id: user.id,
      source: 'manual_upload',
      filename: file.name,
      duration: 0,
      transcription: data.transcription,
      processed_at: new Date().toISOString()
    });

  if (dbError) throw dbError;

  return {
    id: `upload_${Date.now()}`,
    filename: file.name,
    duration: 0,
    timestamp: new Date().toISOString(),
    processed: true,
    transcription: data.transcription
  };
};

export const loadRecordings = async (): Promise<PlaudRecording[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('voice_recordings')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(record => ({
      id: record.external_id || record.id,
      filename: record.filename,
      duration: record.duration || 0,
      timestamp: record.created_at,
      processed: !!record.transcription,
      transcription: record.transcription || undefined
    }));
  } catch (error) {
    console.error('Failed to load recordings:', error);
    return [];
  }
};
