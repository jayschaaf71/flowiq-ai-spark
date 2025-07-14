import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { VoiceCallList } from "./VoiceCallList";
import { FollowUpTaskManager } from "./FollowUpTaskManager";
import { LeadScoreAnalytics } from "./LeadScoreAnalytics";
import { Phone, Users, TrendingUp, Clock } from "lucide-react";

interface DashboardStats {
  totalCalls: number;
  qualifiedLeads: number;
  pendingFollowUps: number;
  avgQualificationScore: number;
  callsToday: number;
  conversionRate: number;
}

export const VoiceCallDashboard = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats>({
    totalCalls: 0,
    qualifiedLeads: 0,
    pendingFollowUps: 0,
    avgQualificationScore: 0,
    callsToday: 0,
    conversionRate: 0
  });
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);
      
      // Get total calls
      const { count: totalCalls } = await supabase
        .from('voice_calls')
        .select('*', { count: 'exact', head: true });

      // Get qualified leads count
      const { count: qualifiedLeads } = await supabase
        .from('call_outcomes')
        .select('*', { count: 'exact', head: true })
        .eq('outcome_type', 'qualified');

      // Get pending follow-ups
      const { count: pendingFollowUps } = await supabase
        .from('follow_up_tasks')
        .select('*', { count: 'exact', head: true })
        .eq('task_status', 'pending');

      // Get today's calls
      const today = new Date().toISOString().split('T')[0];
      const { count: callsToday } = await supabase
        .from('voice_calls')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', `${today}T00:00:00`)
        .lt('created_at', `${today}T23:59:59`);

      // Get average qualification score
      const { data: scores } = await supabase
        .from('lead_scores')
        .select('score_value')
        .eq('score_type', 'qualification');

      const avgScore = scores?.length 
        ? scores.reduce((sum, score) => sum + score.score_value, 0) / scores.length 
        : 0;

      // Calculate conversion rate
      const conversionRate = totalCalls && qualifiedLeads 
        ? (qualifiedLeads / totalCalls) * 100 
        : 0;

      setStats({
        totalCalls: totalCalls || 0,
        qualifiedLeads: qualifiedLeads || 0,
        pendingFollowUps: pendingFollowUps || 0,
        avgQualificationScore: Math.round(avgScore),
        callsToday: callsToday || 0,
        conversionRate: Math.round(conversionRate)
      });

    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const processFollowUps = async () => {
    try {
      const { error } = await supabase.functions.invoke('process-follow-up-tasks', {
        body: { trigger: 'scheduled' }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Follow-up tasks processed successfully",
      });

      // Refresh stats
      fetchDashboardStats();
    } catch (error) {
      console.error('Error processing follow-ups:', error);
      toast({
        title: "Error",
        description: "Failed to process follow-up tasks",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Voice Call Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor call outcomes, lead qualification, and follow-up tasks
          </p>
        </div>
        <Button onClick={processFollowUps} className="bg-primary hover:bg-primary/90">
          <Clock className="w-4 h-4 mr-2" />
          Process Follow-ups
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCalls}</div>
            <p className="text-xs text-muted-foreground">
              {stats.callsToday} today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Qualified Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.qualifiedLeads}</div>
            <p className="text-xs text-muted-foreground">
              {stats.conversionRate}% conversion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Follow-ups</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingFollowUps}</div>
            <p className="text-xs text-muted-foreground">
              Tasks awaiting execution
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Lead Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgQualificationScore}</div>
            <p className="text-xs text-muted-foreground">
              Out of 100 points
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Call Overview</TabsTrigger>
          <TabsTrigger value="follow-ups">Follow-up Tasks</TabsTrigger>
          <TabsTrigger value="analytics">Lead Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <VoiceCallList onStatsUpdate={fetchDashboardStats} />
        </TabsContent>

        <TabsContent value="follow-ups" className="space-y-6">
          <FollowUpTaskManager onTaskUpdate={fetchDashboardStats} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <LeadScoreAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};