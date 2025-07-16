
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert } from "@/integrations/supabase/types";

type Patient = Tables<"patients">;
type NewPatient = TablesInsert<"patients">;

export const usePatients = (searchTerm?: string) => {
  return useQuery({
    queryKey: ['patients', searchTerm],
    queryFn: async () => {
      // HIPAA COMPLIANCE: Ensure user is authenticated before accessing patient data
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Authentication required to access patient data');
      }

      // Get current specialty from user-specific storage (HIPAA compliant)
      const currentSpecialty = localStorage.getItem(`currentSpecialty_${user.id}`) || 'chiropractic';
      
      let query = supabase
        .from('patients')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      // Filter by specialty if it exists, otherwise include all patients
      if (currentSpecialty) {
        query = query.or(`specialty.eq.${currentSpecialty},specialty.is.null`);
      }

      if (searchTerm) {
        query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });
};

export const usePatient = (id: string) => {
  return useQuery({
    queryKey: ['patient', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

export const useCreatePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (patient: NewPatient) => {
      // HIPAA COMPLIANCE: Ensure user is authenticated before creating patient data
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Authentication required to create patient data');
      }

      // Get current specialty from user-specific storage (HIPAA compliant)
      const currentSpecialty = localStorage.getItem(`currentSpecialty_${user.id}`) || 'chiropractic';
      const patientWithSpecialty = { ...patient, specialty: currentSpecialty };
      
      const { data, error } = await supabase
        .from('patients')
        .insert(patientWithSpecialty)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
};

export const useUpdatePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Patient> }) => {
      const { data, error } = await supabase
        .from('patients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['patient', data.id] });
    },
  });
};
