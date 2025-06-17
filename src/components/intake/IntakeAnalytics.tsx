
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Clock, CheckCircle, AlertCircle, Download } from "lucide-react";

export const IntakeAnalytics = () => {
  // Mock analytics data
  const metrics = {
    completionRate: 78,
    averageTime: 8.5,
    totalForms: 1247,
    aiAccuracy: 94,
    patientSatisfaction: 4.6
  };

  const trendData = [
    { month: "Dec", completed: 145, pending: 23, incomplete: 12 },
    { month: "Jan", completed: 167, pending: 18, incomplete: 8 },
    { month: "Feb", completed: 189, pending: 15, incomplete: 6 },
    { month: "Mar", completed: 201, pending: 12, incomplete: 4 }
  ];

  const formPerformance = [
    { name: "New Patient Intake", completionRate: 85, avgTime: 12.3, satisfaction: 4.7 },
    { name: "Pre-Visit Questionnaire", completionRate: 92, avgTime: 5.2, satisfaction: 4.8 },
    { name: "Medical History Update", completionRate: 76, avgTime: 8.1, satisfaction: 4.2 },
    { name: "Insurance Verification", completionRate: 95, avgTime: 3.8, satisfaction: 4.9 },
    { name: "Consent Forms", completionRate: 88, avgTime: 6.5, satisfaction: 4.1 }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Date Range */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Intake Analytics</CardTitle>
              <CardDescription>Track form performance and patient experience metrics</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select defaultValue="30days">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                  <SelectItem value="year">This year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metrics.completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              +5.2% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Completion Time</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{metrics.averageTime}m</div>
            <p className="text-xs text-muted-foreground">
              -1.3m from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Forms</CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{metrics.totalForms.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Accuracy</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{metrics.aiAccuracy}%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patient Satisfaction</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metrics.patientSatisfaction}/5</div>
            <p className="text-xs text-muted-foreground">
              +0.3 from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Trends</CardTitle>
          <CardDescription>Form completion trends over the last 4 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trendData.map((month, index) => (
              <div key={month.month} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="font-medium w-12">{month.month}</div>
                  <div className="flex gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Completed: {month.completed}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span>Pending: {month.pending}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span>Incomplete: {month.incomplete}</span>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {Math.round((month.completed / (month.completed + month.pending + month.incomplete)) * 100)}% completion
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Form Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Form Performance</CardTitle>
          <CardDescription>Individual form template performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {formPerformance.map((form, index) => (
              <div key={form.name} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{form.name}</h4>
                  <div className="flex gap-2">
                    <Badge 
                      className={form.completionRate >= 90 ? "bg-green-100 text-green-700" : 
                                form.completionRate >= 80 ? "bg-yellow-100 text-yellow-700" : 
                                "bg-red-100 text-red-700"}
                    >
                      {form.completionRate}% complete
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Avg. Time:</span>
                    <div className="font-medium">{form.avgTime} minutes</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Satisfaction:</span>
                    <div className="font-medium">{form.satisfaction}/5.0</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Completion:</span>
                    <div className="font-medium">{form.completionRate}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle>AI Insights</CardTitle>
          <CardDescription>Automated recommendations to improve intake performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <div className="font-medium text-blue-900">Optimization Opportunity</div>
                <div className="text-sm text-blue-700 mt-1">
                  Medical History Update form has a 76% completion rate. Consider reducing the number of optional fields to improve completion.
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <div className="font-medium text-green-900">Success Pattern</div>
                <div className="text-sm text-green-700 mt-1">
                  Pre-Visit Questionnaire has the highest satisfaction score (4.8/5). The concise format and clear instructions work well.
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <div className="font-medium text-yellow-900">Attention Needed</div>
                <div className="text-sm text-yellow-700 mt-1">
                  Consent Forms have the lowest satisfaction (4.1/5). Consider adding progress indicators and simplifying legal language.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
