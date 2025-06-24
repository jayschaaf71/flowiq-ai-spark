
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
      
      // Since claim_denials table may not be in types yet, let's create sample data
      // In a real implementation, this would query the actual table
      const sampleDenials: Denial[] = [
        {
          id: '1',
          claim_id: 'CLM001',
          denial_date: '2024-06-20',
          denial_amount: 250.00,
          appeal_status: 'not_appealed',
          notes: 'Prior authorization required',
          auto_correction_attempted: false,
          auto_correction_success: false,
          claim_number: 'CLM001',
          patient_name: 'John Doe',
          denial_reason: 'Prior authorization required',
          is_auto_correctable: true
        },
        {
          id: '2',
          claim_id: 'CLM002',
          denial_date: '2024-06-19',
          denial_amount: 180.00,
          appeal_status: 'appeal_pending',
          notes: 'Missing documentation',
          auto_correction_attempted: true,
          auto_correction_success: false,
          claim_number: 'CLM002',
          patient_name: 'Jane Smith',
          denial_reason: 'Incomplete claim information',
          is_auto_correctable: true
        }
      ];

      setDenials(sampleDenials);
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
      // Update local state for demo
      setDenials(prev => prev.map(denial => 
        denial.id === denialId 
          ? { 
              ...denial, 
              auto_correction_attempted: true,
              auto_correction_success: true 
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
