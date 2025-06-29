
import { supabase } from '@/integrations/supabase/client';

export interface PatientStatusUpdate {
  id: string;
  patient_id: string;
  appointment_id?: string;
  status_type: string;
  status_value: string;
  message?: string;
  created_at: string;
}

export class PatientStatusService {
  // Create a status update
  static async createStatusUpdate(update: Omit<PatientStatusUpdate, 'id' | 'created_at'>) {
    try {
      const { data, error } = await supabase
        .from('patient_status_updates')
        .insert(update)
        .select()
        .single();

      if (error) {
        console.error('Error creating status update:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in createStatusUpdate:', error);
      return null;
    }
  }

  // Update intake progress
  static async updateIntakeProgress(patientId: string, appointmentId: string, step: string, progress: number) {
    await this.createStatusUpdate({
      patient_id: patientId,
      appointment_id: appointmentId,
      status_type: 'intake_progress',
      status_value: progress.toString(),
      message: `Completed ${step} - ${progress}% complete`
    });
  }

  // Update appointment status
  static async updateAppointmentStatus(patientId: string, appointmentId: string, status: string, message?: string) {
    await this.createStatusUpdate({
      patient_id: patientId,
      appointment_id: appointmentId,
      status_type: 'appointment_status',
      status_value: status,
      message: message || `Appointment ${status}`
    });
  }

  // Update symptom assessment completion
  static async updateSymptomAssessment(patientId: string, appointmentId: string, completed: boolean) {
    await this.createStatusUpdate({
      patient_id: patientId,
      appointment_id: appointmentId,
      status_type: 'symptom_assessment',
      status_value: completed ? 'completed' : 'in_progress',
      message: completed ? 'Symptom assessment completed' : 'Symptom assessment in progress'
    });
  }

  // Get patient status updates
  static async getPatientUpdates(patientId: string, appointmentId?: string) {
    try {
      let query = supabase
        .from('patient_status_updates')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });

      if (appointmentId) {
        query = query.eq('appointment_id', appointmentId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching patient updates:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getPatientUpdates:', error);
      return [];
    }
  }

  // Get latest status for a specific type
  static async getLatestStatus(patientId: string, statusType: string, appointmentId?: string) {
    try {
      let query = supabase
        .from('patient_status_updates')
        .select('*')
        .eq('patient_id', patientId)
        .eq('status_type', statusType)
        .order('created_at', { ascending: false })
        .limit(1);

      if (appointmentId) {
        query = query.eq('appointment_id', appointmentId);
      }

      const { data, error } = await query.single();

      if (error) {
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getLatestStatus:', error);
      return null;
    }
  }
}
