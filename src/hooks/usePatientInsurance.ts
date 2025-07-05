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

      // Mock insurance data since patient_insurance table doesn't exist
      console.log('Mock fetching patient insurance for user:', user.id);
      
      const mockInsuranceData: PatientInsurance[] = [
        {
          id: 'ins-1',
          patient_id: 'patient-1',
          insurance_provider_id: 'provider-1',
          policy_number: 'POL123456789',
          group_number: 'GRP001',
          subscriber_name: 'John Doe',
          subscriber_relationship: 'self',
          effective_date: '2024-01-01',
          expiration_date: '2024-12-31',
          copay_amount: 25,
          deductible_amount: 1000,
          is_primary: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          insurance_providers: {
            name: 'Blue Cross Blue Shield',
            phone: '1-800-555-0123',
            address: '123 Insurance Way, City, State 12345'
          }
        }
      ];

      setInsurance(mockInsuranceData);
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
      console.log('Mock updating insurance:', insuranceId, updates);

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