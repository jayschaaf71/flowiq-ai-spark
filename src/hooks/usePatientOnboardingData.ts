
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PatientWithOnboarding {
  id: string;
  patient_number: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  phone: string;
  email: string;
  address_line1: string;
  city: string;
  state: string;
  zip_code: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relationship: string;
  onboarding_completed_at: string;
  onboarding_submission_id: string;
  onboarding_data: any;
  onboarding_summary: string;
  onboarding_status: string;
  onboarding_date: string;
  created_at: string;
  updated_at: string;
}

export const usePatientOnboardingData = (patientId?: string) => {
  return useQuery({
    queryKey: ['patient-onboarding-data', patientId],
    queryFn: async () => {
      if (!patientId) return null;
      
      const { data, error } = await supabase
        .from('patient_onboarding_summary')
        .select('*')
        .eq('id', patientId)
        .single();

      if (error) throw error;
      return data as PatientWithOnboarding;
    },
    enabled: !!patientId,
  });
};

export const useAllPatientsWithOnboarding = () => {
  return useQuery({
    queryKey: ['all-patients-onboarding-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('patient_onboarding_summary')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PatientWithOnboarding[];
    },
  });
};
