/**
 * EasyBIS EHR Integration Service
 * Handles integration with EasyBIS for West County Spine & Joint (Chiropractic)
 */

export interface EasyBISConfig {
  system: 'easybis';
  specialty: 'chiropractic';
  practiceId: string;
  apiEndpoint: string;
  apiKey: string;
}

export interface EasyBISPatient {
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
  chiropractic_history: string;
  current_symptoms: string;
  treatment_plan: string;
}

export interface EasyBISAppointment {
  id: string;
  patient_id: string;
  provider_id: string;
  date: string;
  time: string;
  duration: number;
  appointment_type: string;
  notes: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  chiropractic_notes: string;
  treatment_notes: string;
  follow_up_required: boolean;
}

export class EasyBISIntegration {
  private easyBISConfig: EasyBISConfig;

  constructor(config: EasyBISConfig) {
    this.easyBISConfig = config;
  }

  /**
   * Fetch patients from EasyBIS
   */
  async fetchEasyBISPatients(): Promise<EasyBISPatient[]> {
    try {
      console.log('🔄 Fetching patients from EasyBIS...');

      const response = await fetch(`${this.easyBISConfig.apiEndpoint}/patients`, {
        headers: {
          'Authorization': `Bearer ${this.easyBISConfig.apiKey}`,
          'Content-Type': 'application/json',
          'X-Practice-ID': this.easyBISConfig.practiceId
        }
      });

      if (!response.ok) {
        throw new Error(`EasyBIS API error: ${response.statusText}`);
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
        chiropractic_history: patient.chiropractic_history,
        current_symptoms: patient.current_symptoms,
        treatment_plan: patient.treatment_plan
      }));
    } catch (error) {
      console.error('EasyBIS patient fetch error:', error);
      throw error;
    }
  }

  /**
   * Fetch appointments from EasyBIS
   */
  async fetchEasyBISAppointments(): Promise<EasyBISAppointment[]> {
    try {
      console.log('🔄 Fetching appointments from EasyBIS...');

      const response = await fetch(`${this.easyBISConfig.apiEndpoint}/appointments`, {
        headers: {
          'Authorization': `Bearer ${this.easyBISConfig.apiKey}`,
          'Content-Type': 'application/json',
          'X-Practice-ID': this.easyBISConfig.practiceId
        }
      });

      if (!response.ok) {
        throw new Error(`EasyBIS API error: ${response.statusText}`);
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
        chiropractic_notes: appointment.chiropractic_notes,
        treatment_notes: appointment.treatment_notes,
        follow_up_required: appointment.follow_up_required
      }));
    } catch (error) {
      console.error('EasyBIS appointment fetch error:', error);
      throw error;
    }
  }

  /**
   * Create appointment in EasyBIS
   */
  async createEasyBISAppointment(appointment: EasyBISAppointment): Promise<any> {
    try {
      console.log('📤 Creating appointment in EasyBIS...');

      const response = await fetch(`${this.easyBISConfig.apiEndpoint}/appointments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.easyBISConfig.apiKey}`,
          'Content-Type': 'application/json',
          'X-Practice-ID': this.easyBISConfig.practiceId
        },
        body: JSON.stringify(appointment)
      });

      if (!response.ok) {
        throw new Error(`EasyBIS API error: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('EasyBIS appointment creation error:', error);
      throw error;
    }
  }

  /**
   * Update appointment in EasyBIS
   */
  async updateEasyBISAppointment(appointmentId: string, appointment: Partial<EasyBISAppointment>): Promise<any> {
    try {
      console.log(`📤 Updating appointment ${appointmentId} in EasyBIS...`);

      const response = await fetch(`${this.easyBISConfig.apiEndpoint}/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.easyBISConfig.apiKey}`,
          'Content-Type': 'application/json',
          'X-Practice-ID': this.easyBISConfig.practiceId
        },
        body: JSON.stringify(appointment)
      });

      if (!response.ok) {
        throw new Error(`EasyBIS API error: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('EasyBIS appointment update error:', error);
      throw error;
    }
  }

  /**
   * Get treatment plans from EasyBIS
   */
  async getTreatmentPlans(patientId: string): Promise<any[]> {
    try {
      console.log(`🔄 Fetching treatment plans for patient ${patientId}...`);

      const response = await fetch(`${this.easyBISConfig.apiEndpoint}/patients/${patientId}/treatment-plans`, {
        headers: {
          'Authorization': `Bearer ${this.easyBISConfig.apiKey}`,
          'Content-Type': 'application/json',
          'X-Practice-ID': this.easyBISConfig.practiceId
        }
      });

      if (!response.ok) {
        throw new Error(`EasyBIS API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.treatment_plans;
    } catch (error) {
      console.error('EasyBIS treatment plan fetch error:', error);
      throw error;
    }
  }

  /**
   * Create treatment plan in EasyBIS
   */
  async createTreatmentPlan(patientId: string, treatmentPlan: any): Promise<any> {
    try {
      console.log(`📤 Creating treatment plan for patient ${patientId}...`);

      const response = await fetch(`${this.easyBISConfig.apiEndpoint}/patients/${patientId}/treatment-plans`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.easyBISConfig.apiKey}`,
          'Content-Type': 'application/json',
          'X-Practice-ID': this.easyBISConfig.practiceId
        },
        body: JSON.stringify(treatmentPlan)
      });

      if (!response.ok) {
        throw new Error(`EasyBIS API error: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('EasyBIS treatment plan creation error:', error);
      throw error;
    }
  }

  /**
   * Get chiropractic notes from EasyBIS
   */
  async getChiropracticNotes(patientId: string): Promise<any[]> {
    try {
      console.log(`🔄 Fetching chiropractic notes for patient ${patientId}...`);

      const response = await fetch(`${this.easyBISConfig.apiEndpoint}/patients/${patientId}/chiropractic-notes`, {
        headers: {
          'Authorization': `Bearer ${this.easyBISConfig.apiKey}`,
          'Content-Type': 'application/json',
          'X-Practice-ID': this.easyBISConfig.practiceId
        }
      });

      if (!response.ok) {
        throw new Error(`EasyBIS API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.chiropractic_notes;
    } catch (error) {
      console.error('EasyBIS chiropractic notes fetch error:', error);
      throw error;
    }
  }

  /**
   * Create chiropractic note in EasyBIS
   */
  async createChiropracticNote(patientId: string, note: any): Promise<any> {
    try {
      console.log(`📤 Creating chiropractic note for patient ${patientId}...`);

      const response = await fetch(`${this.easyBISConfig.apiEndpoint}/patients/${patientId}/chiropractic-notes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.easyBISConfig.apiKey}`,
          'Content-Type': 'application/json',
          'X-Practice-ID': this.easyBISConfig.practiceId
        },
        body: JSON.stringify(note)
      });

      if (!response.ok) {
        throw new Error(`EasyBIS API error: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('EasyBIS chiropractic note creation error:', error);
      throw error;
    }
  }

  /**
   * Test EasyBIS connection
   */
  async testConnection(): Promise<boolean> {
    try {
      console.log('🔍 Testing EasyBIS connection...');

      const response = await fetch(`${this.easyBISConfig.apiEndpoint}/health`, {
        headers: {
          'Authorization': `Bearer ${this.easyBISConfig.apiKey}`,
          'Content-Type': 'application/json',
          'X-Practice-ID': this.easyBISConfig.practiceId
        }
      });

      if (response.ok) {
        console.log('✅ EasyBIS connection successful');
        return true;
      } else {
        console.log('❌ EasyBIS connection failed');
        return false;
      }
    } catch (error) {
      console.error('EasyBIS connection test error:', error);
      return false;
    }
  }
} 