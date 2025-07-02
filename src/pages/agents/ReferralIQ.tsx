import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, Shield, FileText, TrendingUp, UserCheck } from "lucide-react";
import { ReferralDashboard } from "@/components/referral/ReferralDashboard";
import { PhysicianPortal } from "@/components/referral/PhysicianPortal";
import { OutcomeSummaries } from "@/components/referral/OutcomeSummaries";
import { ReferralTracking } from "@/components/referral/ReferralTracking";

const ReferralIQ = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Referral iQ"
        subtitle="Automated referral network management and physician portal for sleep medicine"
      >
        <div className="flex gap-2">
          <Badge className="bg-blue-100 text-blue-700">AI Agent</Badge>
          <Badge className="bg-green-100 text-green-700">
            <Shield className="w-3 h-3 mr-1" />
            OIDC Secure
          </Badge>
          <Badge className="bg-purple-100 text-purple-700">
            <UserCheck className="w-3 h-3 mr-1" />
            MD Portal
          </Badge>
          <Badge className="bg-orange-100 text-orange-700">
            <FileText className="w-3 h-3 mr-1" />
            Auto Reports
          </Badge>
        </div>
      </PageHeader>
      
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="portal">
              <UserCheck className="w-4 h-4 mr-1" />
              Physician Portal
            </TabsTrigger>
            <TabsTrigger value="outcomes">
              <FileText className="w-4 h-4 mr-1" />
              Outcome Reports
            </TabsTrigger>
            <TabsTrigger value="tracking">
              <TrendingUp className="w-4 h-4 mr-1" />
              Lead Tracking
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <ReferralDashboard />
          </TabsContent>

          <TabsContent value="portal">
            <PhysicianPortal />
          </TabsContent>

          <TabsContent value="outcomes">
            <OutcomeSummaries />
          </TabsContent>

          <TabsContent value="tracking">
            <ReferralTracking />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ReferralIQ;