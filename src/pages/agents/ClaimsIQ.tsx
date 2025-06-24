
import { PageHeader } from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ClaimsQueue } from "@/components/claims/ClaimsQueue";
import { RevenueAnalytics } from "@/components/claims/RevenueAnalytics";
import { DenialManagement } from "@/components/claims/DenialManagement";
import { DevelopmentRoadmap } from "@/components/development/DevelopmentRoadmap";
import { useClaimsSampleData } from "@/hooks/useClaimsSampleData";
import { Database, TrendingUp, AlertTriangle, FileText, Map, Brain, Zap, BarChart3, Shield, CreditCard } from "lucide-react";
import { AIClaimsReviewEngine } from "@/components/claims/AIClaimsReviewEngine";
import { PayerIntegration } from "@/components/claims/PayerIntegration";
import { ClaimGenerationEngine } from "@/components/claims/ClaimGenerationEngine";
import { EnhancedDenialManagement } from "@/components/claims/EnhancedDenialManagement";
import { ComprehensiveRevenueAnalytics } from "@/components/claims/ComprehensiveRevenueAnalytics";
import { PriorAuthorizationDashboard } from "@/components/claims/PriorAuthorizationDashboard";
import { PaymentPostingDashboard } from "@/components/claims/PaymentPostingDashboard";

const ClaimsIQ = () => {
  const { loading, createSampleData } = useClaimsSampleData();

  return (
    <div className="flex-1 space-y-6 p-6">
      <PageHeader 
        title="Claims iQ"
        subtitle="AI-powered claims processing, denial management, and revenue cycle optimization"
      />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-muted-foreground">Real-time updates enabled</span>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={createSampleData}
          disabled={loading}
        >
          <Database className="w-4 h-4 mr-2" />
          {loading ? "Creating..." : "Add Sample Data"}
        </Button>
      </div>

      <Tabs defaultValue="generation" className="space-y-6">
        <TabsList className="grid w-full grid-cols-10">
          <TabsTrigger value="generation" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Generate
          </TabsTrigger>
          <TabsTrigger value="ai-review" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            AI Review
          </TabsTrigger>
          <TabsTrigger value="prior-auth" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Prior Auth
          </TabsTrigger>
          <TabsTrigger value="payment-posting" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="payer-integration" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Payer Integration
          </TabsTrigger>
          <TabsTrigger value="enhanced-denials" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Smart Denials
          </TabsTrigger>
          <TabsTrigger value="comprehensive-analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Revenue Analytics
          </TabsTrigger>
          <TabsTrigger value="queue" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Claims Queue
          </TabsTrigger>
          <TabsTrigger value="denials" className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Denial Management
          </TabsTrigger>
          <TabsTrigger value="roadmap" className="flex items-center gap-2">
            <Map className="w-4 h-4" />
            Development
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generation" className="space-y-6">
          <ClaimGenerationEngine />
        </TabsContent>

        <TabsContent value="ai-review" className="space-y-6">
          <AIClaimsReviewEngine />
        </TabsContent>

        <TabsContent value="prior-auth" className="space-y-6">
          <PriorAuthorizationDashboard />
        </TabsContent>

        <TabsContent value="payment-posting" className="space-y-6">
          <PaymentPostingDashboard />
        </TabsContent>

        <TabsContent value="payer-integration" className="space-y-6">
          <PayerIntegration />
        </TabsContent>

        <TabsContent value="enhanced-denials" className="space-y-6">
          <EnhancedDenialManagement />
        </TabsContent>

        <TabsContent value="comprehensive-analytics" className="space-y-6">
          <ComprehensiveRevenueAnalytics />
        </TabsContent>

        <TabsContent value="queue" className="space-y-6">
          <ClaimsQueue />
        </TabsContent>

        <TabsContent value="denials" className="space-y-6">
          <DenialManagement />
        </TabsContent>

        <TabsContent value="roadmap" className="space-y-6">
          <DevelopmentRoadmap />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClaimsIQ;
