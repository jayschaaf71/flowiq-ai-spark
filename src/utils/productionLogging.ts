
import { supabase } from '@/integrations/supabase/client';

export interface SecurityEvent {
  type: 'auth_failure' | 'permission_denied' | 'theme_error' | 'wrapper_error';
  message: string;
  metadata?: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export const logSecurityEvent = async (event: SecurityEvent) => {
  try {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Security Event:', event);
    }

    // Log to Supabase audit system
    const { error } = await supabase.rpc('log_security_event', {
      event_type: event.type,
      event_details: {
        message: event.message,
        severity: event.severity,
        metadata: event.metadata || {},
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        url: window.location.href
      }
    });

    if (error) {
      console.error('Failed to log security event:', error);
    }
  } catch (err) {
    console.error('Error logging security event:', err);
  }
};

export const logThemeError = (error: Error, specialty: string) => {
  logSecurityEvent({
    type: 'theme_error',
    message: `Theme loading failed for specialty: ${specialty}`,
    metadata: {
      error: error.message,
      specialty,
      stack: error.stack
    },
    severity: 'medium'
  });
};

export const logWrapperError = (error: Error, wrapper: string) => {
  logSecurityEvent({
    type: 'wrapper_error',
    message: `Wrapper error in ${wrapper}`,
    metadata: {
      error: error.message,
      wrapper,
      stack: error.stack
    },
    severity: 'medium'
  });
};

export const logAuthFailure = (reason: string, context?: Record<string, any>) => {
  logSecurityEvent({
    type: 'auth_failure',
    message: `Authentication failure: ${reason}`,
    metadata: context,
    severity: 'high'
  });
};

export const logPermissionDenied = (requiredRole: string, userRole: string, path: string) => {
  logSecurityEvent({
    type: 'permission_denied',
    message: `Permission denied - required: ${requiredRole}, user: ${userRole}`,
    metadata: {
      requiredRole,
      userRole,
      path,
      timestamp: new Date().toISOString()
    },
    severity: 'high'
  });
};
