import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Users, Heart, Smartphone, TrendingUp, MessageSquare } from "lucide-react";
import { EducationDashboard } from "@/components/education/EducationDashboard";
import { ComplianceTracking } from "@/components/education/ComplianceTracking";
import { DripCampaigns } from "@/components/education/DripCampaigns";
import { PatientEngagement } from "@/components/education/PatientEngagement";

const EducationIQ = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Education iQ"
        subtitle="AI-powered patient education and compliance monitoring for dental sleep medicine"
      >
        <div className="flex gap-2">
          <Badge className="bg-blue-100 text-blue-700">AI Agent</Badge>
          <Badge className="bg-green-100 text-green-700">
            <Heart className="w-3 h-3 mr-1" />
            Compliance Tracking
          </Badge>
          <Badge className="bg-purple-100 text-purple-700">
            <MessageSquare className="w-3 h-3 mr-1" />
            Smart Campaigns
          </Badge>
          <Badge className="bg-orange-100 text-orange-700">
            <Smartphone className="w-3 h-3 mr-1" />
            Mobile Optimized
          </Badge>
        </div>
      </PageHeader>
      
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="compliance">
              <Heart className="w-4 h-4 mr-1" />
              Compliance
            </TabsTrigger>
            <TabsTrigger value="campaigns">
              <MessageSquare className="w-4 h-4 mr-1" />
              Drip Campaigns
            </TabsTrigger>
            <TabsTrigger value="engagement">
              <Users className="w-4 h-4 mr-1" />
              Engagement
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <EducationDashboard />
          </TabsContent>

          <TabsContent value="compliance">
            <ComplianceTracking />
          </TabsContent>

          <TabsContent value="campaigns">
            <DripCampaigns />
          </TabsContent>

          <TabsContent value="engagement">
            <PatientEngagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EducationIQ;