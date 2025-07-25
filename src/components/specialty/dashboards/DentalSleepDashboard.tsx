
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useSpecialty } from '@/contexts/SpecialtyContext';
import { useNavigate } from 'react-router-dom';
import { 
  Moon, 
  Users, 
  Calendar, 
  TrendingUp,
  Stethoscope,
  Clock,
  DollarSign,
  Activity,
  Target,
  Gauge,
  AlertTriangle,
  CheckCircle,
  ArrowUp,
  ArrowDown
} from "lucide-react";

export const DentalSleepDashboard = () => {
  const navigate = useNavigate();
  
  console.log('DentalSleepDashboard: Component starting to render');
  
  const { config } = useSpecialty();
  
  console.log('DentalSleepDashboard: config loaded:', config);

  // Sample data based on Dental Sleep Medicine requirements
  const sleepMedicineMetrics = {
    // Financial KPIs
    deviceDeliveries: { current: 14, goal: 18 },
    reimbursementApproval: { current: 88, threshold: 85 },
    avgReimbursementPerCase: { current: 1900, quarterAvg: 2100, change: -9.5 },
    
    // Clinical KPIs
    avgAHIReduction: { current: -17, percentage: 62 },
    compliance4Hours: { current: 78, threshold: 75 },
    
    // Operational KPIs
    referralToScheduleDays: { current: 8, threshold: 10 },
    deviceDeliveryLeadTime: { current: 18, threshold: 21 },
    
    // Patient Engagement KPIs
    followUpNoShow: { current: 5.2, threshold: 7 },
    referralSourceMix: {
      'Sleep MD': 58,
      'Primary Care': 24,
      'Self-Referral': 12,
      'Other': 6
    }
  };

  return (
    <div className="space-y-6">
      {/* Financial Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card 
          className="border-blue-200 cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:border-blue-400"
          onClick={() => {
            console.log("Device Deliveries card clicked - navigating to dme-tracker");
            navigate('/dental-sleep/dme-tracker');
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Device Deliveries MTD</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-blue-700">{sleepMedicineMetrics.deviceDeliveries.current}</div>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  {Math.round((sleepMedicineMetrics.deviceDeliveries.current / sleepMedicineMetrics.deviceDeliveries.goal) * 100)}%
                </Badge>
              </div>
              <Progress value={(sleepMedicineMetrics.deviceDeliveries.current / sleepMedicineMetrics.deviceDeliveries.goal) * 100} className="h-2" />
              <p className="text-xs text-blue-600">Goal: {sleepMedicineMetrics.deviceDeliveries.goal}</p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="border-blue-200 cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:border-blue-400"
          onClick={() => {
            console.log("Reimbursement Approval card clicked - navigating to claims");
            navigate('/dental-sleep/claims');
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reimbursement Approval</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{sleepMedicineMetrics.reimbursementApproval.current}%</div>
            <div className="flex items-center gap-1">
              <ArrowUp className="h-3 w-3 text-green-600" />
              <p className="text-xs text-green-600">Above target ({sleepMedicineMetrics.reimbursementApproval.threshold}%)</p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="border-blue-200 cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:border-blue-400"
          onClick={() => {
            console.log("Avg Reimbursement/Case card clicked - navigating to insights");
            navigate('/dental-sleep/insights');
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Reimbursement/Case</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">${sleepMedicineMetrics.avgReimbursementPerCase.current.toLocaleString()}</div>
            <div className="flex items-center gap-1">
              <ArrowDown className="h-3 w-3 text-red-600" />
              <p className="text-xs text-red-600">{Math.abs(sleepMedicineMetrics.avgReimbursementPerCase.change)}% vs Q avg</p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="border-blue-200 cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:border-blue-400"
          onClick={() => {
            console.log("AHI Reduction card clicked - navigating to sleep-studies");
            navigate('/dental-sleep/sleep-studies');
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AHI Reduction</CardTitle>
            <Gauge className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{sleepMedicineMetrics.avgAHIReduction.current}</div>
            <p className="text-xs text-blue-600">(-{sleepMedicineMetrics.avgAHIReduction.percentage}% reduction)</p>
          </CardContent>
        </Card>
      </div>

      {/* Clinical & Operational Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card 
          className="border-purple-200 cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:border-purple-400"
          onClick={() => {
            console.log("Compliance card clicked - navigating to patient-management");
            navigate('/dental-sleep/patient-management');
          }}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-purple-600" />
              Compliance ≥4h/night
            </CardTitle>
            <CardDescription>30-day compliance tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-purple-700">{sleepMedicineMetrics.compliance4Hours.current}%</div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <ArrowUp className="w-3 h-3 mr-1" />Good
                </Badge>
              </div>
              <Progress value={sleepMedicineMetrics.compliance4Hours.current} className="h-3" />
              <p className="text-sm text-purple-600">Target: &gt; {sleepMedicineMetrics.compliance4Hours.threshold}%</p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="border-purple-200 cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:border-purple-400"
          onClick={() => {
            console.log("Referral-to-Schedule card clicked - navigating to schedule");
            navigate('/dental-sleep/schedule');
          }}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              Referral-to-Schedule
            </CardTitle>
            <CardDescription>Daily close tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{sleepMedicineMetrics.referralToScheduleDays.current} days</div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-600" />
              <p className="text-xs text-green-600">Under target (&lt; {sleepMedicineMetrics.referralToScheduleDays.threshold} days)</p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="border-purple-200 cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:border-purple-400"
          onClick={() => {
            console.log("Follow-Up No-Show card clicked - navigating to schedule");
            navigate('/dental-sleep/schedule');
          }}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              Follow-Up No-Show
            </CardTitle>
            <CardDescription>Real-time tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{sleepMedicineMetrics.followUpNoShow.current}%</div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-600" />
              <p className="text-xs text-green-600">Under target (&lt; {sleepMedicineMetrics.followUpNoShow.threshold}%)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="w-5 h-5 text-blue-600" />
              Sleep Medicine Actions
            </CardTitle>
            <CardDescription>Specialized workflows</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start bg-blue-600 hover:bg-blue-700" 
              onClick={() => {
                console.log("Navigating to schedule");
                navigate('/dental-sleep/schedule');
              }}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Sleep Consultation
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start border-blue-200 hover:bg-blue-50" 
              onClick={() => {
                console.log("Navigating to sleep-studies");
                navigate('/dental-sleep/sleep-studies');
              }}
            >
              <Activity className="w-4 h-4 mr-2" />
              Review Sleep Study
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start border-blue-200 hover:bg-blue-50" 
              onClick={() => {
                console.log("Navigating to agents/claims");
                navigate('/dental-sleep/agents/claims');
              }}
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Medical Claims Processing
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
              <div 
                className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg cursor-pointer hover:bg-yellow-100 transition-colors"
                onClick={() => {
                  console.log("Device Deliveries alert clicked - navigating to dme-tracker");
                  navigate('/dental-sleep/dme-tracker');
                }}
              >
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-800">Device Deliveries Behind Goal</p>
                  <p className="text-xs text-yellow-600">14/18 delivered this month</p>
                </div>
              </div>
              <div 
                className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg cursor-pointer hover:bg-red-100 transition-colors"
                onClick={() => {
                  console.log("Reimbursement alert clicked - navigating to insights");
                  navigate('/dental-sleep/insights');
                }}
              >
                <ArrowDown className="w-4 h-4 text-red-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">Reimbursement Per Case Down</p>
                  <p className="text-xs text-red-600">$1.9K vs $2.1K quarter average</p>
                </div>
              </div>
              <div 
                className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg cursor-pointer hover:bg-green-100 transition-colors"
                onClick={() => {
                  console.log("Clinical Outcomes alert clicked - navigating to sleep-studies");
                  navigate('/dental-sleep/sleep-studies');
                }}
              >
                <CheckCircle className="w-4 h-4 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800">Clinical Outcomes Excellent</p>
                  <p className="text-xs text-green-600">AHI reduction and compliance on target</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
