
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SessionManagerProps {
  children: React.ReactNode;
}

export const SessionManager: React.FC<SessionManagerProps> = ({ children }) => {
  const { user, session } = useAuth();
  const { toast } = useToast();
  const [lastActivity, setLastActivity] = useState(Date.now());

  useEffect(() => {
    if (!user || !session) return;

    // Enhanced session monitoring with rate limiting check
    const checkSessionHealth = async () => {
      try {
        // Check if user session is still valid
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error || !currentSession) {
          toast({
            title: "Session Error",
            description: "Your session has expired. Please log in again.",
            variant: "destructive",
          });
          await supabase.auth.signOut();
          return;
        }

        // Auto-refresh token if needed (within 5 minutes of expiry)
        const expiresAt = new Date(currentSession.expires_at! * 1000);
        const now = new Date();
        const minutesUntilExpiry = (expiresAt.getTime() - now.getTime()) / (1000 * 60);
        
        if (minutesUntilExpiry < 5 && minutesUntilExpiry > 0) {
          await supabase.auth.refreshSession();
        }
      } catch (error) {
        console.error('Session health check failed:', error);
      }
    };

    // HIPAA Compliance: Session timeout warning (25 minutes)
    const warningTimeout = setTimeout(() => {
      const timeSinceActivity = Date.now() - lastActivity;
      if (timeSinceActivity >= 24 * 60 * 1000) { // 24 minutes of inactivity
        toast({
          title: "Session Timeout Warning",
          description: "Your session will expire in 5 minutes due to inactivity. Please save your work.",
          duration: 10000,
        });
      }
    }, 25 * 60 * 1000);

    // HIPAA Compliance: Auto logout after 30 minutes of inactivity
    const logoutTimeout = setTimeout(() => {
      const timeSinceActivity = Date.now() - lastActivity;
      if (timeSinceActivity >= 29 * 60 * 1000) { // 29 minutes of inactivity
        toast({
          title: "Session Expired",
          description: "You have been automatically logged out for security purposes.",
          variant: "destructive",
        });
        supabase.auth.signOut();
      }
    }, 30 * 60 * 1000);

    // Enhanced activity tracking
    const updateLastActivity = () => {
      setLastActivity(Date.now());
    };

    // Check session health every 5 minutes
    const healthCheckInterval = setInterval(checkSessionHealth, 5 * 60 * 1000);

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, updateLastActivity, true);
    });

    return () => {
      clearTimeout(warningTimeout);
      clearTimeout(logoutTimeout);
      clearInterval(healthCheckInterval);
      events.forEach(event => {
        document.removeEventListener(event, updateLastActivity, true);
      });
    };
  }, [user, session, toast, lastActivity]);

  return <>{children}</>;
};
