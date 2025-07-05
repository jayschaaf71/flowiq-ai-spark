
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
      console.log('Mock creating status update:', update);
      
      // Return mock data since patient_status_updates table doesn't exist
      return {
        id: 'mock-id-' + Date.now(),
        ...update,
        created_at: new Date().toISOString()
      };
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
      console.log('Mock fetching patient updates for:', patientId, appointmentId);
      
      // Return mock data since patient_status_updates table doesn't exist
      return [
        {
          id: 'mock-1',
          patient_id: patientId,
          appointment_id: appointmentId,
          status_type: 'appointment_status',
          status_value: 'scheduled',
          message: 'Appointment scheduled',
          created_at: new Date().toISOString()
        }
      ];
    } catch (error) {
      console.error('Error in getPatientUpdates:', error);
      return [];
    }
  }

  // Get latest status for a specific type
  static async getLatestStatus(patientId: string, statusType: string, appointmentId?: string) {
    try {
      console.log('Mock fetching latest status for:', patientId, statusType, appointmentId);
      
      // Return mock data since patient_status_updates table doesn't exist
      return {
        id: 'mock-latest',
        patient_id: patientId,
        appointment_id: appointmentId,
        status_type: statusType,
        status_value: 'in_progress',
        message: `${statusType} in progress`,
        created_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error in getLatestStatus:', error);
      return null;
    }
  }
}
