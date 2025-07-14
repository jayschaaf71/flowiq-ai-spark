import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Phone, Clock, User, MessageSquare, TrendingUp } from "lucide-react";
import { format } from "date-fns";

interface VoiceCall {
  id: string;
  call_id: string;
  call_type: string;
  call_status: string;
  call_duration: number;
  transcript: string;
  created_at: string;
  patient: {
    first_name: string;
    last_name: string;
    phone: string;
  };
  call_outcomes: {
    outcome_type: string;
    sentiment_label: string;
    ai_summary: string;
    confidence_score: number;
  }[];
}

interface VoiceCallListProps {
  onStatsUpdate: () => void;
}

export const VoiceCallList = ({ onStatsUpdate }: VoiceCallListProps) => {
  const { toast } = useToast();
  const [calls, setCalls] = useState<VoiceCall[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [outcomeFilter, setOutcomeFilter] = useState("all");

  useEffect(() => {
    fetchCalls();
  }, []);

  const fetchCalls = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('voice_calls')
        .select(`
          *,
          patient:patients!patient_id(first_name, last_name, phone),
          call_outcomes(outcome_type, sentiment_label, ai_summary, confidence_score)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      setCalls(data || []);
    } catch (error) {
      console.error('Error fetching calls:', error);
      toast({
        title: "Error",
        description: "Failed to load voice calls",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'qualified':
        return 'bg-green-100 text-green-800';
      case 'not_qualified':
        return 'bg-red-100 text-red-800';
      case 'callback_requested':
        return 'bg-yellow-100 text-yellow-800';
      case 'appointment_scheduled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'negative':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCalls = calls.filter(call => {
    const matchesSearch = 
      call.patient?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      call.patient?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      call.patient?.phone?.includes(searchTerm) ||
      call.call_id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || call.call_status === statusFilter;
    
    const matchesOutcome = outcomeFilter === "all" || 
      call.call_outcomes?.some(outcome => outcome.outcome_type === outcomeFilter);

    return matchesSearch && matchesStatus && matchesOutcome;
  });

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-lg">Loading calls...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Calls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search by patient name, phone, or call ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="sm:max-w-sm"
            />
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="no-answer">No Answer</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={outcomeFilter} onValueChange={setOutcomeFilter}>
              <SelectTrigger className="sm:w-48">
                <SelectValue placeholder="Filter by outcome" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Outcomes</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="not_qualified">Not Qualified</SelectItem>
                <SelectItem value="callback_requested">Callback Requested</SelectItem>
                <SelectItem value="appointment_scheduled">Appointment Scheduled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Call List */}
      <div className="grid gap-4">
        {filteredCalls.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Phone className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No calls found</h3>
              <p className="text-gray-500">
                {calls.length === 0 
                  ? "No voice calls have been recorded yet."
                  : "No calls match your current filters."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredCalls.map((call) => (
            <Card key={call.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">
                          {call.patient ? `${call.patient.first_name} ${call.patient.last_name}` : 'Unknown Caller'}
                        </span>
                      </div>
                      <Badge variant="outline">
                        {call.call_type}
                      </Badge>
                      <Badge 
                        variant="outline"
                        className={call.call_status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                      >
                        {call.call_status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="w-4 h-4" />
                          <span>{call.patient?.phone || 'No phone'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{formatDuration(call.call_duration)} • {format(new Date(call.created_at), 'MMM d, h:mm a')}</span>
                        </div>
                      </div>

                      {call.call_outcomes && call.call_outcomes.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            <Badge className={getOutcomeColor(call.call_outcomes[0].outcome_type)}>
                              {call.call_outcomes[0].outcome_type.replace('_', ' ')}
                            </Badge>
                            <Badge className={getSentimentColor(call.call_outcomes[0].sentiment_label)}>
                              {call.call_outcomes[0].sentiment_label}
                            </Badge>
                          </div>
                          {call.call_outcomes[0].confidence_score && (
                            <div className="text-sm text-muted-foreground">
                              Confidence: {Math.round(call.call_outcomes[0].confidence_score * 100)}%
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {call.call_outcomes && call.call_outcomes[0]?.ai_summary && (
                      <div className="bg-muted/50 rounded-lg p-3 mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="w-4 h-4" />
                          <span className="text-sm font-medium">AI Summary</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {call.call_outcomes[0].ai_summary}
                        </p>
                      </div>
                    )}

                    {call.transcript && (
                      <details className="mt-3">
                        <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                          View Transcript
                        </summary>
                        <div className="mt-2 p-3 bg-muted/30 rounded text-sm">
                          {call.transcript.substring(0, 500)}
                          {call.transcript.length > 500 && '...'}
                        </div>
                      </details>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};