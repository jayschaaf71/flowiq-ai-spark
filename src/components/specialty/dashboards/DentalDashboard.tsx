import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Smile, 
  Users, 
  Calendar, 
  TrendingUp,
  Brain,
  Clock,
  ArrowRight,
  Shield,
  DollarSign,
  AlertTriangle,
  Target,
  Gauge,
  FileText,
  CheckCircle,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DentalDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Sample data based on General Dentistry requirements
  const dentalMetrics = {
    // Financial KPIs
    productionPerChairHour: { current: 540, target: 600, sparkline: [520, 535, 550, 540] },
    collectionRatio: { current: 92, threshold: 95 },
    unscheduledTreatment: { current: 68000, threshold: 75000 },
    
    // Clinical KPIs
    caseAcceptance: { current: 66, threshold: 60 },
    failedApptRate: { current: 3.8, threshold: 5 },
    
    // Operational KPIs
    hygieneRecallPastDue: { current: 12, threshold: 15 },
    chairUtilization: { current: 89, threshold: 85 },
    
    // Patient Engagement KPIs
    nps: { current: 78, threshold: 70 },
    newPatientSourceMix: {
      'Google Ads': 42,
      'Referrals': 28,
      'Website': 18,
      'Social Media': 12
    }
  };

  const getPerformanceColor = (current: number, threshold: number, isHigherBetter: boolean = true) => {
    const isGood = isHigherBetter ? current >= threshold : current <= threshold;
    return isGood ? "text-green-600" : "text-red-600";
  };

  const getPerformanceBadge = (current: number, threshold: number, isHigherBetter: boolean = true) => {
    const isGood = isHigherBetter ? current >= threshold : current <= threshold;
    return isGood ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  return (
    <div className="space-y-6">
      {/* Financial Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Production/Chair Hr</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-blue-700">
                  ${dentalMetrics.productionPerChairHour.current}
                </div>
                <Badge variant="secondary" className={getPerformanceBadge(dentalMetrics.productionPerChairHour.current, dentalMetrics.productionPerChairHour.target, true)}>
                  {Math.round((dentalMetrics.productionPerChairHour.current / dentalMetrics.productionPerChairHour.target) * 100)}%
                </Badge>
              </div>
              <Progress 
                value={(dentalMetrics.productionPerChairHour.current / dentalMetrics.productionPerChairHour.target) * 100} 
                className="h-2"
              />
              <p className="text-xs text-blue-600">Target: ${dentalMetrics.productionPerChairHour.target}/hr</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collection Ratio</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{dentalMetrics.collectionRatio.current}%</div>
            <div className="flex items-center gap-1">
              <ArrowDown className="h-3 w-3 text-red-600" />
              <p className="text-xs text-red-600">
                Below target ({dentalMetrics.collectionRatio.threshold}%)
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/financial?tab=treatment-plans')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unscheduled Treatment</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">${dentalMetrics.unscheduledTreatment.current.toLocaleString()}</div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-600" />
              <p className="text-xs text-green-600">
                Under threshold (${dentalMetrics.unscheduledTreatment.threshold.toLocaleString()})
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Case Acceptance</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{dentalMetrics.caseAcceptance.current}%</div>
            <div className="flex items-center gap-1">
              <ArrowUp className="h-3 w-3 text-green-600" />
              <p className="text-xs text-green-600">Above target ({dentalMetrics.caseAcceptance.threshold}%)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clinical & Operational Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-purple-600" />
              Failed Appt Rate
            </CardTitle>
            <CardDescription>Real-time appointment failures</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-purple-700">{dentalMetrics.failedApptRate.current}%</div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Good
                </Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-600 h-3 rounded-full transition-all duration-300" 
                  style={{ width: `${100 - (dentalMetrics.failedApptRate.current / dentalMetrics.failedApptRate.threshold) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-purple-600">Target: &lt; {dentalMetrics.failedApptRate.threshold}%</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              Hygiene Recall Past Due
            </CardTitle>
            <CardDescription>Daily hygiene tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-purple-700">{dentalMetrics.hygieneRecallPastDue.current}%</div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  Good
                </Badge>
              </div>
              <Progress value={100 - dentalMetrics.hygieneRecallPastDue.current} className="h-3" />
              <p className="text-sm text-purple-600">Target: &lt; {dentalMetrics.hygieneRecallPastDue.threshold}%</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-purple-600" />
              Chair Utilization
            </CardTitle>
            <CardDescription>Real-time chair usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-purple-700">{dentalMetrics.chairUtilization.current}%</div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  Excellent
                </Badge>
              </div>
              <Progress value={dentalMetrics.chairUtilization.current} className="h-3" />
              <p className="text-sm text-purple-600">Target: &gt; {dentalMetrics.chairUtilization.threshold}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patient Engagement Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-600" />
              Net Promoter Score
            </CardTitle>
            <CardDescription>Weekly patient satisfaction tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-orange-700">{dentalMetrics.nps.current}</div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  Above Target
                </Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-orange-600 h-3 rounded-full transition-all duration-300" 
                  style={{ width: `${(dentalMetrics.nps.current / 100) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-orange-600">Target: &gt; {dentalMetrics.nps.threshold}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-orange-600" />
              New Patient Sources
            </CardTitle>
            <CardDescription>Monthly source distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(dentalMetrics.newPatientSourceMix).map(([source, percentage]) => (
                <div key={source} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{source}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-orange-700 w-8">{percentage}%</span>
                  </div>
                </div>
              ))}
              <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800">
                  <AlertTriangle className="w-3 h-3 inline mr-1" />
                  Google Ads: 42% (watch for over-dependence)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Dental-Specific Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smile className="w-5 h-5 text-blue-600" />
              Dental Quick Actions
            </CardTitle>
            <CardDescription>Fast access to common dental workflows</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700" onClick={() => navigate('/schedule?type=cleaning')}>
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Cleaning
            </Button>
            <Button variant="outline" className="w-full justify-start border-blue-200 hover:bg-blue-50" onClick={() => navigate('/ehr?template=dental-exam')}>
              <FileText className="w-4 h-4 mr-2" />
              Create Dental Chart
            </Button>
            <Button variant="outline" className="w-full justify-start border-blue-200 hover:bg-blue-50" onClick={() => navigate('/agents/scribe')}>
              <Brain className="w-4 h-4 mr-2" />
              AI Imaging Analysis
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
              <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <ArrowDown className="w-4 h-4 text-red-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">Collection Ratio Below Target</p>
                  <p className="text-xs text-red-600">92% (target: 95%)</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-800">Production Per Hour Below Target</p>
                  <p className="text-xs text-yellow-600">$540 (target: $600)</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800">All Operational Metrics On Target</p>
                  <p className="text-xs text-green-600">Chair utilization and hygiene recalls performing well</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};