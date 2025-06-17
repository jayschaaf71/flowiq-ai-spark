
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IntakeForms } from "@/components/intake/IntakeForms";
import { PatientRegistration } from "@/components/intake/PatientRegistration";
import { FormTemplates } from "@/components/intake/FormTemplates";
import { IntakeAnalytics } from "@/components/intake/IntakeAnalytics";
import { FileText, Users, Bot, Clock, CheckCircle, AlertCircle, Plus } from "lucide-react";

const IntakeIQ = () => {
  const [activeTab, setActiveTab] = useState("forms");
  
  // Mock data for demonstration
  const todayStats = {
    totalForms: 8,
    completed: 6,
    pending: 2,
    incomplete: 0,
    aiProcessed: 12
  };

  return (
    <Layout>
      <PageHeader 
        title="Intake iQ"
        subtitle="AI-powered digital patient intake and form management"
        badge="AI Agent"
      />
      
      <div className="p-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Forms</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayStats.totalForms}</div>
              <p className="text-xs text-muted-foreground">
                {todayStats.completed} completed
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{todayStats.completed}</div>
              <p className="text-xs text-muted-foreground">
                75% completion rate
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{todayStats.pending}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting completion
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Incomplete</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{todayStats.incomplete}</div>
              <p className="text-xs text-muted-foreground">
                Need follow-up
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Processed</CardTitle>
              <Bot className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{todayStats.aiProcessed}</div>
              <p className="text-xs text-muted-foreground">
                Auto-verified today
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="forms">Active Forms</TabsTrigger>
              <TabsTrigger value="register">New Patient</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <Button onClick={() => setActiveTab("register")} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New Intake
            </Button>
          </div>

          <TabsContent value="forms" className="space-y-4">
            <IntakeForms />
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <PatientRegistration />
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <FormTemplates />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <IntakeAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default IntakeIQ;
