
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Provider {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  specialty: string;
  is_active: boolean;
  working_hours?: any;
  created_at: string;
  updated_at: string;
}

export const useProviders = () => {
  const { toast } = useToast();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('providers')
        .select('*')
        .eq('is_active', true)
        .order('first_name', { ascending: true });

      if (error) {
        console.error("Error loading providers:", error);
        toast({
          title: "Error",
          description: "Failed to load providers",
          variant: "destructive",
        });
        return;
      }

      setProviders(data || []);
    } catch (error) {
      console.error("Error loading providers:", error);
      toast({
        title: "Error",
        description: "Failed to load providers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    providers,
    loading,
    loadProviders
  };
};
