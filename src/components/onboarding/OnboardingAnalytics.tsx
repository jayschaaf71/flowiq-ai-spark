import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Clock, 
  Users, 
  CheckCircle, 
  TrendingUp, 
  AlertTriangle,
  Zap,
  Target,
  Award
} from 'lucide-react';

interface OnboardingMetrics {
  totalOnboardings: number;
  completionRate: number;
  averageCompletionTime: number;
  mostSkippedSteps: string[];
  assistantUsageRate: number;
  userSatisfactionScore: number;
  dropOffPoints: { step: string; percentage: number }[];
  peakOnboardingTimes: string[];
}

interface OnboardingAnalyticsProps {
  tenantId?: string;
  showRealTime?: boolean;
}

export const OnboardingAnalytics: React.FC<OnboardingAnalyticsProps> = ({ 
  tenantId, 
  showRealTime = true 
}) => {
  const [metrics, setMetrics] = useState<OnboardingMetrics>({
    totalOnboardings: 1247,
    completionRate: 87.3,
    averageCompletionTime: 12.5,
    mostSkippedSteps: ['team', 'payment', 'ehr'],
    assistantUsageRate: 94.2,
    userSatisfactionScore: 4.6,
    dropOffPoints: [
      { step: 'team', percentage: 8.2 },
      { step: 'payment', percentage: 4.5 },
      { step: 'ehr', percentage: 3.1 }
    ],
    peakOnboardingTimes: ['9 AM', '2 PM', '7 PM']
  });

  const [liveUpdates, setLiveUpdates] = useState(showRealTime);

  // Simulate real-time updates
  useEffect(() => {
    if (!liveUpdates) return;

    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        totalOnboardings: prev.totalOnboardings + Math.floor(Math.random() * 3),
        completionRate: Math.min(100, prev.completionRate + (Math.random() - 0.5) * 2),
        assistantUsageRate: Math.min(100, prev.assistantUsageRate + (Math.random() - 0.5) * 1)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [liveUpdates]);

  const getCompletionRateColor = (rate: number) => {
    if (rate >= 85) return 'text-success';
    if (rate >= 70) return 'text-warning';
    return 'text-destructive';
  };

  const getSatisfactionColor = (score: number) => {
    if (score >= 4.5) return 'text-success';
    if (score >= 4.0) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Onboarding Analytics</h2>
          <p className="text-muted-foreground">Track and optimize the client onboarding experience</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={liveUpdates ? 'default' : 'secondary'}>
            {liveUpdates ? 'Live' : 'Static'}
          </Badge>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setLiveUpdates(!liveUpdates)}
          >
            {liveUpdates ? 'Pause' : 'Resume'} Updates
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Onboardings</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalOnboardings.toLocaleString()}</div>
            <p className="text-xs text-success flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +23% this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getCompletionRateColor(metrics.completionRate)}`}>
              {metrics.completionRate.toFixed(1)}%
            </div>
            <Progress value={metrics.completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.averageCompletionTime} min</div>
            <p className="text-xs text-success flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              2 min faster than target
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Assistant Usage</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.assistantUsageRate.toFixed(1)}%</div>
            <Progress value={metrics.assistantUsageRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Satisfaction */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              User Experience Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Overall Satisfaction</span>
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${getSatisfactionColor(metrics.userSatisfactionScore)}`}>
                    {metrics.userSatisfactionScore}/5.0
                  </span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map(star => (
                      <div 
                        key={star}
                        className={`h-4 w-4 ${
                          star <= metrics.userSatisfactionScore 
                            ? 'text-warning' 
                            : 'text-muted-foreground'
                        }`}
                      >
                        ⭐
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Setup Clarity</span>
                  <span>92%</span>
                </div>
                <Progress value={92} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>AI Assistant Helpfulness</span>
                  <span>89%</span>
                </div>
                <Progress value={89} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Process Speed</span>
                  <span>94%</span>
                </div>
                <Progress value={94} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Drop-off Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Drop-off Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground mb-3">
                Steps where users most commonly exit the onboarding process
              </div>
              
              {metrics.dropOffPoints.map((point, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{point.step} Step</span>
                    <span className="text-destructive font-medium">
                      {point.percentage}% drop-off
                    </span>
                  </div>
                  <Progress value={point.percentage} className="h-2" />
                </div>
              ))}

              <div className="mt-4 p-3 bg-muted rounded-lg">
                <h4 className="text-sm font-medium mb-2">Recommendations</h4>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• Simplify team setup with bulk import options</li>
                  <li>• Add payment step skip with "setup later" option</li>
                  <li>• Provide EHR integration preview videos</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Most Skipped Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Most Skipped Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {metrics.mostSkippedSteps.map((step, index) => (
              <div key={step} className="text-center p-4 bg-muted rounded-lg">
                <div className="text-lg font-bold text-warning">#{index + 1}</div>
                <div className="text-sm font-medium capitalize">{step} Setup</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {(Math.random() * 30 + 15).toFixed(1)}% skip rate
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
            <h4 className="text-sm font-medium mb-2 text-primary">Optimization Tips</h4>
            <div className="text-xs text-primary/80 space-y-1">
              <p>• Team setup: Offer "invite later" option with email templates</p>
              <p>• Payment config: Provide trial period without payment setup</p>
              <p>• EHR integration: Add "manual data entry" alternative</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Peak Activity Times */}
      <Card>
        <CardHeader>
          <CardTitle>Peak Onboarding Times</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Most common start times:
            </div>
            {metrics.peakOnboardingTimes.map((time, index) => (
              <Badge key={time} variant="outline">
                {time}
              </Badge>
            ))}
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            Consider scheduling support staff availability during these peak times
          </div>
        </CardContent>
      </Card>
    </div>
  );
};