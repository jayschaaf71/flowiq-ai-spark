
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { preAppointmentScheduler } from '@/services/preAppointmentScheduler';
import { 
  Clock, 
  Play, 
  Pause, 
  Calendar, 
  Mail, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

export const PreAppointmentAutomation = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [scheduledSummaries, setScheduledSummaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    sent: 0,
    failed: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    loadScheduledSummaries();
  }, []);

  const loadScheduledSummaries = async () => {
    setLoading(true);
    try {
      const summaries = await preAppointmentScheduler.getScheduledSummaries();
      setScheduledSummaries(summaries);
      
      // Calculate stats
      const stats = summaries.reduce((acc, summary) => {
        acc.total++;
        acc[summary.status]++;
        return acc;
      }, { total: 0, pending: 0, sent: 0, failed: 0 });
      
      setStats(stats);
    } catch (error) {
      console.error('Error loading scheduled summaries:', error);
      toast({
        title: "Error",
        description: "Failed to load scheduled summaries",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleUpcoming = async () => {
    setLoading(true);
    try {
      await preAppointmentScheduler.scheduleUpcomingAppointmentSummaries();
      await loadScheduledSummaries();
      toast({
        title: "Success",
        description: "Upcoming appointment summaries have been scheduled",
      });
    } catch (error) {
      console.error('Error scheduling summaries:', error);
      toast({
        title: "Error",
        description: "Failed to schedule upcoming summaries",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProcessQueue = async () => {
    setLoading(true);
    try {
      await preAppointmentScheduler.processQueuedSummaries();
      await loadScheduledSummaries();
      toast({
        title: "Success",
        description: "Queued summaries have been processed",
      });
    } catch (error) {
      console.error('Error processing queue:', error);
      toast({
        title: "Error",
        description: "Failed to process queued summaries",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800 border-green-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Pre-Appointment Summary Automation</h3>
          <p className="text-sm text-gray-600">
            Automatically send patient summaries to providers 30 minutes before appointments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Switch 
            checked={isEnabled} 
            onCheckedChange={setIsEnabled}
            id="automation-enabled"
          />
          <label htmlFor="automation-enabled" className="text-sm font-medium">
            {isEnabled ? 'Enabled' : 'Disabled'}
          </label>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-gray-600">Total Scheduled</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.sent}</p>
                <p className="text-sm text-gray-600">Sent</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <XCircle className="w-8 h-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{stats.failed}</p>
                <p className="text-sm text-gray-600">Failed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Automation Controls</CardTitle>
          <CardDescription>
            Manage the automated pre-appointment summary system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={handleScheduleUpcoming}
              disabled={loading || !isEnabled}
              variant="outline"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Tomorrow's Summaries
            </Button>
            <Button
              onClick={handleProcessQueue}
              disabled={loading || !isEnabled}
            >
              <Play className="w-4 h-4 mr-2" />
              Process Queue Now
            </Button>
            <Button
              onClick={loadScheduledSummaries}
              disabled={loading}
              variant="outline"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Scheduled Summaries List */}
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Summaries</CardTitle>
          <CardDescription>
            View all scheduled pre-appointment summaries
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin" />
              <span className="ml-2">Loading...</span>
            </div>
          ) : scheduledSummaries.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No scheduled summaries found
            </div>
          ) : (
            <div className="space-y-3">
              {scheduledSummaries.map((summary: any) => (
                <div key={summary.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(summary.status)}
                    <div>
                      <p className="font-medium">
                        {summary.appointments?.title || 'Unknown Patient'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {summary.appointments?.appointment_type} - {summary.appointments?.date} at {summary.appointments?.time}
                      </p>
                      <p className="text-xs text-gray-500">
                        Summary scheduled for: {new Date(summary.scheduled_for).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(summary.status)}>
                      {summary.status}
                    </Badge>
                    <Mail className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
