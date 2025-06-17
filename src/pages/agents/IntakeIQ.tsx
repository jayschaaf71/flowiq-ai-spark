
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  ClipboardList, 
  FileText, 
  Users, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Settings,
  Upload,
  Download
} from "lucide-react";

const IntakeIQ = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const stats = {
    formsProcessed: 47,
    completionRate: 94,
    avgProcessingTime: "3.2 minutes",
    pendingReview: 5,
    automatedApprovals: 89,
    errorsDetected: 2
  };

  const recentForms = [
    { patient: "Sarah Wilson", form: "New Patient Intake", status: "completed", time: "5 min ago" },
    { patient: "John Doe", form: "Medical History Update", status: "in-review", time: "12 min ago" },
    { patient: "Mary Johnson", form: "Insurance Verification", status: "completed", time: "18 min ago" },
    { patient: "Robert Smith", form: "Consent Forms", status: "pending", time: "25 min ago" },
    { patient: "Lisa Brown", form: "Emergency Contact", status: "completed", time: "32 min ago" }
  ];

  const formTypes = [
    { name: "New Patient Intake", processed: 23, completion: 96, avgTime: "4.2 min" },
    { name: "Medical History", processed: 15, completion: 91, avgTime: "2.8 min" },
    { name: "Insurance Verification", processed: 12, completion: 98, avgTime: "1.5 min" },
    { name: "Consent Forms", processed: 8, completion: 94, avgTime: "2.1 min" }
  ];

  return (
    <Layout>
      <PageHeader 
        title="Intake iQ"
        subtitle="AI-powered patient intake and form processing"
        badge="AI Agent"
      />
      
      <div className="p-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Forms Today</CardTitle>
              <ClipboardList className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.formsProcessed}</div>
              <p className="text-xs text-muted-foreground">+8 from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.completionRate}%</div>
              <Progress value={stats.completionRate} className="h-1 mt-1" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Processing</CardTitle>
              <Clock className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgProcessingTime}</div>
              <p className="text-xs text-muted-foreground">-15% improvement</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Users className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingReview}</div>
              <p className="text-xs text-muted-foreground">Requires attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Auto-Approved</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.automatedApprovals}%</div>
              <p className="text-xs text-muted-foreground">AI processed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Errors Found</CardTitle>
              <FileText className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.errorsDetected}</div>
              <p className="text-xs text-muted-foreground">Auto-flagged</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="forms">Form Templates</TabsTrigger>
              <TabsTrigger value="processing">Processing Queue</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <Upload className="w-4 h-4 mr-2" />
                Upload Forms
              </Button>
            </div>
          </div>

          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Forms */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recent Form Submissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentForms.map((form, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="text-sm font-medium">{form.patient}</div>
                          <div className="text-xs text-muted-foreground">{form.form} • {form.time}</div>
                        </div>
                        <Badge 
                          className={
                            form.status === "completed" ? "bg-green-100 text-green-800" :
                            form.status === "in-review" ? "bg-yellow-100 text-yellow-800" :
                            "bg-blue-100 text-blue-800"
                          }
                        >
                          {form.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Form Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Form Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {formTypes.map((type, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{type.name}</span>
                          <span className="text-xs text-muted-foreground">{type.processed} processed</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={type.completion} className="flex-1 h-2" />
                          <span className="text-xs text-muted-foreground">{type.completion}%</span>
                        </div>
                        <div className="text-xs text-muted-foreground">Avg: {type.avgTime}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="forms" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Form Templates</CardTitle>
                <CardDescription>Manage intake form templates and configurations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4" />
                  <p>Form template management coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="processing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Processing Queue</CardTitle>
                <CardDescription>Monitor and manage form processing pipeline</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <ClipboardList className="w-12 h-12 mx-auto mb-4" />
                  <p>Processing queue interface coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Intake Analytics</CardTitle>
                <CardDescription>Form completion rates and performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4" />
                  <p>Analytics dashboard coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default IntakeIQ;
