
import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface SessionManagerProps {
  children: React.ReactNode;
}

export const SessionManager: React.FC<SessionManagerProps> = ({ children }) => {
  const { user, session } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user || !session) return;

    // HIPAA Compliance: Session timeout warning (25 minutes)
    const warningTimeout = setTimeout(() => {
      toast({
        title: "Session Timeout Warning",
        description: "Your session will expire in 5 minutes due to inactivity. Please save your work.",
        duration: 10000,
      });
    }, 25 * 60 * 1000);

    // HIPAA Compliance: Auto logout after 30 minutes of inactivity
    const logoutTimeout = setTimeout(() => {
      toast({
        title: "Session Expired",
        description: "You have been automatically logged out for security purposes.",
        variant: "destructive",
      });
      // The auth hook will handle the actual logout
    }, 30 * 60 * 1000);

    // Reset timeouts on user activity
    const resetTimeouts = () => {
      clearTimeout(warningTimeout);
      clearTimeout(logoutTimeout);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, resetTimeouts, true);
    });

    return () => {
      clearTimeout(warningTimeout);
      clearTimeout(logoutTimeout);
      events.forEach(event => {
        document.removeEventListener(event, resetTimeouts, true);
      });
    };
  }, [user, session, toast]);

  return <>{children}</>;
};
