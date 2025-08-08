/**
 * EHR Integration Service
 * Handles integration with external EHR systems for pilot practices
 */

import { supabase } from '@/integrations/supabase/client';

export interface EHRConfig {
  system: 'easybis' | 'dental-rem' | 'dental-sleep-solutions' | 'mogo';
  apiEndpoint: string;
  apiKey: string;
  practiceId: string;
  specialty: 'chiropractic' | 'dental-sleep' | 'general-dentistry';
}

export interface PatientData {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  address: string;
  insurance: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
  };
  medicalHistory: string;
  allergies: string[];
  medications: string[];
}

export interface AppointmentData {
  id: string;
  patientId: string;
  providerId: string;
  date: string;
  time: string;
  duration: number;
  type: string;
  notes: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
}

export interface EHRResponse {
  success: boolean;
  data?: any;
  error?: string;
  timestamp: string;
}

export class EHRIntegrationService {
  private config: EHRConfig;

  constructor(config: EHRConfig) {
    this.config = config;
  }

  /**
   * Sync patients from external EHR to FlowIQ
   */
  async syncPatients(): Promise<EHRResponse> {
    try {
      console.log(`🔄 Syncing patients from ${this.config.system}...`);

      // Get patients from external EHR
      const externalPatients = await this.fetchExternalPatients();
      
      // Transform and sync to FlowIQ
      const syncedPatients = await this.syncPatientsToFlowIQ(externalPatients);

      return {
        success: true,
        data: {
          totalPatients: externalPatients.length,
          syncedPatients: syncedPatients.length,
          patients: syncedPatients
        },
        timestamp: new Date().toISOString()
      };

    } catch (error: any) {
      console.error('EHR sync error:', error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Sync appointments from external EHR to FlowIQ
   */
  async syncAppointments(): Promise<EHRResponse> {
    try {
      console.log(`🔄 Syncing appointments from ${this.config.system}...`);

      // Get appointments from external EHR
      const externalAppointments = await this.fetchExternalAppointments();
      
      // Transform and sync to FlowIQ
      const syncedAppointments = await this.syncAppointmentsToFlowIQ(externalAppointments);

      return {
        success: true,
        data: {
          totalAppointments: externalAppointments.length,
          syncedAppointments: syncedAppointments.length,
          appointments: syncedAppointments
        },
        timestamp: new Date().toISOString()
      };

    } catch (error: any) {
      console.error('EHR sync error:', error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Push appointment changes back to external EHR
   */
  async pushAppointmentToEHR(appointment: AppointmentData): Promise<EHRResponse> {
    try {
      console.log(`📤 Pushing appointment to ${this.config.system}...`);

      // Transform FlowIQ appointment to EHR format
      const ehrAppointment = this.transformAppointmentForEHR(appointment);
      
      // Push to external EHR
      const response = await this.pushToExternalEHR(ehrAppointment);

      return {
        success: true,
        data: response,
        timestamp: new Date().toISOString()
      };

    } catch (error: any) {
      console.error('EHR push error:', error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Fetch patients from external EHR system
   */
  private async fetchExternalPatients(): Promise<PatientData[]> {
    // Implementation varies by EHR system
    switch (this.config.system) {
      case 'easybis':
        return this.fetchEasyBISPatients();
      case 'dental-rem':
        return this.fetchDentalREMPatients();
      case 'dental-sleep-solutions':
        return this.fetchDentalSleepSolutionsPatients();
      case 'mogo':
        return this.fetchMogoPatients();
      default:
        throw new Error(`Unsupported EHR system: ${this.config.system}`);
    }
  }

  /**
   * Fetch appointments from external EHR system
   */
  private async fetchExternalAppointments(): Promise<AppointmentData[]> {
    // Implementation varies by EHR system
    switch (this.config.system) {
      case 'easybis':
        return this.fetchEasyBISAppointments();
      case 'dental-rem':
        return this.fetchDentalREMAppointments();
      case 'dental-sleep-solutions':
        return this.fetchDentalSleepSolutionsAppointments();
      case 'mogo':
        return this.fetchMogoAppointments();
      default:
        throw new Error(`Unsupported EHR system: ${this.config.system}`);
    }
  }

  /**
   * EasyBIS Integration (Chiropractic)
   */
  private async fetchEasyBISPatients(): Promise<PatientData[]> {
    // Mock implementation - replace with actual EasyBIS API calls
    const response = await fetch(`${this.config.apiEndpoint}/patients`, {
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`EasyBIS API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.patients.map((patient: any) => ({
      id: patient.id,
      firstName: patient.first_name,
      lastName: patient.last_name,
      dateOfBirth: patient.date_of_birth,
      email: patient.email,
      phone: patient.phone,
      address: patient.address,
      insurance: {
        provider: patient.insurance_provider,
        policyNumber: patient.policy_number,
        groupNumber: patient.group_number
      },
      medicalHistory: patient.medical_history,
      allergies: patient.allergies || [],
      medications: patient.medications || []
    }));
  }

  private async fetchEasyBISAppointments(): Promise<AppointmentData[]> {
    // Mock implementation - replace with actual EasyBIS API calls
    const response = await fetch(`${this.config.apiEndpoint}/appointments`, {
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`EasyBIS API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.appointments.map((appointment: any) => ({
      id: appointment.id,
      patientId: appointment.patient_id,
      providerId: appointment.provider_id,
      date: appointment.date,
      time: appointment.time,
      duration: appointment.duration,
      type: appointment.type,
      notes: appointment.notes,
      status: appointment.status
    }));
  }

  /**
   * Dental REM Integration (Dental Sleep)
   */
  private async fetchDentalREMPatients(): Promise<PatientData[]> {
    // Mock implementation - replace with actual Dental REM API calls
    const response = await fetch(`${this.config.apiEndpoint}/patients`, {
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Dental REM API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.patients.map((patient: any) => ({
      id: patient.id,
      firstName: patient.first_name,
      lastName: patient.last_name,
      dateOfBirth: patient.date_of_birth,
      email: patient.email,
      phone: patient.phone,
      address: patient.address,
      insurance: {
        provider: patient.insurance_provider,
        policyNumber: patient.policy_number,
        groupNumber: patient.group_number
      },
      medicalHistory: patient.medical_history,
      allergies: patient.allergies || [],
      medications: patient.medications || []
    }));
  }

  private async fetchDentalREMAppointments(): Promise<AppointmentData[]> {
    // Mock implementation - replace with actual Dental REM API calls
    const response = await fetch(`${this.config.apiEndpoint}/appointments`, {
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Dental REM API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.appointments.map((appointment: any) => ({
      id: appointment.id,
      patientId: appointment.patient_id,
      providerId: appointment.provider_id,
      date: appointment.date,
      time: appointment.time,
      duration: appointment.duration,
      type: appointment.type,
      notes: appointment.notes,
      status: appointment.status
    }));
  }

  /**
   * Dental Sleep Solutions Integration
   */
  private async fetchDentalSleepSolutionsPatients(): Promise<PatientData[]> {
    // Similar implementation for Dental Sleep Solutions
    return this.fetchDentalREMPatients(); // Using same structure for now
  }

  private async fetchDentalSleepSolutionsAppointments(): Promise<AppointmentData[]> {
    // Similar implementation for Dental Sleep Solutions
    return this.fetchDentalREMAppointments(); // Using same structure for now
  }

  /**
   * Mogo Integration (General Dentistry)
   */
  private async fetchMogoPatients(): Promise<PatientData[]> {
    // Mock implementation - replace with actual Mogo API calls
    const response = await fetch(`${this.config.apiEndpoint}/patients`, {
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Mogo API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.patients.map((patient: any) => ({
      id: patient.id,
      firstName: patient.first_name,
      lastName: patient.last_name,
      dateOfBirth: patient.date_of_birth,
      email: patient.email,
      phone: patient.phone,
      address: patient.address,
      insurance: {
        provider: patient.insurance_provider,
        policyNumber: patient.policy_number,
        groupNumber: patient.group_number
      },
      medicalHistory: patient.medical_history,
      allergies: patient.allergies || [],
      medications: patient.medications || []
    }));
  }

  private async fetchMogoAppointments(): Promise<AppointmentData[]> {
    // Mock implementation - replace with actual Mogo API calls
    const response = await fetch(`${this.config.apiEndpoint}/appointments`, {
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Mogo API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.appointments.map((appointment: any) => ({
      id: appointment.id,
      patientId: appointment.patient_id,
      providerId: appointment.provider_id,
      date: appointment.date,
      time: appointment.time,
      duration: appointment.duration,
      type: appointment.type,
      notes: appointment.notes,
      status: appointment.status
    }));
  }

  /**
   * Sync patients to FlowIQ database
   */
  private async syncPatientsToFlowIQ(patients: PatientData[]): Promise<any[]> {
    const syncedPatients: any[] = [];

    for (const patient of patients) {
      try {
        // Check if patient already exists
        const { data: existingPatient } = await supabase
          .from('patients')
          .select('id')
          .eq('patient_name', `${patient.firstName} ${patient.lastName}`)
          .eq('email', patient.email)
          .single();

        if (existingPatient) {
          // Update existing patient
          const { data: updatedPatient } = await supabase
            .from('patients')
            .update({
              first_name: patient.firstName,
              last_name: patient.lastName,
              date_of_birth: patient.dateOfBirth,
              email: patient.email,
              phone: patient.phone,
              address: patient.address,
              medical_history: patient.medicalHistory,
              allergies: patient.allergies.join(', '),
              medications: patient.medications.join(', '),
              updated_at: new Date().toISOString()
            })
            .eq('id', existingPatient.id)
            .select()
            .single();

          if (updatedPatient) syncedPatients.push(updatedPatient);
        } else {
          // Create new patient
          const { data: newPatient } = await supabase
            .from('patients')
            .insert({
              patient_name: `${patient.firstName} ${patient.lastName}`,
              first_name: patient.firstName,
              last_name: patient.lastName,
              date_of_birth: patient.dateOfBirth,
              email: patient.email,
              phone: patient.phone,
              address: patient.address,
              medical_history: patient.medicalHistory,
              allergies: patient.allergies.join(', '),
              medications: patient.medications.join(', ')
            })
            .select()
            .single();

          if (newPatient) syncedPatients.push(newPatient);
        }
      } catch (error) {
        console.error(`Error syncing patient ${patient.id}:`, error);
      }
    }

    return syncedPatients;
  }

  /**
   * Sync appointments to FlowIQ database
   */
  private async syncAppointmentsToFlowIQ(appointments: AppointmentData[]): Promise<any[]> {
    const syncedAppointments: any[] = [];

    for (const appointment of appointments) {
      try {
        // Check if appointment already exists
        const { data: existingAppointment } = await supabase
          .from('appointments')
          .select('id')
          .eq('patient_id', appointment.patientId)
          .eq('date', appointment.date)
          .eq('time', appointment.time)
          .single();

        if (existingAppointment) {
          // Update existing appointment
          const { data: updatedAppointment } = await supabase
            .from('appointments')
            .update({
              patient_id: appointment.patientId,
              provider_id: appointment.providerId,
              date: appointment.date,
              time: appointment.time,
              duration: appointment.duration,
              appointment_type: appointment.type,
              notes: appointment.notes,
              status: appointment.status,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingAppointment.id)
            .select()
            .single();

          if (updatedAppointment) syncedAppointments.push(updatedAppointment);
        } else {
          // Create new appointment
          const { data: newAppointment } = await supabase
            .from('appointments')
            .insert({
              patient_id: appointment.patientId,
              provider_id: appointment.providerId,
              date: appointment.date,
              time: appointment.time,
              duration: appointment.duration,
              appointment_type: appointment.type,
              notes: appointment.notes,
              status: appointment.status
            })
            .select()
            .single();

          if (newAppointment) syncedAppointments.push(newAppointment);
        }
      } catch (error) {
        console.error(`Error syncing appointment ${appointment.id}:`, error);
      }
    }

    return syncedAppointments;
  }

  /**
   * Transform FlowIQ appointment for external EHR
   */
  private transformAppointmentForEHR(appointment: AppointmentData): any {
    // Transform based on EHR system
    switch (this.config.system) {
      case 'easybis':
        return {
          patient_id: appointment.patientId,
          provider_id: appointment.providerId,
          date: appointment.date,
          time: appointment.time,
          duration: appointment.duration,
          type: appointment.type,
          notes: appointment.notes,
          status: appointment.status
        };
      case 'dental-rem':
        return {
          patient_id: appointment.patientId,
          provider_id: appointment.providerId,
          date: appointment.date,
          time: appointment.time,
          duration: appointment.duration,
          type: appointment.type,
          notes: appointment.notes,
          status: appointment.status
        };
      default:
        return appointment;
    }
  }

  /**
   * Push appointment to external EHR
   */
  private async pushToExternalEHR(appointment: any): Promise<any> {
    const response = await fetch(`${this.config.apiEndpoint}/appointments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(appointment)
    });

    if (!response.ok) {
      throw new Error(`EHR API error: ${response.statusText}`);
    }

    return response.json();
  }
} 