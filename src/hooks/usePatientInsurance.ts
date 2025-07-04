import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface PatientInsurance {
  id: string;
  patient_id: string;
  insurance_provider_id?: string;
  policy_number: string;
  group_number?: string;
  subscriber_name?: string;
  subscriber_relationship: string;
  effective_date?: string;
  expiration_date?: string;
  copay_amount?: number;
  deductible_amount?: number;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
  insurance_providers?: {
    name: string;
    phone?: string;
    address?: string;
  } | null;
}

export const usePatientInsurance = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [insurance, setInsurance] = useState<PatientInsurance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatientInsurance = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // First get the patient record for this user
      const { data: patientData, error: patientError } = await supabase
        .from('patients')
        .select('id')
        .eq('profile_id', user.id)
        .single();

      if (patientError || !patientData) {
        console.log('No patient record found for user');
        setInsurance([]);
        return;
      }

      // Fetch insurance information for this patient
      const { data, error } = await supabase
        .from('patient_insurance')
        .select(`
          *,
          insurance_providers:insurance_provider_id (
            name,
            phone,
            address,
            eligibility_phone
          )
        `)
        .eq('patient_id', patientData.id)
        .order('is_primary', { ascending: false });

      if (error) throw error;

      setInsurance((data as unknown as PatientInsurance[]) || []);
    } catch (error) {
      console.error('Error fetching patient insurance:', error);
      setError('Failed to load insurance information');
      toast({
        title: "Error",
        description: "Failed to load your insurance information",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateInsurance = async (insuranceId: string, updates: Partial<PatientInsurance>) => {
    try {
      const { error } = await supabase
        .from('patient_insurance')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', insuranceId);

      if (error) throw error;

      // Update local state
      setInsurance(prev => prev.map(ins => 
        ins.id === insuranceId 
          ? { ...ins, ...updates, updated_at: new Date().toISOString() }
          : ins
      ));

      toast({
        title: "Insurance Updated",
        description: "Your insurance information has been updated successfully",
      });
    } catch (error) {
      console.error('Error updating insurance:', error);
      toast({
        title: "Error",
        description: "Failed to update insurance information",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchPatientInsurance();
  }, [user]);

  return {
    insurance,
    loading,
    error,
    refetch: fetchPatientInsurance,
    updateInsurance
  };
};