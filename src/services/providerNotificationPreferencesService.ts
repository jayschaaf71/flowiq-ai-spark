import { supabase } from '@/integrations/supabase/client';

export interface ProviderNotificationPreference {
  id: string;
  provider_id: string;
  notification_type: string;
  email_enabled: boolean;
  in_app_enabled: boolean;
  sms_enabled: boolean;
  push_enabled: boolean;
  timing_minutes?: number;
  days_of_week: number[];
  quiet_hours_start: string;
  quiet_hours_end: string;
  created_at: string;
  updated_at: string;
  tenant_id?: string;
}

export interface NotificationTypeConfig {
  type: string;
  label: string;
  description: string;
  icon: string;
  category: 'appointment' | 'patient' | 'clinical' | 'system';
  supports_timing: boolean;
  default_timing?: number;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
}

export const NOTIFICATION_TYPES: NotificationTypeConfig[] = [
  // Appointment-related notifications
  {
    type: 'upcoming_appointment',
    label: 'Upcoming Appointments',
    description: 'Notifications before scheduled appointments',
    icon: 'Calendar',
    category: 'appointment',
    supports_timing: true,
    default_timing: 30,
    urgency: 'medium'
  },
  {
    type: 'appointment_cancelled',
    label: 'Appointment Cancellations',
    description: 'When patients cancel appointments',
    icon: 'CalendarX',
    category: 'appointment',
    supports_timing: false,
    urgency: 'high'
  },
  {
    type: 'appointment_rescheduled',
    label: 'Appointment Reschedules',
    description: 'When appointments are moved to different times',
    icon: 'CalendarClock',
    category: 'appointment',
    supports_timing: false,
    urgency: 'medium'
  },
  {
    type: 'no_show',
    label: 'No Shows',
    description: 'When patients miss appointments without notice',
    icon: 'UserX',
    category: 'appointment',
    supports_timing: false,
    urgency: 'high'
  },
  {
    type: 'schedule_conflict',
    label: 'Schedule Conflicts',
    description: 'Double bookings or scheduling issues',
    icon: 'AlertTriangle',
    category: 'appointment',
    supports_timing: false,
    urgency: 'urgent'
  },

  // Patient-related notifications
  {
    type: 'intake_completed',
    label: 'Intake Forms Completed',
    description: 'When patients complete intake forms',
    icon: 'FileCheck',
    category: 'patient',
    supports_timing: false,
    urgency: 'medium'
  },
  {
    type: 'urgent_message',
    label: 'Urgent Patient Messages',
    description: 'High priority messages from patients',
    icon: 'MessageCircleWarning',
    category: 'patient',
    supports_timing: false,
    urgency: 'urgent'
  },

  // Clinical notifications
  {
    type: 'lab_results_ready',
    label: 'Lab Results Ready',
    description: 'When lab results are available for review',
    icon: 'TestTube',
    category: 'clinical',
    supports_timing: false,
    urgency: 'high'
  },
  {
    type: 'prescription_ready',
    label: 'Prescription Ready',
    description: 'When prescriptions are ready for pickup',
    icon: 'Pill',
    category: 'clinical',
    supports_timing: false,
    urgency: 'medium'
  },

  // System notifications
  {
    type: 'daily_schedule_summary',
    label: 'Daily Schedule Summary',
    description: 'Summary of the day\'s appointments',
    icon: 'ClipboardList',
    category: 'system',
    supports_timing: true,
    default_timing: 480, // 8 hours before (sent at midnight for 8am start)
    urgency: 'low'
  }
];

export class ProviderNotificationPreferencesService {
  // Get provider's notification preferences
  static async getProviderPreferences(providerId: string): Promise<ProviderNotificationPreference[]> {
    try {
      const { data, error } = await supabase
        .from('provider_notification_preferences')
        .select('*')
        .eq('provider_id', providerId)
        .order('notification_type');

      if (error) {
        console.error('Error fetching provider preferences:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getProviderPreferences:', error);
      return [];
    }
  }

  // Initialize default preferences for a provider
  static async initializeDefaultPreferences(providerId: string): Promise<void> {
    try {
      const preferences = NOTIFICATION_TYPES.map(type => ({
        provider_id: providerId,
        notification_type: type.type,
        email_enabled: true,
        in_app_enabled: true,
        sms_enabled: type.urgency === 'urgent',
        push_enabled: true,
        timing_minutes: type.default_timing || null,
        days_of_week: [1, 2, 3, 4, 5], // Monday to Friday
        quiet_hours_start: '22:00',
        quiet_hours_end: '08:00'
      }));

      const { error } = await supabase
        .from('provider_notification_preferences')
        .upsert(preferences, {
          onConflict: 'provider_id,notification_type'
        });

      if (error) {
        console.error('Error initializing default preferences:', error);
      }
    } catch (error) {
      console.error('Error in initializeDefaultPreferences:', error);
    }
  }

  // Update a specific preference
  static async updatePreference(
    providerId: string,
    notificationType: string,
    updates: Partial<ProviderNotificationPreference>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('provider_notification_preferences')
        .upsert({
          provider_id: providerId,
          notification_type: notificationType,
          ...updates
        }, {
          onConflict: 'provider_id,notification_type'
        });

      if (error) {
        console.error('Error updating preference:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updatePreference:', error);
      return false;
    }
  }

  // Check if a provider should receive a notification based on their preferences
  static async shouldSendNotification(
    providerId: string,
    notificationType: string,
    channel: 'email' | 'sms' | 'push' | 'in_app',
    scheduledTime?: Date
  ): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('provider_notification_preferences')
        .select('*')
        .eq('provider_id', providerId)
        .eq('notification_type', notificationType)
        .single();

      if (error || !data) {
        // If no preference exists, use defaults based on urgency
        const typeConfig = NOTIFICATION_TYPES.find(t => t.type === notificationType);
        if (!typeConfig) return false;
        
        // Default behavior based on channel and urgency
        switch (channel) {
          case 'email': return true;
          case 'in_app': return true;
          case 'push': return true;
          case 'sms': return typeConfig.urgency === 'urgent';
          default: return false;
        }
      }

      // Check channel-specific setting
      let channelEnabled = false;
      switch (channel) {
        case 'email': channelEnabled = data.email_enabled; break;
        case 'sms': channelEnabled = data.sms_enabled; break;
        case 'push': channelEnabled = data.push_enabled; break;
        case 'in_app': channelEnabled = data.in_app_enabled; break;
      }

      if (!channelEnabled) return false;

      // Check quiet hours if scheduledTime is provided
      if (scheduledTime) {
        const timeString = scheduledTime.toTimeString().substring(0, 5);
        const dayOfWeek = scheduledTime.getDay() || 7; // Convert Sunday from 0 to 7
        
        // Check if day is enabled
        if (!data.days_of_week.includes(dayOfWeek)) return false;
        
        // Check quiet hours (skip for urgent notifications)
        const typeConfig = NOTIFICATION_TYPES.find(t => t.type === notificationType);
        if (typeConfig?.urgency !== 'urgent') {
          if (timeString >= data.quiet_hours_start || timeString <= data.quiet_hours_end) {
            return false;
          }
        }
      }

      return true;
    } catch (error) {
      console.error('Error in shouldSendNotification:', error);
      return false;
    }
  }

  // Update quiet hours
  static async updateQuietHours(
    providerId: string,
    startTime: string,
    endTime: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('provider_notification_preferences')
        .update({
          quiet_hours_start: startTime,
          quiet_hours_end: endTime
        })
        .eq('provider_id', providerId);

      if (error) {
        console.error('Error updating quiet hours:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateQuietHours:', error);
      return false;
    }
  }

  // Update days of week
  static async updateDaysOfWeek(
    providerId: string,
    daysOfWeek: number[]
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('provider_notification_preferences')
        .update({
          days_of_week: daysOfWeek
        })
        .eq('provider_id', providerId);

      if (error) {
        console.error('Error updating days of week:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateDaysOfWeek:', error);
      return false;
    }
  }
}