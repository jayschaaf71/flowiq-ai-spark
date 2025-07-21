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
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('calendar_integrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setIntegrations(data || []);
    } catch (error) {
      console.error('Error fetching integrations:', error);
      toast.error('Failed to load calendar integrations');
    } finally {
      setLoading(false);
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
      // Get OAuth URL from edge function
      const { data, error } = await supabase.functions.invoke('calendar-oauth', {
        body: { 
          action: 'auth',
          provider 
        }
      });

      if (error) throw error;
      if (!data?.authUrl) throw new Error('No authorization URL received');
      
      // Open OAuth flow in popup
      const popup = window.open(data.authUrl, 'calendar-oauth', 'width=500,height=600');
      
      // Listen for popup messages
      return new Promise((resolve, reject) => {
        const messageListener = (event: MessageEvent) => {
          if (event.origin !== window.location.origin) return;
          
          if (event.data.type === 'calendar-oauth-success') {
            window.removeEventListener('message', messageListener);
            popup?.close();
            fetchIntegrations();
            toast.success('Calendar connected successfully!');
            resolve(event.data.integration);
          } else if (event.data.type === 'calendar-oauth-error') {
            window.removeEventListener('message', messageListener);
            popup?.close();
            reject(new Error(event.data.error));
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
    } catch (error) {
      console.error('Error connecting calendar:', error);
      toast.error(`Failed to connect ${provider} calendar: ${error.message}`);
      throw error;
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
