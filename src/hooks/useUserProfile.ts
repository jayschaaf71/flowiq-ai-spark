import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const useUserProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      console.log('Fetching user profile for:', user.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        throw error;
      }
      console.log('Fetched user profile:', data);
      return data;
    },
    enabled: !!user?.id,
    staleTime: 0, // Force fresh data every time
    gcTime: 0, // Don't cache the data
    refetchInterval: false, // Don't auto-refetch as it can cause issues
  });
};