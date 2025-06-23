
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PatientRecords } from "./PatientRecords";
import { SOAPNotes } from "./SOAPNotes";
import { MigrationDashboard } from "./MigrationDashboard";
import { EHRAnalytics } from "./EHRAnalytics";
import { AppointmentIntegration } from "./AppointmentIntegration";
import { AppointmentReminders } from "./AppointmentReminders";
import { EHRWorkflowIntegration } from "./EHRWorkflowIntegration";
import { EHRBillingIntegration } from "./EHRBillingIntegration";
import { EHRComplianceMonitor } from "./EHRComplianceMonitor";
import { 
  Users, 
  Calendar, 
  Bell, 
  FileText, 
  Database, 
  BarChart3,
  Workflow,
  CreditCard,
  Shield,
  Activity,
  AlertCircle,
  TrendingUp
} from "lucide-react";

export const EHRDashboard = () => {
  const quickStats = [
    { label: "Active Patients", value: "1,247", icon: Users, trend: "+12%" },
    { label: "Today's Appointments", value: "18", icon: Calendar, trend: "+5%" },
    { label: "Pending Records", value: "34", icon: FileText, trend: "-8%" },
    { label: "Compliance Score", value: "98.2%", icon: Shield, trend: "+2%" }
  ];

  const systemAlerts = [
    { type: "warning", message: "Patient record sync pending for 3 records", urgent: false },
    { type: "info", message: "Scheduled backup completed successfully", urgent: false },
    { type: "error", message: "Integration timeout with billing system", urgent: true }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Activity className="w-8 h-8 text-blue-600" />
            EHR iQ Dashboard
          </h1>
          <p className="text-muted-foreground">
            Comprehensive electronic health records management with AI-powered insights
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Database className="w-4 h-4 mr-2" />
            Sync All
          </Button>
          <Button size="sm">
            <Workflow className="w-4 h-4 mr-2" />
            Quick Actions
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="w-3 h-3" />
                {stat.trend} from last week
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Alerts */}
      {systemAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              System Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {systemAlerts.map((alert, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant={alert.type === 'error' ? 'destructive' : alert.type === 'warning' ? 'secondary' : 'default'}>
                      {alert.type}
                    </Badge>
                    <span className="text-sm">{alert.message}</span>
                  </div>
                  {alert.urgent && (
                    <Badge variant="destructive" className="text-xs">
                      Urgent
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="patients" className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="patients" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Patients
          </TabsTrigger>
          <TabsTrigger value="appointments" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Appointments
          </TabsTrigger>
          <TabsTrigger value="soap" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            SOAP Notes
          </TabsTrigger>
          <TabsTrigger value="workflows" className="flex items-center gap-2">
            <Workflow className="w-4 h-4" />
            Workflows
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Compliance
          </TabsTrigger>
          <TabsTrigger value="migration" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Migration
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="patients">
          <PatientRecords />
        </TabsContent>

        <TabsContent value="appointments">
          <AppointmentIntegration />
        </TabsContent>

        <TabsContent value="soap">
          <SOAPNotes />
        </TabsContent>

        <TabsContent value="workflows">
          <EHRWorkflowIntegration />
        </TabsContent>

        <TabsContent value="billing">
          <EHRBillingIntegration />
        </TabsContent>

        <TabsContent value="compliance">
          <EHRComplianceMonitor />
        </TabsContent>

        <TabsContent value="migration">
          <MigrationDashboard />
        </TabsContent>

        <TabsContent value="analytics">
          <EHRAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};
