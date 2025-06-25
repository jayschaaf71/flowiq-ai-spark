
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";
import { PlaudIntegration } from "@/components/ai/PlaudIntegration";
import { ScribeDashboardTab } from "@/components/scribe/ScribeDashboardTab";
import { ScribeLiveRecording } from "@/components/scribe/ScribeLiveRecording";
import { ScribeSOAPGeneration } from "@/components/scribe/ScribeSOAPGeneration";
import { ScribeTemplatesTab } from "@/components/scribe/ScribeTemplatesTab";
import { ScribeSettingsTab } from "@/components/scribe/ScribeSettingsTab";
import { SOAPProvider } from "@/contexts/SOAPContext";

const ScribeIQ = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <Layout>
      <SOAPProvider>
        <PageHeader 
          title="Scribe iQ"
          subtitle="AI-powered medical documentation and voice transcription with HIPAA compliance"
        >
          <div className="flex gap-2">
            <Badge className="bg-blue-100 text-blue-700">AI Agent</Badge>
            <Badge className="bg-green-100 text-green-700">
              <Shield className="w-3 h-3 mr-1" />
              HIPAA Compliant
            </Badge>
          </div>
        </PageHeader>
        
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="transcribe">Live Recording</TabsTrigger>
              <TabsTrigger value="plaud">Plaud Device</TabsTrigger>
              <TabsTrigger value="soap">SOAP Generation</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <ScribeDashboardTab />
            </TabsContent>

            <TabsContent value="transcribe">
              <ScribeLiveRecording />
            </TabsContent>

            <TabsContent value="plaud">
              <PlaudIntegration />
            </TabsContent>

            <TabsContent value="soap">
              <ScribeSOAPGeneration />
            </TabsContent>

            <TabsContent value="templates">
              <ScribeTemplatesTab />
            </TabsContent>

            <TabsContent value="settings">
              <ScribeSettingsTab />
            </TabsContent>
          </Tabs>
        </div>
      </SOAPProvider>
    </Layout>
  );
};

export default ScribeIQ;
