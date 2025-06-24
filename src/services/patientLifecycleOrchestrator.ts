
import { supabase } from "@/integrations/supabase/client";

export interface PatientLifecycleStage {
  id: string;
  patient_id: string;
  stage: 'registration' | 'onboarding' | 'scheduling' | 'intake' | 'check_in' | 'visit' | 'documentation' | 'billing' | 'follow_up';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  data: any;
  created_at: string;
  updated_at: string;
  ai_automation_enabled: boolean;
}

export interface PatientWorkflow {
  patient_id: string;
  appointment_id?: string;
  current_stage: string;
  stages_completed: string[];
  automation_config: {
    auto_onboarding: boolean;
    auto_intake: boolean;
    auto_check_in: boolean;
    auto_documentation: boolean;
    auto_billing: boolean;
    auto_follow_up: boolean;
  };
}

class PatientLifecycleOrchestrator {
  async initializeNewPatientWorkflow(patientData: any): Promise<PatientWorkflow> {
    console.log('Initializing new patient workflow for:', patientData);
    
    const workflow: PatientWorkflow = {
      patient_id: patientData.id,
      current_stage: 'registration',
      stages_completed: [],
      automation_config: {
        auto_onboarding: true,
        auto_intake: true,
        auto_check_in: true,
        auto_documentation: true,
        auto_billing: true,
        auto_follow_up: true
      }
    };

    // Trigger automated onboarding
    if (workflow.automation_config.auto_onboarding) {
      await this.triggerAutomatedOnboarding(workflow.patient_id);
    }

    return workflow;
  }

  async triggerAutomatedOnboarding(patientId: string): Promise<void> {
    console.log('Triggering automated onboarding for patient:', patientId);
    
    // Create intake forms assignment
    const { data, error } = await supabase.functions.invoke('patient-onboarding-automation', {
      body: {
        patient_id: patientId,
        automation_type: 'onboarding',
        include_forms: ['new_patient_intake', 'medical_history', 'insurance_information']
      }
    });

    if (error) {
      console.error('Error triggering onboarding automation:', error);
    }
  }

  async handleAppointmentScheduled(appointmentId: string, patientId: string): Promise<void> {
    console.log('Handling appointment scheduled:', appointmentId);
    
    // Trigger pre-visit automation
    await this.triggerPreVisitAutomation(appointmentId, patientId);
  }

  async triggerPreVisitAutomation(appointmentId: string, patientId: string): Promise<void> {
    console.log('Triggering pre-visit automation');
    
    // Send appointment confirmation
    await supabase.functions.invoke('send-appointment-confirmation', {
      body: {
        appointment_id: appointmentId,
        patient_id: patientId,
        include_intake_forms: true,
        include_check_in_link: true
      }
    });

    // Schedule reminder notifications
    await this.scheduleAppointmentReminders(appointmentId);
  }

  async scheduleAppointmentReminders(appointmentId: string): Promise<void> {
    console.log('Scheduling appointment reminders for:', appointmentId);
    
    const reminders = [
      { hours_before: 24, type: 'email' },
      { hours_before: 2, type: 'sms' },
      { hours_before: 0.5, type: 'check_in_notification' }
    ];

    for (const reminder of reminders) {
      await supabase.from('notification_queue').insert({
        appointment_id: appointmentId,
        type: reminder.type,
        scheduled_for: new Date(Date.now() + (reminder.hours_before * 60 * 60 * 1000)).toISOString(),
        status: 'pending',
        channel: reminder.type === 'sms' ? 'sms' : 'email',
        recipient: '', // Will be filled by notification processor
        message: `Automated ${reminder.type} reminder`
      });
    }
  }

  async handlePatientCheckIn(appointmentId: string): Promise<void> {
    console.log('Handling patient check-in for appointment:', appointmentId);
    
    // Update appointment status
    await supabase.from('appointments').update({
      status: 'checked_in',
      updated_at: new Date().toISOString()
    }).eq('id', appointmentId);

    // Notify provider
    await this.notifyProviderOfArrival(appointmentId);
  }

  async notifyProviderOfArrival(appointmentId: string): Promise<void> {
    console.log('Notifying provider of patient arrival');
    
    await supabase.functions.invoke('notify-provider-arrival', {
      body: {
        appointment_id: appointmentId,
        notification_type: 'patient_arrived'
      }
    });
  }

  async handleVisitComplete(appointmentId: string, soapNoteId?: string): Promise<void> {
    console.log('Handling visit completion');
    
    // Trigger post-visit automation
    await this.triggerPostVisitAutomation(appointmentId, soapNoteId);
  }

  async triggerPostVisitAutomation(appointmentId: string, soapNoteId?: string): Promise<void> {
    console.log('Triggering post-visit automation');
    
    // Generate and submit claims automatically
    if (soapNoteId) {
      await this.generateAndSubmitClaims(appointmentId, soapNoteId);
    }

    // Send post-visit communication
    await this.sendPostVisitCommunication(appointmentId);

    // Schedule follow-up
    await this.scheduleFollowUp(appointmentId);
  }

  async generateAndSubmitClaims(appointmentId: string, soapNoteId: string): Promise<void> {
    console.log('Generating and submitting claims automatically');
    
    await supabase.functions.invoke('auto-claims-generation', {
      body: {
        appointment_id: appointmentId,
        soap_note_id: soapNoteId,
        auto_submit: true
      }
    });
  }

  async sendPostVisitCommunication(appointmentId: string): Promise<void> {
    console.log('Sending post-visit communication');
    
    await supabase.functions.invoke('send-post-visit-communication', {
      body: {
        appointment_id: appointmentId,
        templates: ['visit_summary', 'care_instructions', 'follow_up_scheduling']
      }
    });
  }

  async scheduleFollowUp(appointmentId: string): Promise<void> {
    console.log('Scheduling follow-up communications');
    
    const followUpSchedule = [
      { days_after: 1, type: 'post_visit_survey' },
      { days_after: 7, type: 'recovery_check_in' },
      { days_after: 30, type: 'follow_up_appointment_offer' }
    ];

    for (const followUp of followUpSchedule) {
      await supabase.from('notification_queue').insert({
        appointment_id: appointmentId,
        type: followUp.type,
        scheduled_for: new Date(Date.now() + (followUp.days_after * 24 * 60 * 60 * 1000)).toISOString(),
        status: 'pending',
        channel: 'email',
        recipient: '', // Will be filled by processor
        message: `Automated ${followUp.type}`
      });
    }
  }

  async getPatientJourney(patientId: string): Promise<any> {
    // Get complete patient journey data
    const { data: patient } = await supabase.from('patients').select('*').eq('id', patientId).single();
    const { data: appointments } = await supabase.from('appointments').select('*').eq('patient_id', patientId);
    const { data: intake } = await supabase.from('intake_submissions').select('*').eq('patient_id', patientId);
    const { data: communications } = await supabase.from('communication_logs').select('*').eq('submission_id', intake?.[0]?.id);

    return {
      patient,
      appointments,
      intake,
      communications,
      journey_stage: this.determineCurrentStage(patient, appointments, intake)
    };
  }

  private determineCurrentStage(patient: any, appointments: any[], intake: any[]): string {
    if (!appointments?.length) return 'new_patient';
    if (appointments.some(apt => apt.status === 'scheduled')) return 'scheduled';
    if (appointments.some(apt => apt.status === 'checked_in')) return 'in_visit';
    if (appointments.some(apt => apt.status === 'completed')) return 'post_visit';
    return 'active_patient';
  }
}

export const patientLifecycleOrchestrator = new PatientLifecycleOrchestrator();
