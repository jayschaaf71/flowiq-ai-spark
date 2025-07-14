import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, TrendingDown, Target, Users } from "lucide-react";

interface LeadScore {
  id: string;
  score_type: string;
  score_value: number;
  calculated_at: string;
  patient: {
    first_name: string;
    last_name: string;
    phone: string;
  };
  voice_calls: {
    call_type: string;
    call_duration: number;
    call_outcomes: {
      outcome_type: string;
      sentiment_label: string;
    }[];
  };
}

interface ScoreStats {
  qualification: {
    average: number;
    count: number;
    trend: number;
  };
  engagement: {
    average: number;
    count: number;
    trend: number;
  };
  conversion_likelihood: {
    average: number;
    count: number;
    trend: number;
  };
}

export const LeadScoreAnalytics = () => {
  const { toast } = useToast();
  const [scores, setScores] = useState<LeadScore[]>([]);
  const [stats, setStats] = useState<ScoreStats>({
    qualification: { average: 0, count: 0, trend: 0 },
    engagement: { average: 0, count: 0, trend: 0 },
    conversion_likelihood: { average: 0, count: 0, trend: 0 }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchScores();
    fetchStats();
  }, []);

  const fetchScores = async () => {
    try {
      const { data, error } = await supabase
        .from('lead_scores')
        .select(`
          *,
          patient:patients!patient_id(first_name, last_name, phone),
          voice_calls!call_id(
            call_type,
            call_duration,
            call_outcomes(outcome_type, sentiment_label)
          )
        `)
        .order('calculated_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      setScores(data || []);
    } catch (error) {
      console.error('Error fetching scores:', error);
      toast({
        title: "Error",
        description: "Failed to load lead scores",
        variant: "destructive",
      });
    }
  };

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      
      // Get current period stats (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: currentPeriod, error: currentError } = await supabase
        .from('lead_scores')
        .select('score_type, score_value')
        .gte('calculated_at', thirtyDaysAgo.toISOString());

      if (currentError) throw currentError;

      // Get previous period stats (30-60 days ago)
      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
      
      const { data: previousPeriod, error: previousError } = await supabase
        .from('lead_scores')
        .select('score_type, score_value')
        .gte('calculated_at', sixtyDaysAgo.toISOString())
        .lt('calculated_at', thirtyDaysAgo.toISOString());

      if (previousError) throw previousError;

      // Calculate stats for each score type
      const scoreTypes = ['qualification', 'engagement', 'conversion_likelihood'];
      const newStats: ScoreStats = {
        qualification: { average: 0, count: 0, trend: 0 },
        engagement: { average: 0, count: 0, trend: 0 },
        conversion_likelihood: { average: 0, count: 0, trend: 0 }
      };

      scoreTypes.forEach(type => {
        const currentScores = currentPeriod?.filter(s => s.score_type === type) || [];
        const previousScores = previousPeriod?.filter(s => s.score_type === type) || [];

        const currentAvg = currentScores.length 
          ? currentScores.reduce((sum, s) => sum + s.score_value, 0) / currentScores.length 
          : 0;
        
        const previousAvg = previousScores.length 
          ? previousScores.reduce((sum, s) => sum + s.score_value, 0) / previousScores.length 
          : 0;

        const trend = previousAvg > 0 ? ((currentAvg - previousAvg) / previousAvg) * 100 : 0;

        newStats[type as keyof ScoreStats] = {
          average: Math.round(currentAvg),
          count: currentScores.length,
          trend: Math.round(trend)
        };
      });

      setStats(newStats);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: "Error",
        description: "Failed to load analytics",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Target className="w-4 h-4 text-gray-600" />;
  };

  const topQualifiedLeads = scores
    .filter(s => s.score_type === 'qualification')
    .sort((a, b) => b.score_value - a.score_value)
    .slice(0, 10);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-lg">Loading analytics...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Score Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Qualification Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.qualification.average}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {getTrendIcon(stats.qualification.trend)}
              <span>{Math.abs(stats.qualification.trend)}% from last month</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.qualification.count} leads scored
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Score</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.engagement.average}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {getTrendIcon(stats.engagement.trend)}
              <span>{Math.abs(stats.engagement.trend)}% from last month</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.engagement.count} interactions scored
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Likelihood</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversion_likelihood.average}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {getTrendIcon(stats.conversion_likelihood.trend)}
              <span>{Math.abs(stats.conversion_likelihood.trend)}% from last month</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.conversion_likelihood.count} predictions made
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Qualified Leads */}
      <Card>
        <CardHeader>
          <CardTitle>Top Qualified Leads</CardTitle>
          <CardDescription>
            Leads with the highest qualification scores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topQualifiedLeads.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No qualified leads found
              </div>
            ) : (
              topQualifiedLeads.map((score) => (
                <div key={score.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">
                      {score.patient ? `${score.patient.first_name} ${score.patient.last_name}` : 'Unknown Patient'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {score.patient?.phone}
                    </div>
                    {score.voice_calls?.call_outcomes?.[0] && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-muted px-2 py-1 rounded">
                          {score.voice_calls.call_outcomes[0].outcome_type.replace('_', ' ')}
                        </span>
                        <span className="text-xs bg-muted px-2 py-1 rounded">
                          {score.voice_calls.call_outcomes[0].sentiment_label}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getScoreColor(score.score_value)}`}>
                      {score.score_value}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Qualification Score
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Scores by Type */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Score Distribution</CardTitle>
          <CardDescription>
            Latest lead scores across all categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scores.slice(0, 20).map((score) => (
              <div key={score.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex-1">
                  <div className="font-medium">
                    {score.patient ? `${score.patient.first_name} ${score.patient.last_name}` : 'Unknown Patient'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {score.score_type.replace('_', ' ')} • {new Date(score.calculated_at).toLocaleDateString()}
                  </div>
                </div>
                <div className={`text-lg font-semibold ${getScoreColor(score.score_value)}`}>
                  {score.score_value}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};