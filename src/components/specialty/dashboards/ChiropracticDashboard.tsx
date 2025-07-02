
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useSpecialty } from '@/contexts/SpecialtyContext';
import { useNavigate } from 'react-router-dom';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';
import { 
  Activity, 
  Users, 
  Calendar, 
  TrendingUp,
  Stethoscope,
  Clock,
  DollarSign,
  AlertTriangle,
  Target,
  Star,
  ArrowUp,
  ArrowDown,
  Gauge
} from "lucide-react";

export const ChiropracticDashboard = () => {
  const navigate = useNavigate();
  const { data: metrics, isLoading, error } = useDashboardMetrics();
  const { config } = useSpecialty();
  
  // Sample data - in production this would come from real metrics
  const chiropracticMetrics = {
    // Financial KPIs
    dailyCollections: { current: 6800, goal: 7500, previous: 6200 },
    avgVisitValue: { current: 79, thirtyDayAvg: 85, change: -7.1 },
    daysInAR: { current: 28, threshold: 35 },
    
    // Clinical KPIs
    carePlanAdherence: { current: 86, threshold: 80 },
    painScoreImprovement: { current: 73, threshold: 70 },
    
    // Operational KPIs
    visitsPerProvider: { current: 26, target: 24 },
    avgWaitTime: { current: 8, threshold: 12 },
    
    // Patient Engagement KPIs
    newPatients: { current: 37, goal: 40 },
    reactivationRate: { current: 17, threshold: 15 },
    googleReviewAvg: { current: 4.7, threshold: 4.5 }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6">
        <p className="text-red-600">Error loading dashboard data</p>
      </div>
    );
  }

  const getPerformanceColor = (current: number, threshold: number, isHigherBetter: boolean = true) => {
    const isGood = isHigherBetter ? current >= threshold : current <= threshold;
    return isGood ? "text-green-600" : "text-red-600";
  };

  const getPerformanceIcon = (current: number, threshold: number, isHigherBetter: boolean = true) => {
    const isGood = isHigherBetter ? current >= threshold : current <= threshold;
    return isGood ? ArrowUp : ArrowDown;
  };

  return (
    <div className="space-y-6">
      {/* Financial Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Collections</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-green-700">
                  ${chiropracticMetrics.dailyCollections.current.toLocaleString()}
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {Math.round((chiropracticMetrics.dailyCollections.current / chiropracticMetrics.dailyCollections.goal) * 100)}%
                </Badge>
              </div>
              <Progress 
                value={(chiropracticMetrics.dailyCollections.current / chiropracticMetrics.dailyCollections.goal) * 100} 
                className="h-2"
              />
              <p className="text-xs text-green-600">
                Goal: ${chiropracticMetrics.dailyCollections.goal.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Visit Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">${chiropracticMetrics.avgVisitValue.current}</div>
            <div className="flex items-center gap-1">
              <ArrowDown className="h-3 w-3 text-red-600" />
              <p className="text-xs text-red-600">
                {Math.abs(chiropracticMetrics.avgVisitValue.change)}% vs 30-day avg (${chiropracticMetrics.avgVisitValue.thirtyDayAvg})
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Days in A/R</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-green-700">{chiropracticMetrics.daysInAR.current}</div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Good
              </Badge>
            </div>
            <p className="text-xs text-green-600">Target: &lt; {chiropracticMetrics.daysInAR.threshold} days</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/analytics')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Google Reviews</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{chiropracticMetrics.googleReviewAvg.current} ★</div>
            <p className="text-xs text-green-600">Above threshold ({chiropracticMetrics.googleReviewAvg.threshold})</p>
          </CardContent>
        </Card>
      </div>

      {/* Clinical Quality Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Care Plan Adherence
            </CardTitle>
            <CardDescription>Patient compliance with treatment plans</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-blue-700">{chiropracticMetrics.carePlanAdherence.current}%</div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  Above Target
                </Badge>
              </div>
              <Progress value={chiropracticMetrics.carePlanAdherence.current} className="h-3" />
              <p className="text-sm text-blue-600">Target: {chiropracticMetrics.carePlanAdherence.threshold}% minimum</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-blue-600" />
              Pain Score Improvement
            </CardTitle>
            <CardDescription>≥2 points reduction by 3rd visit</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-blue-700">{chiropracticMetrics.painScoreImprovement.current}%</div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  Good
                </Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                  style={{ width: `${chiropracticMetrics.painScoreImprovement.current}%` }}
                ></div>
              </div>
              <p className="text-sm text-blue-600">Target: {chiropracticMetrics.painScoreImprovement.threshold}% minimum</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operational & Patient Engagement Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Activity className="w-4 h-4 text-purple-600" />
              Visits/Provider/Day
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{chiropracticMetrics.visitsPerProvider.current}</div>
            <div className="flex items-center gap-1">
              <ArrowUp className="h-3 w-3 text-green-600" />
              <p className="text-xs text-green-600">Above target ({chiropracticMetrics.visitsPerProvider.target})</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-purple-600" />
              Avg Wait Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{chiropracticMetrics.avgWaitTime.current} min</div>
            <div className="flex items-center gap-1">
              <ArrowUp className="h-3 w-3 text-green-600" />
              <p className="text-xs text-green-600">Under target (&lt; {chiropracticMetrics.avgWaitTime.threshold} min)</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-orange-600" />
              New Patients MTD
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-orange-700">{chiropracticMetrics.newPatients.current}</div>
              <Badge variant="outline" className="border-orange-200 text-orange-800">
                {Math.round((chiropracticMetrics.newPatients.current / chiropracticMetrics.newPatients.goal) * 100)}%
              </Badge>
            </div>
            <p className="text-xs text-orange-600">Goal: {chiropracticMetrics.newPatients.goal}</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-green-600" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common chiropractic workflows</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-green-600 hover:bg-green-700" onClick={() => navigate('/schedule')}>
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Adjustment Session
            </Button>
            <Button variant="outline" className="w-full justify-start border-green-200 hover:bg-green-50" onClick={() => navigate('/ehr')}>
              <Activity className="w-4 h-4 mr-2" />
              Create SOAP Note
            </Button>
            <Button variant="outline" className="w-full justify-start border-green-200 hover:bg-green-50" onClick={() => navigate('/agents/scribe')}>
              <Stethoscope className="w-4 h-4 mr-2" />
              ScribeIQ Documentation
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              Performance Alerts
            </CardTitle>
            <CardDescription>Key metrics requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-800">Visit Value Below Average</p>
                  <p className="text-xs text-yellow-600">Current: $79 vs 30-day avg: $85</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <Users className="w-4 h-4 text-orange-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-orange-800">Reactivation Rate High</p>
                  <p className="text-xs text-orange-600">17% (target: &lt;15%)</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <Target className="w-4 h-4 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800">All Clinical Metrics On Target</p>
                  <p className="text-xs text-green-600">Care plans and outcomes performing well</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
