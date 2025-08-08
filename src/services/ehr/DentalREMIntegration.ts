/**
 * Dental REM EHR Integration Service
 * Handles integration with Dental REM for Midwest Dental Sleep Medicine Institute
 */

export interface DentalREMConfig {
  system: 'dental-rem';
  specialty: 'dental-sleep';
  practiceId: string;
  apiEndpoint: string;
  apiKey: string;
}

export interface DentalREMPatient {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  insurance_provider: string;
  policy_number: string;
  group_number: string;
  medical_history: string;
  allergies: string[];
  medications: string[];
  dental_history: string;
  sleep_study_results: string;
  cpap_pressure: string;
  compliance_data: string;
}

export interface DentalREMAppointment {
  id: string;
  patient_id: string;
  provider_id: string;
  date: string;
  time: string;
  duration: number;
  appointment_type: string;
  notes: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  dental_notes: string;
  sleep_medicine_notes: string;
  follow_up_required: boolean;
  dme_required: boolean;
}

export class DentalREMIntegration {
  private dentalREMConfig: DentalREMConfig;

  constructor(config: DentalREMConfig) {
    this.dentalREMConfig = config;
  }

  /**
   * Fetch patients from Dental REM
   */
  async fetchDentalREMPatients(): Promise<DentalREMPatient[]> {
    try {
      console.log('🔄 Fetching patients from Dental REM...');

      const response = await fetch(`${this.dentalREMConfig.apiEndpoint}/patients`, {
        headers: {
          'Authorization': `Bearer ${this.dentalREMConfig.apiKey}`,
          'Content-Type': 'application/json',
          'X-Practice-ID': this.dentalREMConfig.practiceId
        }
      });

      if (!response.ok) {
        throw new Error(`Dental REM API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.patients.map((patient: any) => ({
        id: patient.id,
        first_name: patient.first_name,
        last_name: patient.last_name,
        date_of_birth: patient.date_of_birth,
        email: patient.email,
        phone: patient.phone,
        address: patient.address,
        city: patient.city,
        state: patient.state,
        zip_code: patient.zip_code,
        insurance_provider: patient.insurance_provider,
        policy_number: patient.policy_number,
        group_number: patient.group_number,
        medical_history: patient.medical_history,
        allergies: patient.allergies || [],
        medications: patient.medications || [],
        dental_history: patient.dental_history,
        sleep_study_results: patient.sleep_study_results,
        cpap_pressure: patient.cpap_pressure,
        compliance_data: patient.compliance_data
      }));
    } catch (error) {
      console.error('Dental REM patient fetch error:', error);
      throw error;
    }
  }

  /**
   * Fetch appointments from Dental REM
   */
  async fetchDentalREMAppointments(): Promise<DentalREMAppointment[]> {
    try {
      console.log('🔄 Fetching appointments from Dental REM...');

      const response = await fetch(`${this.dentalREMConfig.apiEndpoint}/appointments`, {
        headers: {
          'Authorization': `Bearer ${this.dentalREMConfig.apiKey}`,
          'Content-Type': 'application/json',
          'X-Practice-ID': this.dentalREMConfig.practiceId
        }
      });

      if (!response.ok) {
        throw new Error(`Dental REM API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.appointments.map((appointment: any) => ({
        id: appointment.id,
        patient_id: appointment.patient_id,
        provider_id: appointment.provider_id,
        date: appointment.date,
        time: appointment.time,
        duration: appointment.duration,
        appointment_type: appointment.appointment_type,
        notes: appointment.notes,
        status: appointment.status,
        dental_notes: appointment.dental_notes,
        sleep_medicine_notes: appointment.sleep_medicine_notes,
        follow_up_required: appointment.follow_up_required,
        dme_required: appointment.dme_required
      }));
    } catch (error) {
      console.error('Dental REM appointment fetch error:', error);
      throw error;
    }
  }

  /**
   * Create appointment in Dental REM
   */
  async createDentalREMAppointment(appointment: DentalREMAppointment): Promise<any> {
    try {
      console.log('📤 Creating appointment in Dental REM...');

      const response = await fetch(`${this.dentalREMConfig.apiEndpoint}/appointments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.dentalREMConfig.apiKey}`,
          'Content-Type': 'application/json',
          'X-Practice-ID': this.dentalREMConfig.practiceId
        },
        body: JSON.stringify(appointment)
      });

      if (!response.ok) {
        throw new Error(`Dental REM API error: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Dental REM appointment creation error:', error);
      throw error;
    }
  }

  /**
   * Update appointment in Dental REM
   */
  async updateDentalREMAppointment(appointmentId: string, appointment: Partial<DentalREMAppointment>): Promise<any> {
    try {
      console.log(`📤 Updating appointment ${appointmentId} in Dental REM...`);

      const response = await fetch(`${this.dentalREMConfig.apiEndpoint}/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.dentalREMConfig.apiKey}`,
          'Content-Type': 'application/json',
          'X-Practice-ID': this.dentalREMConfig.practiceId
        },
        body: JSON.stringify(appointment)
      });

      if (!response.ok) {
        throw new Error(`Dental REM API error: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Dental REM appointment update error:', error);
      throw error;
    }
  }

  /**
   * Get sleep study results from Dental REM
   */
  async getSleepStudyResults(patientId: string): Promise<any[]> {
    try {
      console.log(`🔄 Fetching sleep study results for patient ${patientId}...`);

      const response = await fetch(`${this.dentalREMConfig.apiEndpoint}/patients/${patientId}/sleep-studies`, {
        headers: {
          'Authorization': `Bearer ${this.dentalREMConfig.apiKey}`,
          'Content-Type': 'application/json',
          'X-Practice-ID': this.dentalREMConfig.practiceId
        }
      });

      if (!response.ok) {
        throw new Error(`Dental REM API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.sleep_studies;
    } catch (error) {
      console.error('Dental REM sleep study fetch error:', error);
      throw error;
    }
  }

  /**
   * Create sleep study result in Dental REM
   */
  async createSleepStudyResult(patientId: string, sleepStudy: any): Promise<any> {
    try {
      console.log(`📤 Creating sleep study result for patient ${patientId}...`);

      const response = await fetch(`${this.dentalREMConfig.apiEndpoint}/patients/${patientId}/sleep-studies`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.dentalREMConfig.apiKey}`,
          'Content-Type': 'application/json',
          'X-Practice-ID': this.dentalREMConfig.practiceId
        },
        body: JSON.stringify(sleepStudy)
      });

      if (!response.ok) {
        throw new Error(`Dental REM API error: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Dental REM sleep study creation error:', error);
      throw error;
    }
  }

  /**
   * Get DME (Durable Medical Equipment) data from Dental REM
   */
  async getDMEData(patientId: string): Promise<any[]> {
    try {
      console.log(`🔄 Fetching DME data for patient ${patientId}...`);

      const response = await fetch(`${this.dentalREMConfig.apiEndpoint}/patients/${patientId}/dme`, {
        headers: {
          'Authorization': `Bearer ${this.dentalREMConfig.apiKey}`,
          'Content-Type': 'application/json',
          'X-Practice-ID': this.dentalREMConfig.practiceId
        }
      });

      if (!response.ok) {
        throw new Error(`Dental REM API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.dme_data;
    } catch (error) {
      console.error('Dental REM DME data fetch error:', error);
      throw error;
    }
  }

  /**
   * Create DME record in Dental REM
   */
  async createDMERecord(patientId: string, dmeRecord: any): Promise<any> {
    try {
      console.log(`📤 Creating DME record for patient ${patientId}...`);

      const response = await fetch(`${this.dentalREMConfig.apiEndpoint}/patients/${patientId}/dme`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.dentalREMConfig.apiKey}`,
          'Content-Type': 'application/json',
          'X-Practice-ID': this.dentalREMConfig.practiceId
        },
        body: JSON.stringify(dmeRecord)
      });

      if (!response.ok) {
        throw new Error(`Dental REM API error: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Dental REM DME record creation error:', error);
      throw error;
    }
  }

  /**
   * Get compliance data from Dental REM
   */
  async getComplianceData(patientId: string): Promise<any[]> {
    try {
      console.log(`🔄 Fetching compliance data for patient ${patientId}...`);

      const response = await fetch(`${this.dentalREMConfig.apiEndpoint}/patients/${patientId}/compliance`, {
        headers: {
          'Authorization': `Bearer ${this.dentalREMConfig.apiKey}`,
          'Content-Type': 'application/json',
          'X-Practice-ID': this.dentalREMConfig.practiceId
        }
      });

      if (!response.ok) {
        throw new Error(`Dental REM API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.compliance_data;
    } catch (error) {
      console.error('Dental REM compliance data fetch error:', error);
      throw error;
    }
  }

  /**
   * Create compliance record in Dental REM
   */
  async createComplianceRecord(patientId: string, complianceRecord: any): Promise<any> {
    try {
      console.log(`📤 Creating compliance record for patient ${patientId}...`);

      const response = await fetch(`${this.dentalREMConfig.apiEndpoint}/patients/${patientId}/compliance`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.dentalREMConfig.apiKey}`,
          'Content-Type': 'application/json',
          'X-Practice-ID': this.dentalREMConfig.practiceId
        },
        body: JSON.stringify(complianceRecord)
      });

      if (!response.ok) {
        throw new Error(`Dental REM API error: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Dental REM compliance record creation error:', error);
      throw error;
    }
  }

  /**
   * Test Dental REM connection
   */
  async testConnection(): Promise<boolean> {
    try {
      console.log('🔍 Testing Dental REM connection...');

      const response = await fetch(`${this.dentalREMConfig.apiEndpoint}/health`, {
        headers: {
          'Authorization': `Bearer ${this.dentalREMConfig.apiKey}`,
          'Content-Type': 'application/json',
          'X-Practice-ID': this.dentalREMConfig.practiceId
        }
      });

      if (response.ok) {
        console.log('✅ Dental REM connection successful');
        return true;
      } else {
        console.log('❌ Dental REM connection failed');
        return false;
      }
    } catch (error) {
      console.error('Dental REM connection test error:', error);
      return false;
    }
  }
} 