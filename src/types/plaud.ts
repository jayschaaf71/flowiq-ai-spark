
export interface PlaudRecording {
  id: string;
  filename: string;
  duration: number;
  timestamp: string;
  processed: boolean;
  transcription?: string;
  patientId?: string;
}

export interface PlaudConfig {
  apiKey: string; // Not used for webhook integration but kept for compatibility
  webhookUrl: string;
  autoSync: boolean;
}
