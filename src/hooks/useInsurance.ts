
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type InsuranceProvider = Tables<"insurance_providers">;
type PatientInsurance = Tables<"patient_insurance">;

export const useInsuranceProviders = () => {
  return useQuery({
    queryKey: ['insurance_providers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('insurance_providers')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });
};

export const usePatientInsurance = (patientId: string) => {
  return useQuery({
    queryKey: ['patient_insurance', patientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('patient_insurance')
        .select(`
          *,
          insurance_providers(name, phone, website)
        `)
        .eq('patient_id', patientId)
        .eq('is_active', true)
        .order('is_primary', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!patientId,
  });
};

export const useCreatePatientInsurance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (insurance: Omit<PatientInsurance, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('patient_insurance')
        .insert(insurance)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['patient_insurance', data.patient_id] });
    },
  });
};
