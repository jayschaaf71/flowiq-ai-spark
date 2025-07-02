import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle, Clock, DollarSign, AlertCircle, Zap } from "lucide-react";
import { EligibilityVerificationPanel } from "@/components/claims/EligibilityVerificationPanel";
import { PriorAuthorizationDashboard } from "@/components/claims/PriorAuthorizationDashboard";
import { AuthIQDashboard } from "@/components/auth/AuthIQDashboard";
import { CostEstimatorEngine } from "@/components/auth/CostEstimatorEngine";
import { RealTimeEligibilityAPI } from "@/components/auth/RealTimeEligibilityAPI";

const AuthIQ = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Auth iQ"
        subtitle="Real-time insurance authorization and eligibility verification for dental sleep medicine"
      >
        <div className="flex gap-2">
          <Badge className="bg-blue-100 text-blue-700">AI Agent</Badge>
          <Badge className="bg-green-100 text-green-700">
            <Zap className="w-3 h-3 mr-1" />
            Real-time API
          </Badge>
          <Badge className="bg-purple-100 text-purple-700">
            <Shield className="w-3 h-3 mr-1" />
            Insurance Integration
          </Badge>
          <Badge className="bg-orange-100 text-orange-700">
            <DollarSign className="w-3 h-3 mr-1" />
            Cost Estimation
          </Badge>
        </div>
      </PageHeader>
      
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="eligibility">
              <CheckCircle className="w-4 h-4 mr-1" />
              Eligibility Check
            </TabsTrigger>
            <TabsTrigger value="prior-auth">
              <Clock className="w-4 h-4 mr-1" />
              Prior Auth
            </TabsTrigger>
            <TabsTrigger value="cost-estimator">
              <DollarSign className="w-4 h-4 mr-1" />
              Cost Estimator
            </TabsTrigger>
            <TabsTrigger value="api-config">
              <Shield className="w-4 h-4 mr-1" />
              API Config
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <AuthIQDashboard />
          </TabsContent>

          <TabsContent value="eligibility">
            <EligibilityVerificationPanel />
          </TabsContent>

          <TabsContent value="prior-auth">
            <PriorAuthorizationDashboard />
          </TabsContent>

          <TabsContent value="cost-estimator">
            <CostEstimatorEngine />
          </TabsContent>

          <TabsContent value="api-config">
            <RealTimeEligibilityAPI />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AuthIQ;