
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Users, 
  FileText, 
  Shield,
  Download,
  AlertTriangle
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

export const EHRAnalytics = () => {
  const monthlyVisits = [
    { month: 'Jul', visits: 245 },
    { month: 'Aug', visits: 289 },
    { month: 'Sep', visits: 267 },
    { month: 'Oct', visits: 298 },
    { month: 'Nov', visits: 324 },
    { month: 'Dec', visits: 341 },
    { month: 'Jan', visits: 378 }
  ];

  const diagnosisData = [
    { diagnosis: 'Lower Back Pain', count: 124, percentage: 32 },
    { diagnosis: 'Neck Strain', count: 89, percentage: 23 },
    { diagnosis: 'Headaches', count: 67, percentage: 17 },
    { diagnosis: 'Shoulder Pain', count: 45, percentage: 12 },
    { diagnosis: 'Sciatica', count: 34, percentage: 9 },
    { diagnosis: 'Other', count: 27, percentage: 7 }
  ];

  const complianceData = [
    { name: 'Compliant', value: 92, color: '#10B981' },
    { name: 'Non-Compliant', value: 8, color: '#EF4444' }
  ];

  const stats = [
    {
      title: "Total Patient Records",
      value: "1,247",
      change: "+12%",
      changeType: "positive" as const,
      icon: Users
    },
    {
      title: "SOAP Notes This Month", 
      value: "378",
      change: "+18%",
      changeType: "positive" as const,
      icon: FileText
    },
    {
      title: "Compliance Score",
      value: "98.2%",
      change: "+0.5%",
      changeType: "positive" as const,
      icon: Shield
    },
    {
      title: "Average Note Completion",
      value: "4.2 min",
      change: "-15%",
      changeType: "positive" as const,
      icon: TrendingUp
    }
  ];

  const complianceIssues = [
    {
      issue: "Unsigned notes older than 24h",
      count: 3,
      severity: "high" as const,
      action: "Sign pending notes"
    },
    {
      issue: "Missing patient insurance info",
      count: 12,
      severity: "medium" as const,
      action: "Update patient records"
    },
    {
      issue: "Incomplete SOAP templates",
      count: 5,
      severity: "low" as const,
      action: "Complete note sections"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">EHR Analytics</h2>
          <p className="text-muted-foreground">Practice insights and compliance monitoring</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={`${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  {" "}from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visit Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Monthly Visit Trends
            </CardTitle>
            <CardDescription>Patient visits over the last 7 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyVisits}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="visits" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Diagnoses */}
        <Card>
          <CardHeader>
            <CardTitle>Most Common Diagnoses</CardTitle>
            <CardDescription>Top conditions treated this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {diagnosisData.map((item, index) => (
                <div key={item.diagnosis} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.diagnosis}</span>
                    <span className="text-muted-foreground">{item.count} patients</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              HIPAA Compliance
            </CardTitle>
            <CardDescription>Current compliance status and score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">98.2%</div>
                <p className="text-sm text-muted-foreground">Overall Compliance Score</p>
              </div>
              
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={complianceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {complianceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div className="space-y-2">
                {complianceData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Issues */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Compliance Issues
            </CardTitle>
            <CardDescription>Items requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {complianceIssues.map((issue, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{issue.issue}</span>
                      <Badge 
                        variant={
                          issue.severity === 'high' ? 'destructive' :
                          issue.severity === 'medium' ? 'default' : 'secondary'
                        }
                        className="text-xs"
                      >
                        {issue.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{issue.action}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {issue.count}
                    </Badge>
                    <Button size="sm" variant="outline">
                      Fix
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
