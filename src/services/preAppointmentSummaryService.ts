import { supabase } from "@/integrations/supabase/client";
import { format, differenceInDays } from "date-fns";

export interface PreAppointmentSummary {
  patient: {
    id: string;
    name: string;
    age: number;
    phone?: string;
    email?: string;
    preferred_language?: string;
  };
  appointment: {
    id: string;
    time: string;
    date: string;
    type: string;
    duration: number;
    objective?: string;
    notes?: string;
  };
  lastVisit?: {
    date: string;
    type: string;
    daysSince: number;
    summary?: string;
  };
  medicalHistory: Array<{
    condition: string;
    status: string;
    notes?: string;
  }>;
  currentMedications: Array<{
    name: string;
    dosage?: string;
    frequency?: string;
  }>;
  allergies: Array<{
    allergen: string;
    reaction?: string;
    severity?: string;
  }>;
  recentNotes: string[];
  flags: Array<{
    type: 'high_priority' | 'follow_up_needed' | 'insurance_issue' | 'special_needs';
    message: string;
  }>;
}

export class PreAppointmentSummaryService {
  async generatePatientSummary(appointmentId: string): Promise<PreAppointmentSummary | null> {
    console.log('Generating pre-appointment summary for appointment:', appointmentId);

    // Get appointment details
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', appointmentId)
      .single();

    if (appointmentError || !appointment) {
      console.error('Error fetching appointment:', appointmentError);
      return null;
    }

    // Get patient details
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('*')
      .eq('id', appointment.patient_id)
      .single();

    if (patientError || !patient) {
      console.error('Error fetching patient:', patientError);
      return null;
    }

    // Calculate patient age
    const age = patient.date_of_birth 
      ? Math.floor(differenceInDays(new Date(), new Date(patient.date_of_birth)) / 365.25)
      : 0;

    // Get last appointment (excluding current one)
    const { data: lastAppointments } = await supabase
      .from('appointments')
      .select('*')
      .eq('patient_id', appointment.patient_id)
      .eq('status', 'completed')
      .neq('id', appointmentId)
      .order('date', { ascending: false })
      .order('time', { ascending: false })
      .limit(1);

    let lastVisit = undefined;
    if (lastAppointments && lastAppointments.length > 0) {
      const lastAppt = lastAppointments[0];
      lastVisit = {
        date: format(new Date(lastAppt.date), 'MMM d, yyyy'),
        type: lastAppt.appointment_type,
        daysSince: differenceInDays(new Date(), new Date(lastAppt.date)),
        summary: lastAppt.notes
      };
    }

    // Get medical history
    const { data: medicalHistory } = await supabase
      .from('medical_history')
      .select('*')
      .eq('patient_id', appointment.patient_id)
      .eq('status', 'active');

    // Get current medications
    const { data: medications } = await supabase
      .from('medications')
      .select('*')
      .eq('patient_id', appointment.patient_id)
      .eq('status', 'active');

    // Get allergies
    const { data: allergies } = await supabase
      .from('allergies')
      .select('*')
      .eq('patient_id', appointment.patient_id);

    // Get recent appointment notes (last 3 appointments)
    const { data: recentAppointments } = await supabase
      .from('appointments')
      .select('notes, date, appointment_type')
      .eq('patient_id', appointment.patient_id)
      .eq('status', 'completed')
      .neq('id', appointmentId)
      .not('notes', 'is', null)
      .order('date', { ascending: false })
      .limit(3);

    const recentNotes = (recentAppointments || [])
      .filter(apt => apt.notes && apt.notes.trim().length > 0)
      .map(apt => `${format(new Date(apt.date), 'MMM d')}: ${apt.notes}`);

    // Generate flags based on patient data
    const flags = this.generatePatientFlags(patient, lastVisit, medicalHistory || [], medications || []);

    return {
      patient: {
        id: patient.id,
        name: `${patient.first_name} ${patient.last_name}`,
        age,
        phone: patient.phone,
        email: patient.email,
        preferred_language: patient.preferred_language
      },
      appointment: {
        id: appointment.id,
        time: appointment.time,
        date: format(new Date(appointment.date), 'EEEE, MMMM d, yyyy'),
        type: appointment.appointment_type,
        duration: appointment.duration,
        objective: this.generateAppointmentObjective(appointment, lastVisit),
        notes: appointment.notes
      },
      lastVisit,
      medicalHistory: (medicalHistory || []).map(mh => ({
        condition: mh.condition_name,
        status: mh.status,
        notes: mh.notes
      })),
      currentMedications: (medications || []).map(med => ({
        name: med.medication_name,
        dosage: med.dosage,
        frequency: med.frequency
      })),
      allergies: (allergies || []).map(allergy => ({
        allergen: allergy.allergen,
        reaction: allergy.reaction,
        severity: allergy.severity
      })),
      recentNotes,
      flags
    };
  }

  private generateAppointmentObjective(appointment: any, lastVisit?: any): string {
    const type = appointment.appointment_type.toLowerCase();
    
    if (type.includes('follow-up') || type.includes('followup')) {
      return lastVisit 
        ? `Follow-up visit to assess progress since ${lastVisit.date}`
        : 'Follow-up visit to assess current status';
    }
    
    if (type.includes('consultation')) {
      return 'Initial consultation and assessment';
    }
    
    if (type.includes('check-up') || type.includes('checkup')) {
      return 'Routine health check-up and screening';
    }
    
    if (type.includes('treatment')) {
      return 'Ongoing treatment session';
    }
    
    return `${appointment.appointment_type} appointment`;
  }

  private generatePatientFlags(patient: any, lastVisit: any, medicalHistory: any[], medications: any[]): Array<{type: 'high_priority' | 'follow_up_needed' | 'insurance_issue' | 'special_needs', message: string}> {
    const flags: Array<{type: 'high_priority' | 'follow_up_needed' | 'insurance_issue' | 'special_needs', message: string}> = [];

    // High-risk conditions
    const highRiskConditions = ['diabetes', 'hypertension', 'heart', 'cancer'];
    const hasHighRiskCondition = medicalHistory.some(mh => 
      highRiskConditions.some(condition => 
        mh.condition_name.toLowerCase().includes(condition)
      )
    );

    if (hasHighRiskCondition) {
      flags.push({
        type: 'high_priority',
        message: 'Patient has high-risk medical conditions requiring careful monitoring'
      });
    }

    // Long time since last visit
    if (lastVisit && lastVisit.daysSince > 365) {
      flags.push({
        type: 'follow_up_needed',
        message: `Last visit was ${lastVisit.daysSince} days ago - may need comprehensive update`
      });
    }

    // Multiple medications
    if (medications.length >= 5) {
      flags.push({
        type: 'high_priority',
        message: `Patient on ${medications.length} medications - review for interactions`
      });
    }

    // Language preference
    if (patient.preferred_language && patient.preferred_language !== 'English') {
      flags.push({
        type: 'special_needs',
        message: `Patient prefers communication in ${patient.preferred_language}`
      });
    }

    return flags;
  }

  async sendPreAppointmentSummary(appointmentId: string, providerId: string): Promise<boolean> {
    try {
      const summaryData = await this.generatePatientSummary(appointmentId);
      
      if (!summaryData) {
        console.log('No summary data generated for appointment:', appointmentId);
        return false;
      }

      // Get provider information
      const { data: provider } = await supabase
        .from('providers')
        .select('first_name, last_name, email, phone')
        .eq('id', providerId)
        .single();

      if (!provider) {
        console.error('Provider not found:', providerId);
        return false;
      }

      // Send email summary
      await this.sendEmailSummary(summaryData, provider);
      
      // Send SMS summary if phone available
      if (provider.phone) {
        await this.sendSMSSummary(summaryData, provider);
      }

      console.log('Pre-appointment summary sent successfully');
      return true;
    } catch (error) {
      console.error('Error sending pre-appointment summary:', error);
      return false;
    }
  }

  private async sendEmailSummary(summaryData: PreAppointmentSummary, provider: any): Promise<void> {
    const { error } = await supabase.functions.invoke('send-communication', {
      body: {
        submissionId: `pre-appt-${summaryData.appointment.id}-${Date.now()}`,
        templateId: 'pre-appointment-summary',
        recipient: provider.email,
        patientName: `Dr. ${provider.first_name} ${provider.last_name}`,
        type: 'email',
        customMessage: this.generateEmailContent(summaryData)
      }
    });

    if (error) {
      console.error('Error sending email summary:', error);
      throw error;
    }
  }

  private async sendSMSSummary(summaryData: PreAppointmentSummary, provider: any): Promise<void> {
    const { error } = await supabase.functions.invoke('send-communication', {
      body: {
        submissionId: `pre-appt-sms-${summaryData.appointment.id}-${Date.now()}`,
        templateId: 'pre-appointment-summary-sms',
        recipient: provider.phone,
        patientName: `Dr. ${provider.first_name} ${provider.last_name}`,
        type: 'sms',
        customMessage: this.generateSMSContent(summaryData)
      }
    });

    if (error) {
      console.error('Error sending SMS summary:', error);
      throw error;
    }
  }

  private generateEmailContent(summaryData: PreAppointmentSummary): string {
    let content = `
      <h2>Pre-Appointment Patient Summary</h2>
      <p><strong>Upcoming Appointment:</strong> ${summaryData.appointment.date} at ${summaryData.appointment.time}</p>
      
      <h3>👤 Patient Information</h3>
      <ul>
        <li><strong>Name:</strong> ${summaryData.patient.name}</li>
        <li><strong>Age:</strong> ${summaryData.patient.age}</li>
        <li><strong>Phone:</strong> ${summaryData.patient.phone || 'Not provided'}</li>
        ${summaryData.patient.preferred_language !== 'English' ? `<li><strong>Language:</strong> ${summaryData.patient.preferred_language}</li>` : ''}
      </ul>

      <h3>📋 Appointment Details</h3>
      <ul>
        <li><strong>Type:</strong> ${summaryData.appointment.type}</li>
        <li><strong>Duration:</strong> ${summaryData.appointment.duration} minutes</li>
        <li><strong>Objective:</strong> ${summaryData.appointment.objective}</li>
      </ul>
    `;

    if (summaryData.lastVisit) {
      content += `
        <h3>🗓️ Last Visit</h3>
        <p><strong>${summaryData.lastVisit.date}</strong> (${summaryData.lastVisit.daysSince} days ago)</p>
        <p><strong>Type:</strong> ${summaryData.lastVisit.type}</p>
        ${summaryData.lastVisit.summary ? `<p><strong>Notes:</strong> ${summaryData.lastVisit.summary}</p>` : ''}
      `;
    }

    if (summaryData.flags.length > 0) {
      content += '<h3>🚨 Important Flags</h3><ul>';
      summaryData.flags.forEach(flag => {
        content += `<li><strong>${flag.type.replace('_', ' ').toUpperCase()}:</strong> ${flag.message}</li>`;
      });
      content += '</ul>';
    }

    if (summaryData.medicalHistory.length > 0) {
      content += '<h3>🏥 Active Medical Conditions</h3><ul>';
      summaryData.medicalHistory.forEach(condition => {
        content += `<li>${condition.condition} (${condition.status})</li>`;
      });
      content += '</ul>';
    }

    if (summaryData.currentMedications.length > 0) {
      content += '<h3>💊 Current Medications</h3><ul>';
      summaryData.currentMedications.forEach(med => {
        content += `<li>${med.name}${med.dosage ? ` - ${med.dosage}` : ''}${med.frequency ? ` (${med.frequency})` : ''}</li>`;
      });
      content += '</ul>';
    }

    if (summaryData.allergies.length > 0) {
      content += '<h3>⚠️ Allergies</h3><ul>';
      summaryData.allergies.forEach(allergy => {
        content += `<li>${allergy.allergen}${allergy.severity ? ` (${allergy.severity})` : ''}</li>`;
      });
      content += '</ul>';
    }

    if (summaryData.recentNotes.length > 0) {
      content += '<h3>📝 Recent Visit Notes</h3><ul>';
      summaryData.recentNotes.forEach(note => {
        content += `<li>${note}</li>`;
      });
      content += '</ul>';
    }

    content += '<p><em>This summary was automatically generated to help you prepare for your appointment.</em></p>';

    return content;
  }

  private generateSMSContent(summaryData: PreAppointmentSummary): string {
    let content = `Upcoming: ${summaryData.appointment.time} - ${summaryData.patient.name} (${summaryData.patient.age}y)\n`;
    content += `Type: ${summaryData.appointment.type}\n`;
    
    if (summaryData.lastVisit) {
      content += `Last seen: ${summaryData.lastVisit.date} (${summaryData.lastVisit.daysSince}d ago)\n`;
    }

    if (summaryData.flags.length > 0) {
      content += `\n🚨 Flags:\n`;
      summaryData.flags.slice(0, 2).forEach(flag => {
        content += `• ${flag.message}\n`;
      });
    }

    if (summaryData.medicalHistory.length > 0) {
      content += `\nConditions: ${summaryData.medicalHistory.slice(0, 3).map(c => c.condition).join(', ')}\n`;
    }

    if (summaryData.currentMedications.length > 0) {
      content += `Meds: ${summaryData.currentMedications.slice(0, 3).map(m => m.name).join(', ')}\n`;
    }

    return content;
  }

  async schedulePreAppointmentSummaries(): Promise<void> {
    console.log('Scheduling pre-appointment summaries for upcoming appointments');
    
    // Get appointments for tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = format(tomorrow, 'yyyy-MM-dd');

    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('id, provider_id, time')
      .eq('date', tomorrowStr)
      .eq('status', 'confirmed');

    if (error) {
      console.error('Error fetching appointments:', error);
      return;
    }

    for (const appointment of appointments || []) {
      if (appointment.provider_id) {
        // Schedule summary to be sent 30 minutes before appointment
        const appointmentTime = new Date(`${tomorrowStr}T${appointment.time}`);
        const summaryTime = new Date(appointmentTime.getTime() - 30 * 60 * 1000);

        await supabase.from('notification_queue').insert({
          appointment_id: appointment.id,
          type: 'pre_appointment_summary',
          scheduled_for: summaryTime.toISOString(),
          status: 'pending',
          channel: 'email',
          recipient: '', // Will be filled by processor
          message: `Pre-appointment summary for ${appointment.id}`
        });
      }
    }

    console.log(`Scheduled pre-appointment summaries for ${appointments?.length || 0} appointments`);
  }
}

export const preAppointmentSummaryService = new PreAppointmentSummaryService();
