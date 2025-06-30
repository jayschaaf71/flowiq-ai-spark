
import { useState } from "react";
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
import { EligibilityVerificationPanel } from "@/components/claims/EligibilityVerificationPanel";
import { AdvancedComplianceDashboard } from "@/components/compliance/AdvancedComplianceDashboard";
import { AIClaimsReviewEngine } from "@/components/claims/AIClaimsReviewEngine";
import { AdvancedClaimsAnalytics } from "@/components/claims/analytics/AdvancedClaimsAnalytics";
import { RealTimeClaimTracker } from "@/components/claims/tracking/RealTimeClaimTracker";
import { Brain, DollarSign, Shield, Send, Settings, Zap, CheckCircle, Lock, BarChart3, Activity } from "lucide-react";

const ClaimsIQ = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Claims iQ"
        subtitle="AI-powered claims processing with intelligent validation, compliance monitoring, and revenue optimization"
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
          <Badge className="bg-orange-100 text-orange-700">
            <Lock className="w-3 h-3 mr-1" />
            Advanced Compliance
          </Badge>
          <Badge className="bg-red-100 text-red-700">
            <Activity className="w-3 h-3 mr-1" />
            Real-time Tracking
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
          <TabsList className="grid w-full grid-cols-10">
            <TabsTrigger value="dashboard">
              <DollarSign className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="ai-review">
              <Brain className="w-4 h-4 mr-2" />
              AI Review
            </TabsTrigger>
            <TabsTrigger value="tracking">
              <Activity className="w-4 h-4 mr-2" />
              Real-time
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="validation">
              <Shield className="w-4 h-4 mr-2" />
              Validation
            </TabsTrigger>
            <TabsTrigger value="eligibility">
              <CheckCircle className="w-4 h-4 mr-2" />
              Eligibility
            </TabsTrigger>
            <TabsTrigger value="payers">
              <Send className="w-4 h-4 mr-2" />
              Payers
            </TabsTrigger>
            <TabsTrigger value="compliance">
              <Lock className="w-4 h-4 mr-2" />
              Compliance
            </TabsTrigger>
            <TabsTrigger value="denials">Denials</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <ClaimsDashboard />
          </TabsContent>

          <TabsContent value="ai-review">
            <AIClaimsReviewEngine />
          </TabsContent>

          <TabsContent value="tracking">
            <RealTimeClaimTracker />
          </TabsContent>

          <TabsContent value="analytics">
            <AdvancedClaimsAnalytics />
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

          <TabsContent value="eligibility">
            <EligibilityVerificationPanel 
              patientId="patient-1"
              onEligibilityVerified={(result) => {
                console.log("Eligibility verified:", result);
              }}
            />
          </TabsContent>

          <TabsContent value="payers">
            <PayerIntegration />
          </TabsContent>

          <TabsContent value="compliance">
            <AdvancedComplianceDashboard />
          </TabsContent>

          <TabsContent value="denials">
            <DenialManagement />
          </TabsContent>

          <TabsContent value="revenue">
            <RevenueAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClaimsIQ;
