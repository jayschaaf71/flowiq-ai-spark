import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthProvider';
import { useToast } from '@/hooks/use-toast';

interface SessionInfo {
  id: string;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  last_activity: string;
  is_active: boolean;
}

export const useSessionSecurity = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [loading, setLoading] = useState(false);

  // Track session activity for HIPAA compliance
  const trackActivity = useCallback(async () => {
    if (!user) return;

    try {
      // Update last activity timestamp
      await supabase
        .from('user_sessions')
        .update({ 
          last_activity: new Date().toISOString() 
        })
        .eq('user_id', user.id)
        .eq('is_active', true);
    } catch (error) {
      console.error('Failed to track session activity:', error);
    }
  }, [user]);

  // Create new session record for HIPAA audit trail
  const createSession = useCallback(async () => {
    if (!user) return;

    try {
      const sessionToken = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 8); // 8 hour session

      await supabase
        .from('user_sessions')
        .insert({
          user_id: user.id,
          session_token: sessionToken,
          ip_address: null, // Will be populated by server
          user_agent: navigator.userAgent,
          expires_at: expiresAt.toISOString()
        });

      // Store session token in localStorage for tracking
      localStorage.setItem('session_token', sessionToken);
    } catch (error) {
      console.error('Failed to create session record:', error);
    }
  }, [user]);

  // Load user's active sessions
  const loadSessions = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('last_activity', { ascending: false });

      if (error) throw error;
      setSessions((data || []).map(session => ({
        id: session.id,
        ip_address: session.ip_address as string | null,
        user_agent: session.user_agent as string | null,
        created_at: session.created_at,
        last_activity: session.last_activity,
        is_active: session.is_active
      })));
    } catch (error) {
      console.error('Failed to load sessions:', error);
      toast({
        title: "Session Error",
        description: "Unable to load active sessions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // Terminate a specific session
  const terminateSession = useCallback(async (sessionId: string) => {
    try {
      await supabase
        .from('user_sessions')
        .update({ 
          is_active: false, 
          logout_reason: 'manual_termination' 
        })
        .eq('id', sessionId);

      await loadSessions();
      
      toast({
        title: "Session Terminated",
        description: "Session has been successfully terminated"
      });
    } catch (error) {
      console.error('Failed to terminate session:', error);
      toast({
        title: "Error",
        description: "Failed to terminate session",
        variant: "destructive"
      });
    }
  }, [loadSessions, toast]);

  // Terminate all other sessions (keep current)
  const terminateAllOtherSessions = useCallback(async () => {
    if (!user) return;

    try {
      const currentSessionToken = localStorage.getItem('session_token');
      
      const { error } = await supabase
        .from('user_sessions')
        .update({ 
          is_active: false, 
          logout_reason: 'bulk_termination' 
        })
        .eq('user_id', user.id)
        .neq('session_token', currentSessionToken || '');

      if (error) throw error;

      await loadSessions();
      
      toast({
        title: "Sessions Terminated",
        description: "All other sessions have been terminated"
      });
    } catch (error) {
      console.error('Failed to terminate other sessions:', error);
      toast({
        title: "Error",
        description: "Failed to terminate sessions",
        variant: "destructive"
      });
    }
  }, [user, loadSessions, toast]);

  // Auto-logout on session expiry
  const checkSessionExpiry = useCallback(async () => {
    if (!user) return;

    try {
      const currentSessionToken = localStorage.getItem('session_token');
      if (!currentSessionToken) return;

      const { data, error } = await supabase
        .from('user_sessions')
        .select('expires_at, is_active')
        .eq('session_token', currentSessionToken)
        .single();

      if (error || !data) return;

      const expiresAt = new Date(data.expires_at);
      const now = new Date();

      if (expiresAt < now || !data.is_active) {
        toast({
          title: "Session Expired",
          description: "Your session has expired. Please log in again.",
          variant: "destructive"
        });
        await signOut();
      }
    } catch (error) {
      console.error('Session expiry check failed:', error);
    }
  }, [user, signOut, toast]);

  // Setup activity tracking and session monitoring
  useEffect(() => {
    if (!user) return;

    // Create initial session
    createSession();

    // Track activity every 5 minutes
    const activityInterval = setInterval(trackActivity, 5 * 60 * 1000);

    // Check session expiry every minute
    const expiryInterval = setInterval(checkSessionExpiry, 60 * 1000);

    // Track user activity (mouse, keyboard)
    const handleActivity = () => trackActivity();
    
    document.addEventListener('mousemove', handleActivity);
    document.addEventListener('keypress', handleActivity);
    document.addEventListener('click', handleActivity);

    return () => {
      clearInterval(activityInterval);
      clearInterval(expiryInterval);
      document.removeEventListener('mousemove', handleActivity);
      document.removeEventListener('keypress', handleActivity);
      document.removeEventListener('click', handleActivity);
    };
  }, [user, createSession, trackActivity, checkSessionExpiry]);

  // Load sessions on mount
  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  return {
    sessions,
    loading,
    loadSessions,
    terminateSession,
    terminateAllOtherSessions,
    trackActivity
  };
};
