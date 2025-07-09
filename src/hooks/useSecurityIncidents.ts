import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SecurityIncident {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  incident_type: string;
  detected_at: string;
  resolved_at?: string;
  assigned_to?: string;
  affected_systems?: string[];
  impact_level?: string;
  response_time_minutes?: number;
  resolution_time_minutes?: number;
  tenant_id?: string;
}

export const useSecurityIncidents = () => {
  const [incidents, setIncidents] = useState<SecurityIncident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIncidents = async () => {
    try {
      const { data, error } = await supabase
        .from('security_incidents')
        .select('*')
        .order('detected_at', { ascending: false });

      if (error) throw error;

      setIncidents((data || []) as SecurityIncident[]);
    } catch (err) {
      console.error('Error fetching security incidents:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch incidents');
    } finally {
      setLoading(false);
    }
  };

  const createIncident = async (incident: Omit<SecurityIncident, 'id' | 'detected_at'>) => {
    try {
      const { data, error } = await supabase
        .from('security_incidents')
        .insert(incident)
        .select()
        .single();

      if (error) throw error;

      setIncidents(prev => [data as SecurityIncident, ...prev]);
      return data;
    } catch (err) {
      console.error('Error creating security incident:', err);
      throw err;
    }
  };

  const updateIncidentStatus = async (id: string, status: SecurityIncident['status']) => {
    try {
      const { error } = await supabase
        .from('security_incidents')
        .update({ 
          status, 
          resolved_at: status === 'resolved' ? new Date().toISOString() : null 
        })
        .eq('id', id);

      if (error) throw error;

      setIncidents(prev => 
        prev.map(incident => 
          incident.id === id 
            ? { ...incident, status, resolved_at: status === 'resolved' ? new Date().toISOString() : incident.resolved_at }
            : incident
        )
      );
    } catch (err) {
      console.error('Error updating incident status:', err);
      throw err;
    }
  };

  const insertSampleIncidents = async () => {
    try {
      const sampleIncidents = [
        {
          title: 'Suspicious Login Activity',
          description: 'Multiple failed login attempts from unknown IP addresses targeting admin accounts',
          severity: 'high' as const,
          status: 'investigating' as const,
          incident_type: 'unauthorized_access',
          assigned_to: 'Security Team',
          affected_systems: ['Authentication Service', 'User Management'],
          impact_level: 'Medium',
          response_time_minutes: 15
        },
        {
          title: 'Database Query Anomaly',
          description: 'Unusual database access patterns detected in patient records table',
          severity: 'critical' as const,
          status: 'open' as const,
          incident_type: 'data_breach',
          assigned_to: 'Data Security Team',
          affected_systems: ['Primary Database', 'Patient Records'],
          impact_level: 'High',
          response_time_minutes: 5
        }
      ];

      const { error } = await supabase
        .from('security_incidents')
        .insert(sampleIncidents);

      if (error) throw error;

      fetchIncidents();
    } catch (err) {
      console.error('Error inserting sample incidents:', err);
    }
  };

  useEffect(() => {
    fetchIncidents();

    // Set up real-time updates
    const channel = supabase
      .channel('security-incidents-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'security_incidents'
      }, () => {
        fetchIncidents();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    incidents,
    loading,
    error,
    createIncident,
    updateIncidentStatus,
    insertSampleIncidents,
    refreshIncidents: fetchIncidents
  };
};