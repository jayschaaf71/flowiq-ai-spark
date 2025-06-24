
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
          claims!inner(
            claim_number,
            patients!inner(first_name, last_name)
          )
        `)
        .order('denial_date', { ascending: false });

      if (error) throw error;

      const transformedDenials: Denial[] = data?.map((denial: any) => ({
        id: denial.id,
        claim_id: denial.claim_id,
        denial_date: denial.denial_date,
        denial_amount: denial.denial_amount,
        appeal_status: denial.appeal_status,
        notes: denial.notes,
        auto_correction_attempted: denial.auto_correction_attempted,
        auto_correction_success: denial.auto_correction_success,
        claim_number: denial.claims.claim_number,
        patient_name: `${denial.claims.patients.first_name} ${denial.claims.patients.last_name}`,
        denial_reason: denial.denial_reason,
        is_auto_correctable: denial.is_auto_correctable
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
          auto_correction_success: Math.random() > 0.3 // 70% success rate for demo
        })
        .eq('id', denialId);

      if (error) throw error;

      // Update local state
      setDenials(prev => prev.map(denial => 
        denial.id === denialId 
          ? { 
              ...denial, 
              auto_correction_attempted: true,
              auto_correction_success: Math.random() > 0.3
            } 
          : denial
      ));

      toast({
        title: "Auto-correction Started",
        description: "AI is processing the denial correction",
      });
    } catch (err) {
      console.error('Error processing auto-correction:', err);
      toast({
        title: "Auto-correction Failed",
        description: "Please try manual correction",
        variant: "destructive"
      });
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    fetchDenials();

    const channel = supabase
      .channel('denials-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'claim_denials'
        },
        () => {
          fetchDenials();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    denials,
    loading,
    refetch: fetchDenials,
    processAutoCorrection
  };
};
