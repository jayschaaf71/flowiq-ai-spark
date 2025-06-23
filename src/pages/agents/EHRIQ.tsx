
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EHRDashboard } from "@/components/ehr/EHRDashboard";
import { PatientRecords } from "@/components/ehr/PatientRecords";
import { SOAPNotes } from "@/components/ehr/SOAPNotes";
import { MigrationDashboard } from "@/components/ehr/MigrationDashboard";
import { EHRAnalytics } from "@/components/ehr/EHRAnalytics";
import { PatientDetailTabs } from "@/components/ehr/PatientDetailTabs";
import { 
  Activity, 
  Users, 
  FileText, 
  Database, 
  BarChart3,
  Workflow,
  Settings,
  Zap,
  CheckCircle
} from "lucide-react";

const EHRIQ = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const agentCapabilities = [
    "Complete Patient Record Management",
    "Automated SOAP Note Generation", 
    "Insurance Verification & Claims",
    "Appointment Integration",
    "Billing & Revenue Cycle",
    "HIPAA Compliance Monitoring",
    "Cross-Agent Workflow Automation",
    "Real-time Analytics & Reporting"
  ];

  const integrationStatus = [
    { agent: "Schedule iQ", status: "connected", icon: "🗓️" },
    { agent: "Intake iQ", status: "connected", icon: "📋" },
    { agent: "Billing iQ", status: "connected", icon: "💳" },
    { agent: "Remind iQ", status: "connected", icon: "🔔" },
    { agent: "Follow-up iQ", status: "connected", icon: "💬" }
  ];

  return (
    <Layout>
      <PageHeader 
        title="EHR iQ"
        subtitle="AI-powered Electronic Health Records management with comprehensive practice integration"
        badge="AI Agent"
      >
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
          <Button size="sm">
            <Zap className="w-4 h-4 mr-2" />
            Quick Actions
          </Button>
        </div>
      </PageHeader>
      
      <div className="p-6 space-y-6">
        {/* Agent Overview Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                EHR iQ Capabilities
              </CardTitle>
              <CardDescription>
                Comprehensive electronic health records management with AI automation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {agentCapabilities.map((capability, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    {capability}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Workflow className="w-5 h-5 text-purple-600" />
                Agent Integrations
              </CardTitle>
              <CardDescription>
                Connected AI agents working together
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {integrationStatus.map((integration, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{integration.icon}</span>
                    <span className="text-sm font-medium">{integration.agent}</span>
                  </div>
                  <Badge variant="default" className="text-xs">
                    {integration.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="patients" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Patients
            </TabsTrigger>
            <TabsTrigger value="records" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Records
            </TabsTrigger>
            <TabsTrigger value="soap" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              SOAP Notes
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

          <TabsContent value="dashboard" className="space-y-4">
            <EHRDashboard />
          </TabsContent>

          <TabsContent value="patients" className="space-y-4">
            <PatientRecords />
          </TabsContent>

          <TabsContent value="records" className="space-y-4">
            <PatientDetailTabs patientId="sample-patient-id" />
          </TabsContent>

          <TabsContent value="soap" className="space-y-4">
            <SOAPNotes />
          </TabsContent>

          <TabsContent value="migration" className="space-y-4">
            <MigrationDashboard />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <EHRAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default EHRIQ;
