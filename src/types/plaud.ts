
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
  apiKey: string;
  webhookUrl: string;
  autoSync: boolean;
}
