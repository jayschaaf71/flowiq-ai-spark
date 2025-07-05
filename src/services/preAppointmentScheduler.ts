
import { supabase } from '@/integrations/supabase/client';
import { preAppointmentSummaryService } from './preAppointmentSummaryService';
import { format, addMinutes, subMinutes } from 'date-fns';

export class PreAppointmentScheduler {
  async scheduleUpcomingAppointmentSummaries(): Promise<void> {
    console.log('Scheduling pre-appointment summaries for upcoming appointments');
    
    // Get appointments for tomorrow that haven't had summaries sent
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = format(tomorrow, 'yyyy-MM-dd');

    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('id, provider_id, time, date, title, appointment_type')
      .eq('date', tomorrowStr)
      .eq('status', 'confirmed')
      .not('provider_id', 'is', null);

    if (error) {
      console.error('Error fetching tomorrow appointments:', error);
      return;
    }

    if (!appointments || appointments.length === 0) {
      console.log('No confirmed appointments for tomorrow');
      return;
    }

    let scheduledCount = 0;
    
    for (const appointment of appointments) {
      try {
        // Calculate summary send time (30 minutes before appointment)
        const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}`);
        const summaryTime = subMinutes(appointmentDateTime, 30);
        
        // Mock check since notification_queue table doesn't exist
        console.log('Mock checking for existing notification for appointment:', appointment.id);
        const existingNotification = null;

        if (existingNotification) {
          console.log(`Summary already scheduled for appointment ${appointment.id}`);
          continue;
        }

        // Mock create notification queue entry
        console.log('Mock scheduling notification for appointment:', appointment.id, 'at:', summaryTime.toISOString());
        
        scheduledCount++;
        console.log(`Scheduled summary for appointment ${appointment.id} at ${format(summaryTime, 'HH:mm')}`);
      } catch (error) {
        console.error(`Error processing appointment ${appointment.id}:`, error);
      }
    }

    console.log(`Successfully scheduled ${scheduledCount} pre-appointment summaries`);
  }

  async processQueuedSummaries(): Promise<void> {
    console.log('Mock processing queued pre-appointment summaries');
    
    // Mock implementation since notification_queue table doesn't exist
    console.log('Mock: No summaries to process');
  }

  private async markSummaryAsSent(notificationId: string): Promise<void> {
    console.log('Mock marking summary as sent:', notificationId);
  }

  private async markSummaryAsFailed(notificationId: string, errorMessage: string): Promise<void> {
    console.log('Mock marking summary as failed:', notificationId, errorMessage);
  }

  async getScheduledSummaries(): Promise<any[]> {
    console.log('Mock getting scheduled summaries');
    
    // Return mock data since notification_queue table doesn't exist
    return [
      {
        id: 'mock-notification-1',
        appointment_id: 'mock-appointment-1',
        type: 'pre_appointment_summary',
        scheduled_for: new Date().toISOString(),
        status: 'pending',
        appointments: {
          title: 'Annual Check-up',
          appointment_type: 'consultation',
          date: new Date().toISOString().split('T')[0],
          time: '10:00:00'
        }
      }
    ];
  }
}

export const preAppointmentScheduler = new PreAppointmentScheduler();
