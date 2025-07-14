import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Phone, 
  PhoneCall, 
  PhoneIncoming, 
  PhoneOutgoing,
  TrendingUp,
  Clock,
  Users,
  Activity
} from "lucide-react";

interface CallMetrics {
  totalCalls: number;
  qualifiedLeads: number;
  avgDuration: number;
  activeCalls: number;
}

interface RecentCall {
  id: string;
  patient_name: string;
  call_type: string;
  status: string;
  duration: number;
  created_at: string;
  outcome_type?: string;
  sentiment_label?: string;
  phone: string;
}

export const SalesIQDashboard = () => {
  const [metrics, setMetrics] = useState<CallMetrics>({
    totalCalls: 0,
    qualifiedLeads: 0,
    avgDuration: 0,
    activeCalls: 0
  });
  const [recentCalls, setRecentCalls] = useState<RecentCall[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCallMetrics = async () => {
    try {
      // Fetch total calls and calculate metrics
      const { data: calls, error: callsError } = await supabase
        .from('voice_calls')
        .select(`
          *,
          call_outcomes(outcome_type, sentiment_label),
          patients(first_name, last_name, phone)
        `)
        .order('created_at', { ascending: false });

      if (callsError) throw callsError;

      // Calculate metrics
      const totalCalls = calls?.length || 0;
      const qualifiedLeads = calls?.filter(call => 
        call.call_outcomes?.[0]?.outcome_type === 'qualified'
      ).length || 0;
      
      const completedCalls = calls?.filter(call => call.call_status === 'completed') || [];
      const avgDuration = completedCalls.length > 0 
        ? completedCalls.reduce((sum, call) => sum + (call.call_duration || 0), 0) / completedCalls.length
        : 0;
      
      const activeCalls = calls?.filter(call => 
        call.call_status === 'in_progress' || call.call_status === 'ringing'
      ).length || 0;

      setMetrics({
        totalCalls,
        qualifiedLeads,
        avgDuration: Math.round(avgDuration),
        activeCalls
      });

      // Format recent calls
      const formattedCalls: RecentCall[] = calls?.slice(0, 10).map(call => ({
        id: call.id,
        patient_name: call.patients 
          ? `${call.patients.first_name || ''} ${call.patients.last_name || ''}`.trim()
          : 'Unknown Patient',
        call_type: call.call_type || 'inbound',
        status: call.call_status || 'completed',
        duration: call.call_duration || 0,
        created_at: call.created_at,
        outcome_type: call.call_outcomes?.[0]?.outcome_type,
        sentiment_label: call.call_outcomes?.[0]?.sentiment_label,
        phone: call.patients?.phone || ''
      })) || [];

      setRecentCalls(formattedCalls);
    } catch (error) {
      console.error('Error fetching call metrics:', error);
      toast({
        title: "Error",
        description: "Failed to load call analytics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCallMetrics();

    // Set up real-time subscription for voice_calls
    const channel = supabase
      .channel('voice_calls_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'voice_calls'
        },
        () => {
          fetchCallMetrics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in_progress': return 'bg-blue-100 text-blue-700';
      case 'failed': return 'bg-red-100 text-red-700';
      case 'ringing': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'qualified': return 'bg-green-100 text-green-700';
      case 'interested': return 'bg-blue-100 text-blue-700';
      case 'not_interested': return 'bg-red-100 text-red-700';
      case 'callback': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-700';
      case 'neutral': return 'bg-gray-100 text-gray-700';
      case 'negative': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Sales iQ Analytics</h3>
          <p className="text-gray-600">Voice call performance and lead qualification insights</p>
        </div>
        <Button onClick={fetchCallMetrics} variant="outline">
          <Activity className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Calls</p>
                <p className="text-2xl font-bold">{metrics.totalCalls}</p>
              </div>
              <Phone className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Qualified Leads</p>
                <p className="text-2xl font-bold">{metrics.qualifiedLeads}</p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Duration</p>
                <p className="text-2xl font-bold">{formatDuration(metrics.avgDuration)}</p>
              </div>
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Calls</p>
                <p className="text-2xl font-bold">{metrics.activeCalls}</p>
              </div>
              <PhoneCall className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Calls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Calls
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentCalls.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Phone className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No call data available</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentCalls.map((call) => (
                <div key={call.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      {call.call_type === 'inbound' ? (
                        <PhoneIncoming className="w-4 h-4 text-blue-600" />
                      ) : (
                        <PhoneOutgoing className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{call.patient_name}</div>
                      <div className="text-sm text-gray-500">{call.phone}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(call.status)}>
                      {call.status}
                    </Badge>
                    
                    {call.outcome_type && (
                      <Badge className={getOutcomeColor(call.outcome_type)}>
                        {call.outcome_type}
                      </Badge>
                    )}
                    
                    {call.sentiment_label && (
                      <Badge className={getSentimentColor(call.sentiment_label)}>
                        {call.sentiment_label}
                      </Badge>
                    )}
                    
                    <div className="text-sm text-gray-500 min-w-0">
                      <div>{formatDuration(call.duration)}</div>
                      <div>{formatDate(call.created_at)}</div>
                    </div>
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