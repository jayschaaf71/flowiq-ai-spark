import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CalendarIntegration {
  id: string;
  provider: 'google' | 'microsoft' | 'apple';
  provider_account_id: string;
  calendar_name: string;
  is_primary: boolean;
  sync_enabled: boolean;
  sync_direction: 'unidirectional' | 'bidirectional';
  last_sync_at: string;
  created_at: string;
}

export const useCalendarIntegrations = () => {
  const [integrations, setIntegrations] = useState<CalendarIntegration[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch existing integrations
  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.log('User not authenticated, skipping fetch');
        return;
      }

      const { data, error } = await supabase
        .from('calendar_integrations')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching integrations:', error);
        setError(error.message);
        return;
      }

      console.log('Fetched integrations:', data);
      setIntegrations(data || []);
    } catch (err) {
      console.error('Error in fetchIntegrations:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Connect to calendar provider
  const connectCalendar = async (provider: 'google' | 'microsoft' | 'apple') => {
    try {
      setLoading(true);
      setError(null);

      // Get OAuth URL from Supabase function
      const { data, error } = await supabase.functions.invoke('calendar-oauth', {
        body: { 
          action: 'get_auth_url',
          provider,
          redirect_uri: `${window.location.origin}/oauth/callback`
        }
      });

      if (error) {
        console.error('Error getting auth URL:', error);
        setError(error.message);
        return;
      }

      if (!data?.auth_url) {
        setError('No auth URL received');
        return;
      }

      console.log('Redirecting to OAuth URL:', data.auth_url);
      
      // Store provider in sessionStorage for callback
      sessionStorage.setItem('oauth_provider', provider);
      
      // Redirect to OAuth URL
      window.location.href = data.auth_url;
      
    } catch (err) {
      console.error('Error connecting calendar:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  };

  // Disconnect calendar
  const disconnectCalendar = async (integrationId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('calendar_integrations')
        .delete()
        .eq('id', integrationId);

      if (error) {
        console.error('Error disconnecting calendar:', error);
        setError(error.message);
        return;
      }

      // Refresh integrations
      await fetchIntegrations();
    } catch (err) {
      console.error('Error disconnecting calendar:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Check if provider is connected
  const isConnected = (provider: 'google' | 'microsoft') => {
    return integrations.some(integration => integration.provider === provider);
  };

  // Get integration for provider
  const getIntegration = (provider: 'google' | 'microsoft') => {
    return integrations.find(integration => integration.provider === provider);
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  return {
    integrations,
    loading,
    error,
    connectCalendar,
    disconnectCalendar,
    isConnected,
    getIntegration,
    refreshIntegrations: fetchIntegrations
  };
};