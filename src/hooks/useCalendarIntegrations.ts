import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CalendarIntegration {
  id: string;
  provider: string;
  provider_account_id: string;
  calendar_name: string;
  is_primary: boolean;
  sync_enabled: boolean;
  sync_direction: string;
  last_sync_at: string | null;
  created_at: string;
}

interface SyncResult {
  success: boolean;
  syncLogId?: string;
  appointmentsProcessed?: number;
  appointmentsCreated?: number;
  appointmentsUpdated?: number;
  error?: string;
}

export const useCalendarIntegrations = () => {
  const [integrations, setIntegrations] = useState<CalendarIntegration[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState<string | null>(null);

  const fetchIntegrations = async () => {
    try {
      console.log('FetchIntegrations: Starting fetch...');

      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError) {
        console.error('FetchIntegrations: Auth error:', authError);
        return;
      }

      if (!user) {
        console.error('FetchIntegrations: No user found');
        return;
      }

      console.log('FetchIntegrations: User authenticated:', user.id);

      // Fetch integrations for this user
      const { data: integrations, error } = await supabase
        .from('calendar_integrations')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('FetchIntegrations: Database error:', error);
        return;
      }

      console.log('FetchIntegrations: Retrieved integrations:', integrations);
      setIntegrations(integrations || []);
    } catch (error) {
      console.error('FetchIntegrations: Unexpected error:', error);
    }
  };

  const syncCalendar = async (integrationId: string): Promise<SyncResult> => {
    setSyncing(integrationId);
    try {
      const { data, error } = await supabase.functions.invoke('calendar-sync', {
        body: {
          integrationId,
          syncType: 'bidirectional'
        }
      });

      if (error) throw error;

      await fetchIntegrations(); // Refresh the list

      if (data?.success) {
        toast.success(`Calendar synced successfully! ${data.appointmentsProcessed || 0} appointments processed.`);
      }

      return data;
    } catch (error) {
      console.error('Error syncing calendar:', error);
      toast.error(`Failed to sync calendar: ${error.message}`);
      return { success: false, error: error.message };
    } finally {
      setSyncing(null);
    }
  };

  const syncAllCalendars = async (): Promise<SyncResult[]> => {
    const enabledIntegrations = integrations.filter(i => i.sync_enabled);
    const results: SyncResult[] = [];

    for (const integration of enabledIntegrations) {
      const result = await syncCalendar(integration.id);
      results.push(result);
    }

    return results;
  };

  const updateIntegration = async (integrationId: string, updates: Partial<CalendarIntegration>) => {
    try {
      const { error } = await supabase
        .from('calendar_integrations')
        .update(updates)
        .eq('id', integrationId);

      if (error) throw error;

      await fetchIntegrations();
      toast.success('Integration settings updated');
    } catch (error) {
      console.error('Error updating integration:', error);
      toast.error('Failed to update integration settings');
    }
  };

  const deleteIntegration = async (integrationId: string) => {
    try {
      const { error } = await supabase
        .from('calendar_integrations')
        .delete()
        .eq('id', integrationId);

      if (error) throw error;

      await fetchIntegrations();
      toast.success('Calendar integration removed');
    } catch (error) {
      console.error('Error deleting integration:', error);
      toast.error('Failed to remove calendar integration');
    }
  };

  const connectCalendar = async (provider: 'google' | 'microsoft') => {
    try {
      // Try multiple redirect URIs to handle different configurations
      const REDIRECT_URIS = [
        'https://midwest-dental-sleep.flow-iq.ai/oauth/callback',
        'https://midwest-dental-sleep.flow-iq.ai/calendar-oauth',
        'https://jnpzabmqieceoqjypvve.supabase.co/functions/v1/calendar-oauth',
        'https://jnpzabmqieceoqjypvve.supabase.co/functions/v1/oauth'
      ];

      // Use the first redirect URI for now - we can update this based on your Google OAuth app configuration
      const REDIRECT_URI = REDIRECT_URIS[0];

      console.log(`🔍 Starting OAuth for ${provider}...`);
      console.log(`🔍 Redirect URI: ${REDIRECT_URI}`);
      console.log(`🔍 Current window location: ${window.location.origin}`);

      let authUrl = ''; // Declare authUrl variable

      if (provider === 'google') {
        const GOOGLE_CLIENT_ID = '428165981991-qqji21nori4avrc4mg3i08lc38fvhssl.apps.googleusercontent.com';
        authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
          `client_id=${GOOGLE_CLIENT_ID}&` +
          `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
          `response_type=code&` +
          `scope=${encodeURIComponent('https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile')}&` +
          `access_type=offline&` +
          `prompt=consent`;
      } else if (provider === 'microsoft') {
        const MICROSOFT_CLIENT_ID = 'aa9ca1ca-0389-4742-a310-f2e072baa660';
        authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` +
          `client_id=${MICROSOFT_CLIENT_ID}&` +
          `response_type=code&` +
          `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
          `scope=${encodeURIComponent('openid profile email https://graph.microsoft.com/Calendars.ReadWrite')}&` +
          `response_mode=query&` +
          `prompt=consent`;
      } else {
        throw new Error('Unsupported provider');
      }

      console.log(`🔍 Generated OAuth URL for ${provider}:`, authUrl);
      console.log(`🔍 Redirect URI being sent:`, REDIRECT_URI);
      console.log(`🔍 Available redirect URIs:`, REDIRECT_URIS);

      // Open OAuth flow in popup
      const popup = window.open(authUrl, 'calendar-oauth', 'width=500,height=600');

      if (!popup) {
        throw new Error('Popup blocked! Please allow popups for this site and try again.');
      }

      // Listen for popup messages
      return new Promise((resolve, reject) => {
        const messageListener = (event: MessageEvent) => {
          console.log('MessageListener: Received message:', event.data);
          console.log('MessageListener: Event origin:', event.origin);
          console.log('MessageListener: Expected origin:', window.location.origin);

          // Check origin for security
          if (event.origin !== window.location.origin) {
            console.log('MessageListener: Origin mismatch, ignoring');
            return;
          }

          // Check if this is a calendar OAuth message
          if (event.data && event.data.type && event.data.type.startsWith('calendar-oauth-')) {
            console.log('MessageListener: Processing calendar OAuth message:', event.data.type);

            if (event.data.type === 'calendar-oauth-success') {
              console.log('MessageListener: OAuth success received:', event.data);
              toast.success(`${event.data.provider} calendar connected successfully!`);
              // Refresh integrations after a short delay
              setTimeout(() => {
                console.log('MessageListener: Refreshing integrations after success');
                fetchIntegrations();
              }, 1000);
            } else if (event.data.type === 'calendar-oauth-error') {
              console.log('MessageListener: OAuth error received:', event.data);
              toast.error(`Failed to connect ${event.data.provider} calendar: ${event.data.error}`);
            }
          } else {
            console.log('MessageListener: Ignoring non-calendar message:', event.data);
          }
        };

        window.addEventListener('message', messageListener);

        // Check if popup was closed manually
        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed);
            window.removeEventListener('message', messageListener);
            reject(new Error('OAuth flow was cancelled'));
          }
        }, 1000);
      });
    } catch (error: any) {
      console.error('Error connecting calendar:', error);
      toast.error(`Failed to connect ${provider} calendar: ${error.message}`);
      throw error; // Re-throw error for component to handle
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  return {
    integrations,
    loading,
    syncing,
    fetchIntegrations,
    syncCalendar,
    syncAllCalendars,
    updateIntegration,
    deleteIntegration,
    connectCalendar
  };
};