import { supabase } from '@/integrations/supabase/client';
import { PlaudRecording, PlaudConfig } from '@/types/plaud';

export const processNewRecording = async (recording: any, config: PlaudConfig): Promise<PlaudRecording> => {
  try {
    // Real Plaud API structure
    const { 
      id, 
      filename, 
      duration, 
      created_at, 
      download_url,
      file_size,
      device_id 
    } = recording;

    // Download audio file from Plaud Cloud
    const audioResponse = await fetch(download_url, {
      headers: { 
        'Authorization': `Bearer ${config.apiKey}`,
        'X-API-Version': '2024-01'
      }
    });

    if (!audioResponse.ok) throw new Error('Failed to download recording from Plaud Cloud');

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
        recordingId: id,
        metadata: {
          device_id,
          file_size,
          original_filename: filename
        }
      }
    });

    if (error) throw error;

    // Mock store in voice_recordings table
    console.log('Mock storing voice recording:', {
      user_id: user.id,
      source: 'plaud',
      external_id: id,
      filename: filename,
      duration: duration,
      transcription: data.transcription
    });
        metadata: {
          originalUrl: download_url,
          plaudRecordingId: id,
          deviceId: device_id,
          fileSize: file_size
        }
      });

    if (dbError) throw dbError;

    // Mark as processed in Plaud Cloud (if their API supports it)
    await markRecordingAsProcessed(id, config.apiKey);

    return {
      id: id,
      filename: filename,
      duration: duration,
      timestamp: created_at,
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
      timestamp: recording.created_at || recording.timestamp,
      processed: false
    };
  }
};

const markRecordingAsProcessed = async (recordingId: string, apiKey: string) => {
  try {
    await fetch(`https://api.plaud.ai/v1/recordings/${recordingId}/metadata`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'X-API-Version': '2024-01'
      },
      body: JSON.stringify({
        processed_by_flowiq: true,
        processed_at: new Date().toISOString()
      })
    });
  } catch (error) {
    console.log('Could not mark recording as processed:', error);
    // This is optional, so we don't throw
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
