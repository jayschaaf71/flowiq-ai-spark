
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClaimsDashboard } from "@/components/claims/ClaimsDashboard";
import { PayerIntegration } from "@/components/claims/PayerIntegration";
import { AIValidationPanel } from "@/components/claims/AIValidationPanel";
import { ComplianceMonitor } from "@/components/claims/ComplianceMonitor";
import { RevenueAnalytics } from "@/components/claims/RevenueAnalytics";
import { DenialManagement } from "@/components/claims/DenialManagement";
import { Brain, DollarSign, Shield, Send, Settings, Zap } from "lucide-react";

const ClaimsIQ = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <Layout>
      <PageHeader 
        title="Claims iQ"
        subtitle="AI-powered claims processing with intelligent validation and revenue optimization"
      >
        <div className="flex gap-2">
          <Badge className="bg-blue-100 text-blue-700">AI Agent</Badge>
          <Badge className="bg-green-100 text-green-700">
            <Brain className="w-3 h-3 mr-1" />
            Auto-Validation
          </Badge>
          <Badge className="bg-purple-100 text-purple-700">
            <Shield className="w-3 h-3 mr-1" />
            HIPAA Compliant
          </Badge>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Zap className="w-4 h-4 mr-2" />
            Deploy
          </Button>
        </div>
      </PageHeader>
      
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">
              <DollarSign className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="validation">
              <Brain className="w-4 h-4 mr-2" />
              AI Validation
            </TabsTrigger>
            <TabsTrigger value="payers">
              <Send className="w-4 h-4 mr-2" />
              Payer Integration
            </TabsTrigger>
            <TabsTrigger value="compliance">
              <Shield className="w-4 h-4 mr-2" />
              Compliance
            </TabsTrigger>
            <TabsTrigger value="denials">Denials</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <ClaimsDashboard />
          </TabsContent>

          <TabsContent value="validation">
            <div className="space-y-6">
              <AIValidationPanel 
                claimData={{
                  claim_number: "CLM-2024-001",
                  patients: { id: "1", first_name: "John", last_name: "Doe" },
                  providers: { id: "1", first_name: "Dr. Jane", last_name: "Smith", npi: "1234567890" },
                  insurance_providers: { name: "Blue Cross" },
                  service_date: "2024-01-15",
                  total_amount: 350.00
                }}
                onValidationComplete={(result) => {
                  console.log("Validation completed:", result);
                }}
              />
            </div>
          </TabsContent>

          <TabsContent value="payers">
            <PayerIntegration />
          </TabsContent>

          <TabsContent value="compliance">
            <ComplianceMonitor />
          </TabsContent>

          <TabsContent value="denials">
            <DenialManagement />
          </TabsContent>

          <TabsContent value="analytics">
            <RevenueAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ClaimsIQ;
