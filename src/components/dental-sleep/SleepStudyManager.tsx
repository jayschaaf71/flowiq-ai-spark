import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Moon, 
  Activity, 
  TrendingDown, 
  Calendar,
  FileText,
  Upload,
  Download,
  BarChart3
} from "lucide-react";

export const SleepStudyManager = () => {
  const sleepStudies = [
    {
      id: 'SS-2024-001',
      patientName: 'John Smith',
      studyDate: '2024-01-15',
      studyType: 'In-Lab PSG',
      ahi: 28.5,
      rdi: 34.2,
      lowestSpo2: 82,
      sleepEfficiency: 78,
      status: 'completed',
      severity: 'moderate'
    },
    {
      id: 'SS-2024-002',
      patientName: 'Sarah Johnson',
      studyDate: '2024-01-18',
      studyType: 'Home Sleep Test',
      ahi: 15.2,
      rdi: 18.5,
      lowestSpo2: 88,
      sleepEfficiency: 82,
      status: 'completed',
      severity: 'mild'
    },
    {
      id: 'SS-2024-003',
      patientName: 'Mike Wilson',
      studyDate: '2024-01-20',
      studyType: 'Follow-up HST',
      ahi: 8.1,
      rdi: 9.5,
      lowestSpo2: 92,
      sleepEfficiency: 87,
      status: 'pending_review',
      severity: 'mild'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'bg-yellow-100 text-yellow-800';
      case 'moderate': return 'bg-orange-100 text-orange-800';
      case 'severe': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Moon className="w-4 h-4 text-blue-600" />
              Total Studies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">+12 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-600" />
              Avg AHI Reduction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">62%</div>
            <p className="text-xs text-green-600">+5% vs last quarter</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-purple-600" />
              Treatment Success
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89%</div>
            <p className="text-xs text-purple-600">AHI &lt; 10 achieved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-600" />
              Pending Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-orange-600">Studies awaiting review</p>
          </CardContent>
        </Card>
      </div>

      {/* Sleep Studies List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Sleep Studies</CardTitle>
              <CardDescription>Polysomnography and home sleep test results</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Import Study
              </Button>
              <Button size="sm">
                <FileText className="w-4 h-4 mr-2" />
                New Study
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sleepStudies.map((study) => (
              <div key={study.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium">{study.patientName}</h3>
                    <Badge variant="outline">{study.id}</Badge>
                    <Badge className={getSeverityColor(study.severity)}>
                      {study.severity} OSA
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Study Date:</span>
                      <div className="font-medium">{study.studyDate}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Type:</span>
                      <div className="font-medium">{study.studyType}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">AHI:</span>
                      <div className="font-medium text-orange-600">{study.ahi}/hr</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Lowest SpO2:</span>
                      <div className="font-medium text-red-600">{study.lowestSpo2}%</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Sleep Efficiency:</span>
                      <div className="font-medium">{study.sleepEfficiency}%</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button variant="ghost" size="sm">
                    <BarChart3 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    View Report
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Treatment Progress Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>AHI Improvement Tracking</CardTitle>
            <CardDescription>Before and after treatment comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Severe OSA (≥30)</span>
                <span className="text-sm">45% → 8%</span>
              </div>
              <Progress value={8} className="h-2" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Moderate OSA (15-29)</span>
                <span className="text-sm">35% → 12%</span>
              </div>
              <Progress value={12} className="h-2" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Mild OSA (5-14)</span>
                <span className="text-sm">20% → 25%</span>
              </div>
              <Progress value={25} className="h-2" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Normal (&lt;5)</span>
                <span className="text-sm">0% → 55%</span>
              </div>
              <Progress value={55} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Study Type Distribution</CardTitle>
            <CardDescription>Breakdown of sleep study types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">In-Lab PSG</span>
                <span className="text-sm">65%</span>
              </div>
              <Progress value={65} className="h-2" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Home Sleep Test</span>
                <span className="text-sm">30%</span>
              </div>
              <Progress value={30} className="h-2" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Follow-up Studies</span>
                <span className="text-sm">5%</span>
              </div>
              <Progress value={5} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};