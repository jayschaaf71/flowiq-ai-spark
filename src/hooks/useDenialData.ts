import { useState, useEffect } from 'react';
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
      
      // Mock denial data since claim_denials table doesn't exist
      const mockDenials: Denial[] = [
        {
          id: '1',
          claim_id: 'claim-1',
          denial_date: '2024-01-15',
          denial_amount: 250.00,
          appeal_status: 'pending',
          auto_correction_attempted: false,
          auto_correction_success: false,
          claim_number: 'CLM-2024-001',
          patient_name: 'John Smith',
          denial_reason: 'Prior authorization required',
          is_auto_correctable: true
        },
        {
          id: '2',
          claim_id: 'claim-2',
          denial_date: '2024-01-12',
          denial_amount: 150.00,
          appeal_status: 'in_progress',
          auto_correction_attempted: true,
          auto_correction_success: true,
          claim_number: 'CLM-2024-002',
          patient_name: 'Sarah Johnson',
          denial_reason: 'Incorrect procedure code',
          is_auto_correctable: true
        }
      ];

      setDenials(mockDenials);
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
      // Mock auto-correction process
      console.log('Processing auto-correction for denial:', denialId);

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

  // Initialize with mock data
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