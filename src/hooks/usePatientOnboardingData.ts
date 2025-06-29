
import { useState, useEffect } from 'react';
import { useErrorHandler } from '@/hooks/useErrorHandler';

export interface PatientOnboardingData {
  id: string;
  patient_id: string;
  patient_number: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  date_of_birth: string;
  gender?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  onboarding_step: string;
  completed: boolean;
  onboarding_completed_at?: string;
  onboarding_summary?: string;
  onboarding_data?: Record<string, any>;
  data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface PatientWithOnboarding extends PatientOnboardingData {
  onboarding_completed_at?: string;
}

export const usePatientOnboardingData = (patientId: string) => {
  const [data, setData] = useState<PatientOnboardingData | null>(null);
  const [loading, setLoading] = useState(true);
  const { handleError } = useErrorHandler();

  useEffect(() => {
    if (!patientId) {
      setLoading(false);
      return;
    }

    const fetchOnboardingData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Mock data with all required fields
        setData({
          id: patientId,
          patient_id: patientId,
          patient_number: 'P000001',
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com',
          phone: '555-0123',
          date_of_birth: '1985-06-15',
          gender: 'male',
          address_line1: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zip_code: '12345',
          emergency_contact_name: 'Jane Doe',
          emergency_contact_phone: '555-0456',
          emergency_contact_relationship: 'Spouse',
          onboarding_step: 'medical-history',
          completed: false,
          onboarding_completed_at: new Date().toISOString(),
          onboarding_summary: 'Patient completed initial intake with standard medical history.',
          onboarding_data: {
            personalInfo: { completed: true },
            medicalHistory: { 
              completed: false,
              allergies: ['Penicillin'],
              medications: ['Aspirin'],
              conditions: ['Hypertension']
            },
            insurance: { 
              completed: false,
              provider: 'Blue Cross',
              policyNumber: '12345',
              groupNumber: '67890'
            },
            consents: {
              treatment: true,
              privacy: true,
              financial: true,
              communication: true
            }
          },
          data: {
            personalInfo: { completed: true },
            medicalHistory: { completed: false },
            insurance: { completed: false }
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error fetching onboarding data:', error);
        handleError(error as Error, 'Failed to load onboarding data');
      } finally {
        setLoading(false);
      }
    };

    fetchOnboardingData();
  }, [patientId, handleError]);

  return {
    data,
    loading,
    isLoading: loading, // Add isLoading alias
    error: null
  };
};

export const useAllPatientsWithOnboarding = () => {
  const [data, setData] = useState<PatientWithOnboarding[]>([]);
  const [loading, setLoading] = useState(true);
  const { handleError } = useErrorHandler();

  useEffect(() => {
    const fetchPatientsWithOnboarding = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Mock patients data
        const mockPatients: PatientWithOnboarding[] = [
          {
            id: '1',
            patient_id: '1',
            patient_number: 'P000001',
            first_name: 'John',
            last_name: 'Doe',
            email: 'john@example.com',
            phone: '555-0123',
            date_of_birth: '1985-06-15',
            gender: 'male',
            address_line1: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            zip_code: '12345',
            emergency_contact_name: 'Jane Doe',
            emergency_contact_phone: '555-0456',
            onboarding_step: 'completed',
            completed: true,
            onboarding_completed_at: new Date().toISOString(),
            onboarding_summary: 'Patient completed full onboarding process.',
            data: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '2',
            patient_id: '2',
            patient_number: 'P000002',
            first_name: 'Jane',
            last_name: 'Smith',
            email: 'jane@example.com',
            phone: '555-0456',
            date_of_birth: '1990-03-22',
            gender: 'female',
            address_line1: '456 Oak Ave',
            city: 'Somewhere',
            state: 'NY',
            zip_code: '54321',
            onboarding_step: 'medical-history',
            completed: false,
            data: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
        
        setData(mockPatients);
      } catch (error) {
        console.error('Error fetching patients with onboarding:', error);
        handleError(error as Error, 'Failed to load patients');
      } finally {
        setLoading(false);
      }
    };

    fetchPatientsWithOnboarding();
  }, [handleError]);

  return {
    data,
    loading,
    isLoading: loading, // Add isLoading alias
    error: null
  };
};

export default usePatientOnboardingData;
