
export interface NotificationItem {
  id: string;
  appointment_id: string;
  type: 'confirmation' | 'reminder' | 'cancellation' | 'rescheduled';
  channel: 'email' | 'sms' | 'push';
  recipient: string;
  message: string;
  scheduled_for: string;
  sent_at?: string;
  status: 'pending' | 'sent' | 'failed' | 'cancelled';
  retry_count: number;
  created_at: string;
}

export interface SupabaseNotificationItem {
  id: string;
  appointment_id: string;
  type: string;
  channel: string;
  recipient: string;
  message: string;
  scheduled_for: string;
  sent_at?: string;
  status: string;
  retry_count: number;
  created_at: string;
}
