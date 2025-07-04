import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface MedicalRecord {
  id: string;
  patient_id: string;
  provider_id?: string;
  record_type: string;
  title: string;
  content: string;
  diagnosis_codes?: string[];
  treatment_codes?: string[];
  visit_date: string;
  attachments?: any;
  is_confidential: boolean;
  created_at: string;
  updated_at: string;
  providers?: {
    first_name: string;
    last_name: string;
    title?: string;
    specialty?: string;
  } | null;
}

export const useMedicalRecords = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMedicalRecords = async () => {
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
        setRecords([]);
        return;
      }

      // Fetch medical records for this patient
      const { data, error } = await supabase
        .from('medical_records')
        .select(`
          *,
          providers:provider_id (
            first_name,
            last_name,
            title,
            specialty
          )
        `)
        .eq('patient_id', patientData.id)
        .order('visit_date', { ascending: false });

      if (error) throw error;

      setRecords((data as unknown as MedicalRecord[]) || []);
    } catch (error) {
      console.error('Error fetching medical records:', error);
      setError('Failed to load medical records');
      toast({
        title: "Error",
        description: "Failed to load your medical records",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicalRecords();
  }, [user]);

  return {
    records,
    loading,
    error,
    refetch: fetchMedicalRecords
  };
};