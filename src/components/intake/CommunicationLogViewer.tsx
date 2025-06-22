import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Mail, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  XCircle,
  RefreshCw
} from 'lucide-react';
import { CommunicationService } from '@/services/communicationService';

interface CommunicationLog {
  id: string;
  type: 'email' | 'sms';
  recipient: string;
  subject?: string;
  message: string;
  template_id: string;
  status: 'pending' | 'sent' | 'failed' | 'delivered';
  sent_at?: string;
  delivered_at?: string;
  error_message?: string;
  created_at: string;
}

interface CommunicationLogViewerProps {
  submissionId: string;
}

export const CommunicationLogViewer: React.FC<CommunicationLogViewerProps> = ({
  submissionId
}) => {
  const [logs, setLogs] = useState<CommunicationLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      const fetchedLogs = await CommunicationService.getCommunicationLogs(submissionId);
      // Type assertion to handle the database response
      const typedLogs = fetchedLogs.map(log => ({
        ...log,
        type: log.type as 'email' | 'sms',
        status: log.status as 'pending' | 'sent' | 'failed' | 'delivered'
      }));
      setLogs(typedLogs);
    } catch (error) {
      console.error('Failed to fetch communication logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [submissionId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'sent':
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      sent: 'bg-blue-100 text-blue-800',
      delivered: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800'
    };

    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Communication History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4">
            <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Communication History ({logs.length})
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchLogs}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No communications sent yet</p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="border rounded-lg p-4 bg-gray-50"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {log.type === 'email' ? (
                        <Mail className="w-4 h-4 text-blue-600" />
                      ) : (
                        <MessageSquare className="w-4 h-4 text-green-600" />
                      )}
                      <span className="font-medium">
                        {log.type.toUpperCase()} to {log.recipient}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(log.status)}
                      {getStatusBadge(log.status)}
                    </div>
                  </div>

                  {log.subject && (
                    <div className="mb-2">
                      <span className="text-sm font-medium text-gray-600">Subject: </span>
                      <span className="text-sm">{log.subject}</span>
                    </div>
                  )}

                  <div className="mb-2">
                    <span className="text-sm font-medium text-gray-600">Message: </span>
                    <p className="text-sm bg-white p-2 rounded border mt-1">
                      {log.message}
                    </p>
                  </div>

                  <div className="text-xs text-gray-500 space-y-1">
                    <div>Created: {formatDateTime(log.created_at)}</div>
                    {log.sent_at && (
                      <div>Sent: {formatDateTime(log.sent_at)}</div>
                    )}
                    {log.delivered_at && (
                      <div>Delivered: {formatDateTime(log.delivered_at)}</div>
                    )}
                    {log.error_message && (
                      <div className="text-red-600">Error: {log.error_message}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
