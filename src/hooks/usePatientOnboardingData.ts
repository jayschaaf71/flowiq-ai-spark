
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PatientWithOnboarding {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  date_of_birth: string;
  gender?: string;
  patient_number: string;
  onboarding_completed_at?: string;
  onboarding_summary?: string;
  created_at: string;
  updated_at: string;
}

export const useAllPatientsWithOnboarding = () => {
  return useQuery({
    queryKey: ['patients-with-onboarding'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('patients')
        .select(`
          id,
          first_name,
          last_name,
          email,
          phone,
          date_of_birth,
          gender,
          patient_number,
          onboarding_completed_at,
          created_at,
          updated_at
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching patients:', error);
        throw error;
      }

      // Add mock onboarding summary for demonstration
      const patientsWithSummary = data?.map(patient => ({
        ...patient,
        onboarding_summary: patient.onboarding_completed_at 
          ? 'Patient completed full intake process with medical history and insurance verification.'
          : undefined
      })) || [];

      return patientsWithSummary as PatientWithOnboarding[];
    },
  });
};
