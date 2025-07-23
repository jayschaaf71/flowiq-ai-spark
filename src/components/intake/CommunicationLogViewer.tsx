
import React, { useState, useEffect, useMemo } from 'react';
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
  RefreshCw,
  AlertTriangle,
  Eye,
  ExternalLink
} from 'lucide-react';
import { CommunicationService } from '@/services/communicationService';
import { CommunicationHistoryFilters } from './CommunicationHistoryFilters';
import { CommunicationLogStats } from './CommunicationLogStats';

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
  metadata?: any;
}

interface CommunicationLogViewerProps {
  submissionId: string;
}

export const CommunicationLogViewer: React.FC<CommunicationLogViewerProps> = ({
  submissionId
}) => {
  const [logs, setLogs] = useState<CommunicationLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      const fetchedLogs = await CommunicationService.getCommunicationLogs(submissionId);
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
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchLogs, 30000);
    return () => clearInterval(interval);
  }, [submissionId]);

  // Filter logs based on search and filters
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      // Search filter
      const searchMatch = searchTerm === '' || 
        log.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.template_id.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const statusMatch = statusFilter === 'all' || log.status === statusFilter;

      // Type filter
      const typeMatch = typeFilter === 'all' || log.type === typeFilter;

      // Date range filter
      const logDate = new Date(log.created_at);
      const now = new Date();
      let dateMatch = true;

      if (dateRange !== 'all') {
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        switch (dateRange) {
          case 'today':
            dateMatch = logDate >= today;
            break;
          case 'week': {
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            dateMatch = logDate >= weekAgo;
            break;
          }
          case 'month': {
            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
            dateMatch = logDate >= monthAgo;
            break;
          }
          case 'quarter': {
            const quarterAgo = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
            dateMatch = logDate >= quarterAgo;
            break;
          }
        }
      }

      return searchMatch && statusMatch && typeMatch && dateMatch;
    });
  }, [logs, searchTerm, statusFilter, typeFilter, dateRange]);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: filteredLogs.length,
      sent: filteredLogs.filter(log => log.status === 'sent').length,
      pending: filteredLogs.filter(log => log.status === 'pending').length,
      failed: filteredLogs.filter(log => log.status === 'failed').length,
      delivered: filteredLogs.filter(log => log.status === 'delivered').length,
      emailCount: filteredLogs.filter(log => log.type === 'email').length,
      smsCount: filteredLogs.filter(log => log.type === 'sms').length,
    };
  }, [filteredLogs]);

  const activeFiltersCount = [
    searchTerm !== '',
    statusFilter !== 'all',
    typeFilter !== 'all',
    dateRange !== 'all'
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setTypeFilter('all');
    setDateRange('all');
  };

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
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      sent: 'bg-blue-100 text-blue-800 border-blue-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      failed: 'bg-red-100 text-red-800 border-red-200'
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
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CommunicationLogStats stats={stats} />
      
      <CommunicationHistoryFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        activeFiltersCount={activeFiltersCount}
        onClearFilters={clearFilters}
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Communication History ({filteredLogs.length})
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchLogs}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No communications found</p>
              {activeFiltersCount > 0 && (
                <Button
                  variant="link"
                  onClick={clearFilters}
                  className="mt-2"
                >
                  Clear filters to see all communications
                </Button>
              )}
            </div>
          ) : (
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 flex-1">
                        {log.type === 'email' ? (
                          <Mail className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        ) : (
                          <MessageSquare className="w-4 h-4 text-green-600 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-sm">
                            {log.type.toUpperCase()} to {log.recipient}
                          </span>
                          <div className="text-xs text-gray-500">
                            Template: {log.template_id}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
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

                    <div className="mb-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                        className="flex items-center gap-1 h-auto p-1"
                      >
                        <Eye className="w-3 h-3" />
                        {expandedLog === log.id ? 'Hide' : 'Show'} Message
                      </Button>
                      
                      {expandedLog === log.id && (
                        <div className="mt-2 p-3 bg-white rounded border">
                          <p className="text-sm whitespace-pre-wrap">{log.message}</p>
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-gray-500 space-y-1">
                      <div className="flex justify-between">
                        <span>Created: {formatDateTime(log.created_at)}</span>
                        {log.metadata?.email_id && (
                          <span className="text-blue-600">Email ID: {log.metadata.email_id}</span>
                        )}
                      </div>
                      {log.sent_at && (
                        <div>Sent: {formatDateTime(log.sent_at)}</div>
                      )}
                      {log.delivered_at && (
                        <div className="text-green-600">Delivered: {formatDateTime(log.delivered_at)}</div>
                      )}
                      {log.error_message && (
                        <div className="text-red-600 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Error: {log.error_message}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
