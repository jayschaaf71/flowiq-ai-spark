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

      // Mock no patient record found since patients table doesn't have profile_id field
      console.log('Mock loading medical records for user:', user.id);
      
      // Return mock data since medical_records table doesn't exist or has limited data
      setRecords([
        {
          id: 'mock-record-1',
          patient_id: user.id,
          record_type: 'visit_note',
          title: 'Annual Check-up',
          content: 'Patient reports improvement with prescribed exercises',
          diagnosis_codes: ['M54.9'],
          treatment_codes: ['97110'],
          visit_date: new Date().toISOString(),
          attachments: null,
          is_confidential: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          providers: {
            first_name: 'Dr.',
            last_name: 'Smith',
            title: 'MD',
            specialty: 'General Practice'
          }
        }
      ]);
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