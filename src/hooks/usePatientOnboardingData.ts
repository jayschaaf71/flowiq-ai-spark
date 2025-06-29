
import { useState, useEffect } from 'react';
import { useErrorHandler } from '@/hooks/useErrorHandler';

interface PatientOnboardingData {
  id: string;
  patient_id: string;
  onboarding_step: string;
  completed: boolean;
  data: Record<string, any>;
  created_at: string;
  updated_at: string;
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
        
        // Mock data
        setData({
          id: '1',
          patient_id: patientId,
          onboarding_step: 'medical-history',
          completed: false,
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
    error: null
  };
};

export default usePatientOnboardingData;
