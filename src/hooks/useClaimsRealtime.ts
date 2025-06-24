
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useClaimsRealtime = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Set up real-time subscription for claims
    const claimsChannel = supabase
      .channel('claims-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'claims'
        },
        (payload) => {
          console.log('Claims change detected:', payload);
          queryClient.invalidateQueries({ queryKey: ['claims'] });
        }
      )
      .subscribe();

    // Set up real-time subscription for denials
    const denialsChannel = supabase
      .channel('denials-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'claim_denials'
        },
        (payload) => {
          console.log('Denials change detected:', payload);
          queryClient.invalidateQueries({ queryKey: ['denials'] });
        }
      )
      .subscribe();

    // Set up real-time subscription for revenue metrics
    const revenueChannel = supabase
      .channel('revenue-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'revenue_metrics'
        },
        (payload) => {
          console.log('Revenue metrics change detected:', payload);
          queryClient.invalidateQueries({ queryKey: ['revenue'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(claimsChannel);
      supabase.removeChannel(denialsChannel);
      supabase.removeChannel(revenueChannel);
    };
  }, [queryClient]);
};
