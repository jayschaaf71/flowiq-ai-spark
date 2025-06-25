
import { supabase } from '@/integrations/supabase/client';
import { hipaaComplianceCore } from './hipaaComplianceCore';

export interface EHRConnection {
  id: string;
  name: string;
  type: 'epic' | 'cerner' | 'allscripts' | 'athenahealth' | 'nextgen';
  status: 'connected' | 'disconnected' | 'error';
  lastSync: Date;
  endpoint: string;
  credentials: {
    clientId: string;
    clientSecret: string;
    accessToken?: string;
    refreshToken?: string;
  };
}

export interface EHRSyncResult {
  success: boolean;
  patientsUpdated: number;
  appointmentsUpdated: number;
  errorsEncountered: string[];
  lastSyncTime: Date;
}

class EHRIntegrationService {
  async getEHRConnections(): Promise<EHRConnection[]> {
    // Mock EHR connections - in production would fetch from database
    return [
      {
        id: 'ehr-1',
        name: 'Epic MyChart',
        type: 'epic',
        status: 'connected',
        lastSync: new Date(),
        endpoint: 'https://api.epic.com/fhir/r4',
        credentials: {
          clientId: 'epic_client_123',
          clientSecret: 'encrypted_secret',
          accessToken: 'bearer_token_123'
        }
      }
    ];
  }

  async syncPatientData(ehrId: string): Promise<EHRSyncResult> {
    console.log('Starting HIPAA-compliant patient data sync from EHR:', ehrId);
    
    try {
      // Get EHR connection details
      const connections = await this.getEHRConnections();
      const connection = connections.find(c => c.id === ehrId);
      
      if (!connection) {
        throw new Error('EHR connection not found');
      }

      // Simulate fetching patient data from EHR
      const ehrPatientData = await this.fetchEHRPatientData(connection);
      
      // Use HIPAA compliance core to process sensitive data
      const processedData = await hipaaComplianceCore.processIncomingData(
        ehrPatientData,
        'ehr_sync',
        connection.id
      );

      // Update local patient records
      let patientsUpdated = 0;
      for (const patientData of processedData.sanitizedData) {
        await this.updatePatientRecord(patientData);
        patientsUpdated++;
      }

      return {
        success: true,
        patientsUpdated,
        appointmentsUpdated: 0,
        errorsEncountered: [],
        lastSyncTime: new Date()
      };
    } catch (error) {
      console.error('EHR sync failed:', error);
      return {
        success: false,
        patientsUpdated: 0,
        appointmentsUpdated: 0,
        errorsEncountered: [error.message],
        lastSyncTime: new Date()
      };
    }
  }

  private async fetchEHRPatientData(connection: EHRConnection): Promise<any[]> {
    // Mock EHR API call - in production would make actual API calls
    return [
      {
        id: 'ehr_patient_123',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1980-01-15',
        phone: '555-0123',
        email: 'john.doe@email.com',
        address: {
          line1: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zipCode: '12345'
        }
      }
    ];
  }

  private async updatePatientRecord(patientData: any): Promise<void> {
    // Update or create patient record in local database
    const { data: existingPatient } = await supabase
      .from('patients')
      .select('id')
      .eq('email', patientData.email)
      .single();

    if (existingPatient) {
      // Update existing patient
      await supabase
        .from('patients')
        .update({
          first_name: patientData.firstName,
          last_name: patientData.lastName,
          phone: patientData.phone,
          address_line1: patientData.address?.line1,
          city: patientData.address?.city,
          state: patientData.address?.state,
          zip_code: patientData.address?.zipCode,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingPatient.id);
    } else {
      // Create new patient
      await supabase
        .from('patients')
        .insert({
          first_name: patientData.firstName,
          last_name: patientData.lastName,
          email: patientData.email,
          phone: patientData.phone,
          date_of_birth: patientData.dateOfBirth,
          address_line1: patientData.address?.line1,
          city: patientData.address?.city,
          state: patientData.address?.state,
          zip_code: patientData.address?.zipCode
        });
    }
  }

  async testEHRConnection(ehrId: string): Promise<boolean> {
    try {
      const connections = await this.getEHRConnections();
      const connection = connections.find(c => c.id === ehrId);
      
      if (!connection) {
        return false;
      }

      // Mock connection test
      console.log('Testing EHR connection to:', connection.endpoint);
      return true;
    } catch (error) {
      console.error('EHR connection test failed:', error);
      return false;
    }
  }
}

export const ehrIntegrationService = new EHRIntegrationService();
