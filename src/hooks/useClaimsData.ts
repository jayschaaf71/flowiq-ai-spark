
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Claim {
  id: string;
  patient_id: string;
  claim_number: string;
  service_date: string;
  total_amount: number;
  processing_status: string;
  ai_confidence_score?: number;
  days_in_ar?: number;
  created_at: string;
  // Patient info (joined)
  patient_name?: string;
  // Insurance info (joined)
  insurance_name?: string;
}

export const useClaimsData = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('claims')
        .select(`
          *,
          patients!inner(first_name, last_name),
          insurance_providers!inner(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedClaims: Claim[] = data?.map((claim: any) => ({
        id: claim.id,
        patient_id: claim.patient_id,
        claim_number: claim.claim_number,
        service_date: claim.service_date,
        total_amount: claim.total_amount || 0,
        processing_status: claim.processing_status || claim.status || 'draft',
        ai_confidence_score: claim.ai_confidence_score || 85,
        days_in_ar: claim.days_in_ar || 0,
        created_at: claim.created_at,
        patient_name: `${claim.patients.first_name} ${claim.patients.last_name}`,
        insurance_name: claim.insurance_providers.name
      })) || [];

      setClaims(transformedClaims);
    } catch (err) {
      console.error('Error fetching claims:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch claims');
      toast({
        title: "Error fetching claims",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateClaimStatus = async (claimId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('claims')
        .update({ 
          processing_status: status,
          ai_confidence_score: status === 'ai_processing' ? Math.floor(Math.random() * 20) + 80 : undefined
        })
        .eq('id', claimId);
      
      if (error) throw error;

      // Update local state
      setClaims(prev => prev.map(claim => 
        claim.id === claimId ? { 
          ...claim, 
          processing_status: status,
          ai_confidence_score: status === 'ai_processing' ? Math.floor(Math.random() * 20) + 80 : claim.ai_confidence_score
        } : claim
      ));

      toast({
        title: "Claim Updated",
        description: `Claim status changed to ${status}`,
      });
    } catch (err) {
      console.error('Error updating claim:', err);
      toast({
        title: "Update Failed",
        description: "Failed to update claim status",
        variant: "destructive"
      });
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    fetchClaims();

    const channel = supabase
      .channel('claims-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'claims'
        },
        () => {
          fetchClaims();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    claims,
    loading,
    error,
    refetch: fetchClaims,
    updateClaimStatus
  };
};
