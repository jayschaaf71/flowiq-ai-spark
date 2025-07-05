import { supabase } from "@/integrations/supabase/client";
import { format, isToday, startOfDay, endOfDay } from "date-fns";

export interface DailySummaryData {
  provider: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    specialty: string;
  };
  appointments: Array<{
    id: string;
    time: string;
    patient_name: string;
    appointment_type: string;
    status: string;
    duration: number;
    notes?: string;
  }>;
  totalAppointments: number;
  workingHours: {
    start: string;
    end: string;
  };
  notifications: Array<{
    type: string;
    message: string;
    priority: 'low' | 'medium' | 'high';
  }>;
}

export class DailyProviderSummaryService {
  async generateDailySummary(providerId: string, date: Date = new Date()): Promise<DailySummaryData | null> {
    console.log('Generating daily summary for provider:', providerId, 'date:', format(date, 'yyyy-MM-dd'));

    // Get provider information
    const { data: provider, error: providerError } = await supabase
      .from('providers')
      .select('*')
      .eq('id', providerId)
      .eq('is_active', true)
      .single();

    if (providerError || !provider) {
      console.error('Error fetching provider:', providerError);
      return null;
    }

    // Get today's appointments for the provider
    const dateStr = format(date, 'yyyy-MM-dd');
    const { data: appointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select(`
        id,
        time,
        duration,
        appointment_type,
        status,
        notes,
        patient_id,
        patients (
          first_name,
          last_name
        )
      `)
      .eq('provider_id', providerId)
      .eq('date', dateStr)
      .order('time', { ascending: true });

    if (appointmentsError) {
      console.error('Error fetching appointments:', appointmentsError);
    }

    // Format appointments data
    const formattedAppointments = (appointments || []).map(apt => ({
      id: apt.id,
      time: apt.time,
      patient_name: apt.patients && Array.isArray(apt.patients) && apt.patients.length > 0 
        ? `${apt.patients[0].first_name} ${apt.patients[0].last_name}` 
        : 'Unknown Patient',
      appointment_type: apt.appointment_type,
      status: apt.status,
      duration: apt.duration,
      notes: apt.notes
    }));

    // Generate notifications based on appointments and status
    const notifications = this.generateNotifications(formattedAppointments, provider);

    // Get working hours (mock since field doesn't exist)
    const workingHours = { start: '09:00', end: '17:00' };

    return {
      provider: {
        id: provider.id,
        first_name: provider.first_name,
        last_name: provider.last_name,
        email: provider.email,
        phone: provider.phone,
        specialty: provider.specialty
      },
      appointments: formattedAppointments,
      totalAppointments: formattedAppointments.length,
      workingHours,
      notifications
    };
  }

  private generateNotifications(appointments: any[], provider: any): Array<{type: string, message: string, priority: 'low' | 'medium' | 'high'}> {
    const notifications = [];

    // Check for back-to-back appointments
    for (let i = 0; i < appointments.length - 1; i++) {
      const current = appointments[i];
      const next = appointments[i + 1];
      
      const currentEnd = this.addMinutesToTime(current.time, current.duration);
      if (currentEnd === next.time) {
        notifications.push({
          type: 'scheduling',
          message: `Back-to-back appointments: ${current.time} and ${next.time}`,
          priority: 'medium' as const
        });
      }
    }

    // Check for pending appointments
    const pendingAppointments = appointments.filter(apt => apt.status === 'pending');
    if (pendingAppointments.length > 0) {
      notifications.push({
        type: 'status',
        message: `${pendingAppointments.length} pending appointment(s) need confirmation`,
        priority: 'high' as const
      });
    }

    // Check for heavy schedule
    if (appointments.length > 8) {
      notifications.push({
        type: 'workload',
        message: `Heavy schedule today: ${appointments.length} appointments`,
        priority: 'medium' as const
      });
    }

    // Add specialty-specific reminders
    if (provider.specialty === 'Dental Sleep Medicine') {
      notifications.push({
        type: 'specialty',
        message: 'Remember to review sleep study results before consultations',
        priority: 'low' as const
      });
    }

    return notifications;
  }

  private addMinutesToTime(time: string, minutes: number): string {
    const [hours, mins] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60);
    const newMins = totalMinutes % 60;
    return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`;
  }

  async sendDailySummary(providerId: string, date: Date = new Date()): Promise<boolean> {
    try {
      const summaryData = await this.generateDailySummary(providerId, date);
      
      if (!summaryData) {
        console.log('No summary data generated for provider:', providerId);
        return false;
      }

      // Send email summary
      await this.sendEmailSummary(summaryData, date);
      
      // Send SMS summary if phone number available
      if (summaryData.provider.phone) {
        await this.sendSMSSummary(summaryData, date);
      }

      console.log('Daily summary sent successfully to provider:', providerId);
      return true;
    } catch (error) {
      console.error('Error sending daily summary:', error);
      return false;
    }
  }

  private async sendEmailSummary(summaryData: DailySummaryData, date: Date): Promise<void> {
    const { error } = await supabase.functions.invoke('send-communication', {
      body: {
        submissionId: `daily-summary-${summaryData.provider.id}-${format(date, 'yyyy-MM-dd')}`,
        templateId: 'daily-provider-summary',
        recipient: summaryData.provider.email,
        patientName: `Dr. ${summaryData.provider.first_name} ${summaryData.provider.last_name}`,
        type: 'email',
        customMessage: this.generateEmailContent(summaryData, date)
      }
    });

    if (error) {
      console.error('Error sending email summary:', error);
      throw error;
    }
  }

  private async sendSMSSummary(summaryData: DailySummaryData, date: Date): Promise<void> {
    const { error } = await supabase.functions.invoke('send-communication', {
      body: {
        submissionId: `daily-summary-sms-${summaryData.provider.id}-${format(date, 'yyyy-MM-dd')}`,
        templateId: 'daily-provider-summary-sms',
        recipient: summaryData.provider.phone!,
        patientName: `Dr. ${summaryData.provider.first_name} ${summaryData.provider.last_name}`,
        type: 'sms',
        customMessage: this.generateSMSContent(summaryData, date)
      }
    });

    if (error) {
      console.error('Error sending SMS summary:', error);
      throw error;
    }
  }

  private generateEmailContent(summaryData: DailySummaryData, date: Date): string {
    const dateStr = format(date, 'EEEE, MMMM d, yyyy');
    
    let content = `
      <h2>Good Morning, Dr. ${summaryData.provider.last_name}!</h2>
      <p>Here's your schedule summary for <strong>${dateStr}</strong>:</p>
      
      <h3>📅 Today's Appointments (${summaryData.totalAppointments})</h3>
    `;

    if (summaryData.appointments.length === 0) {
      content += '<p>No appointments scheduled for today. Enjoy your day!</p>';
    } else {
      content += '<ul>';
      summaryData.appointments.forEach(apt => {
        content += `
          <li>
            <strong>${apt.time}</strong> - ${apt.patient_name} 
            <br><em>${apt.appointment_type}</em> (${apt.duration} min)
            <br>Status: <span style="color: ${apt.status === 'confirmed' ? 'green' : 'orange'}">${apt.status}</span>
            ${apt.notes ? `<br>Notes: ${apt.notes}` : ''}
          </li><br>
        `;
      });
      content += '</ul>';
    }

    if (summaryData.notifications.length > 0) {
      content += '<h3>🔔 Important Notifications</h3><ul>';
      summaryData.notifications.forEach(notif => {
        const color = notif.priority === 'high' ? 'red' : notif.priority === 'medium' ? 'orange' : 'blue';
        content += `<li style="color: ${color}"><strong>[${notif.priority.toUpperCase()}]</strong> ${notif.message}</li>`;
      });
      content += '</ul>';
    }

    content += `
      <h3>⏰ Working Hours</h3>
      <p>${summaryData.workingHours.start} - ${summaryData.workingHours.end}</p>
      
      <p>Have a great day!</p>
      <p><em>This is an automated message from your practice management system.</em></p>
    `;

    return content;
  }

  private generateSMSContent(summaryData: DailySummaryData, date: Date): string {
    const dateStr = format(date, 'MMM d');
    let content = `Good morning Dr. ${summaryData.provider.last_name}! ${dateStr} Summary:\n\n`;
    
    content += `📅 ${summaryData.totalAppointments} appointments today\n`;
    
    if (summaryData.appointments.length > 0) {
      const nextAppointment = summaryData.appointments[0];
      content += `⏰ First: ${nextAppointment.time} - ${nextAppointment.patient_name}\n`;
      
      if (summaryData.appointments.length > 1) {
        const lastAppointment = summaryData.appointments[summaryData.appointments.length - 1];
        content += `⏰ Last: ${lastAppointment.time} - ${lastAppointment.patient_name}\n`;
      }
    }

    // Add high priority notifications only for SMS
    const highPriorityNotifs = summaryData.notifications.filter(n => n.priority === 'high');
    if (highPriorityNotifs.length > 0) {
      content += `\n🚨 Alerts:\n`;
      highPriorityNotifs.forEach(notif => {
        content += `• ${notif.message}\n`;
      });
    }

    content += `\nHave a great day!`;
    
    return content;
  }

  async sendAllProviderSummaries(date: Date = new Date()): Promise<void> {
    console.log('Sending daily summaries to all active providers for:', format(date, 'yyyy-MM-dd'));
    
    // Get all active providers
    const { data: providers, error } = await supabase
      .from('providers')
      .select('id, first_name, last_name, email')
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching providers:', error);
      return;
    }

    const results = await Promise.allSettled(
      (providers || []).map(provider => this.sendDailySummary(provider.id, date))
    );

    const successful = results.filter(r => r.status === 'fulfilled' && r.value).length;
    const failed = results.length - successful;

    console.log(`Daily summaries sent: ${successful} successful, ${failed} failed`);
  }
}

export const dailyProviderSummaryService = new DailyProviderSummaryService();
