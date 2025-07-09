import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useSessionSecurity } from '@/hooks/useSessionSecurity';
import { format } from 'date-fns';
import { 
  Monitor, 
  Smartphone, 
  X, 
  Shield, 
  Clock,
  MapPin,
  AlertTriangle
} from 'lucide-react';

export const SessionManager: React.FC = () => {
  const { 
    sessions, 
    loading, 
    terminateSession, 
    terminateAllOtherSessions 
  } = useSessionSecurity();

  const getDeviceIcon = (userAgent: string | null) => {
    if (!userAgent) return <Monitor className="w-4 h-4" />;
    
    if (userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone')) {
      return <Smartphone className="w-4 h-4" />;
    }
    return <Monitor className="w-4 h-4" />;
  };

  const getDeviceInfo = (userAgent: string | null) => {
    if (!userAgent) return 'Unknown Device';
    
    if (userAgent.includes('Chrome')) return 'Chrome Browser';
    if (userAgent.includes('Firefox')) return 'Firefox Browser';
    if (userAgent.includes('Safari')) return 'Safari Browser';
    if (userAgent.includes('Edge')) return 'Edge Browser';
    
    return 'Unknown Browser';
  };

  const formatLastActivity = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      
      if (diffMinutes < 1) return 'Active now';
      if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
      if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} hours ago`;
      
      return format(date, 'MMM dd, yyyy');
    } catch {
      return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Shield className="w-6 h-6 animate-spin mr-2" />
        <span>Loading active sessions...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Active Sessions</h3>
          <p className="text-sm text-muted-foreground">
            Manage your active login sessions for security
          </p>
        </div>
        {sessions.length > 1 && (
          <Button 
            variant="destructive" 
            size="sm"
            onClick={terminateAllOtherSessions}
          >
            <X className="w-4 h-4 mr-2" />
            Terminate All Others
          </Button>
        )}
      </div>

      {sessions.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h4 className="font-medium mb-2">No Active Sessions</h4>
            <p className="text-sm text-muted-foreground">
              Your session data will appear here once you log in
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sessions.map((session, index) => (
            <Card key={session.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {getDeviceIcon(session.user_agent)}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">
                          {getDeviceInfo(session.user_agent)}
                        </h4>
                        {index === 0 && (
                          <Badge variant="default" className="text-xs">
                            Current Session
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatLastActivity(session.last_activity)}</span>
                        </div>
                        
                        {session.ip_address && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{session.ip_address}</span>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-xs text-muted-foreground">
                        Created: {format(new Date(session.created_at), 'MMM dd, yyyy HH:mm')}
                      </p>
                    </div>
                  </div>
                  
                  {index !== 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => terminateSession(session.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Separator />

      {/* Security Notice */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-orange-800">Security Notice</h4>
              <p className="text-sm text-orange-700 mt-1">
                For HIPAA compliance, all session activity is logged and monitored. 
                If you notice any unauthorized sessions, terminate them immediately 
                and contact your system administrator.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};