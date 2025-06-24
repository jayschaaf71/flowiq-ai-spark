
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Denial {
  id: string;
  claim_id: string;
  denial_date: string;
  denial_amount: number;
  appeal_status: string;
  notes?: string;
  auto_correction_attempted: boolean;
  auto_correction_success: boolean;
  // Joined data
  claim_number?: string;
  patient_name?: string;
  denial_reason?: string;
  is_auto_correctable?: boolean;
}

export const useDenialData = () => {
  const [denials, setDenials] = useState<Denial[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchDenials = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('claim_denials')
        .select(`
          *,
          claims!inner(claim_number, patients(first_name, last_name)),
          denial_reasons(description, is_auto_correctable)
        `)
        .order('denial_date', { ascending: false });

      if (error) throw error;

      const transformedDenials = data?.map(denial => ({
        ...denial,
        claim_number: denial.claims.claim_number,
        patient_name: `${denial.claims.patients.first_name} ${denial.claims.patients.last_name}`,
        denial_reason: denial.denial_reasons?.description,
        is_auto_correctable: denial.denial_reasons?.is_auto_correctable
      })) || [];

      setDenials(transformedDenials);
    } catch (err) {
      console.error('Error fetching denials:', err);
      toast({
        title: "Error fetching denials",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const processAutoCorrection = async (denialId: string) => {
    try {
      const { error } = await supabase
        .from('claim_denials')
        .update({ 
          auto_correction_attempted: true,
          auto_correction_success: true // Simplified for demo
        })
        .eq('id', denialId);

      if (error) throw error;

      toast({
        title: "Auto-correction Started",
        description: "AI is processing the denial correction",
      });

      await fetchDenials(); // Refresh data
    } catch (err) {
      console.error('Error processing auto-correction:', err);
      toast({
        title: "Auto-correction Failed",
        description: "Please try manual correction",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchDenials();
  }, []);

  return {
    denials,
    loading,
    refetch: fetchDenials,
    processAutoCorrection
  };
};
