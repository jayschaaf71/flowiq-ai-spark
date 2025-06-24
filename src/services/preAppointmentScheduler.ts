
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
        
        // Check if we already have a pending notification for this appointment
        const { data: existingNotification } = await supabase
          .from('notification_queue')
          .select('id')
          .eq('appointment_id', appointment.id)
          .eq('type', 'pre_appointment_summary')
          .eq('status', 'pending')
          .single();

        if (existingNotification) {
          console.log(`Summary already scheduled for appointment ${appointment.id}`);
          continue;
        }

        // Create notification queue entry
        const { error: insertError } = await supabase
          .from('notification_queue')
          .insert({
            appointment_id: appointment.id,
            type: 'pre_appointment_summary',
            scheduled_for: summaryTime.toISOString(),
            status: 'pending',
            channel: 'email',
            recipient: '', // Will be filled by processor
            message: `Pre-appointment summary for ${appointment.title} - ${appointment.appointment_type}`
          });

        if (insertError) {
          console.error(`Error scheduling summary for appointment ${appointment.id}:`, insertError);
        } else {
          scheduledCount++;
          console.log(`Scheduled summary for appointment ${appointment.id} at ${format(summaryTime, 'HH:mm')}`);
        }
      } catch (error) {
        console.error(`Error processing appointment ${appointment.id}:`, error);
      }
    }

    console.log(`Successfully scheduled ${scheduledCount} pre-appointment summaries`);
  }

  async processQueuedSummaries(): Promise<void> {
    console.log('Processing queued pre-appointment summaries');
    
    const now = new Date();
    
    // Get summaries that are due to be sent
    const { data: queuedSummaries, error } = await supabase
      .from('notification_queue')
      .select('*')
      .eq('type', 'pre_appointment_summary')
      .eq('status', 'pending')
      .lte('scheduled_for', now.toISOString())
      .order('scheduled_for', { ascending: true });

    if (error) {
      console.error('Error fetching queued summaries:', error);
      return;
    }

    if (!queuedSummaries || queuedSummaries.length === 0) {
      console.log('No summaries due for processing');
      return;
    }

    for (const summary of queuedSummaries) {
      try {
        // Get appointment details
        const { data: appointment } = await supabase
          .from('appointments')
          .select('*, provider_id')
          .eq('id', summary.appointment_id)
          .single();

        if (!appointment || !appointment.provider_id) {
          console.log(`Skipping summary for appointment ${summary.appointment_id} - no provider assigned`);
          await this.markSummaryAsFailed(summary.id, 'No provider assigned');
          continue;
        }

        // Send the summary
        const success = await preAppointmentSummaryService.sendPreAppointmentSummary(
          summary.appointment_id,
          appointment.provider_id
        );

        if (success) {
          await this.markSummaryAsSent(summary.id);
          console.log(`Successfully sent summary for appointment ${summary.appointment_id}`);
        } else {
          await this.markSummaryAsFailed(summary.id, 'Failed to send summary');
          console.log(`Failed to send summary for appointment ${summary.appointment_id}`);
        }
      } catch (error) {
        console.error(`Error processing summary ${summary.id}:`, error);
        await this.markSummaryAsFailed(summary.id, error.message);
      }
    }
  }

  private async markSummaryAsSent(notificationId: string): Promise<void> {
    await supabase
      .from('notification_queue')
      .update({ 
        status: 'sent', 
        sent_at: new Date().toISOString() 
      })
      .eq('id', notificationId);
  }

  private async markSummaryAsFailed(notificationId: string, errorMessage: string): Promise<void> {
    await supabase
      .from('notification_queue')
      .update({ 
        status: 'failed',
        retry_count: supabase.rpc('notification_queue.retry_count', { notification_id: notificationId }) + 1
      })
      .eq('id', notificationId);
  }

  async getScheduledSummaries(): Promise<any[]> {
    const { data, error } = await supabase
      .from('notification_queue')
      .select(`
        *,
        appointments (
          title,
          appointment_type,
          date,
          time
        )
      `)
      .eq('type', 'pre_appointment_summary')
      .order('scheduled_for', { ascending: true });

    if (error) {
      console.error('Error fetching scheduled summaries:', error);
      return [];
    }

    return data || [];
  }
}

export const preAppointmentScheduler = new PreAppointmentScheduler();
