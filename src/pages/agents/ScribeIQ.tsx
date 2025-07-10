
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Shield, Smartphone } from "lucide-react";
import { PlaudIntegration } from "@/components/ai/PlaudIntegration";
import { ScribeDashboardTab } from "@/components/scribe/ScribeDashboardTab";
import { ScribeLiveRecording } from "@/components/scribe/ScribeLiveRecording";
import { EnhancedVoiceRecorder } from "@/components/scribe/EnhancedVoiceRecorder";
import { ScribeSOAPGeneration } from "@/components/scribe/ScribeSOAPGeneration";
import { ScribeTemplatesTab } from "@/components/scribe/ScribeTemplatesTab";
import { ScribeSettingsTab } from "@/components/scribe/ScribeSettingsTab";
import { SOAPProvider } from "@/contexts/SOAPContext";
import { useSpecialty } from "@/contexts/SpecialtyContext";
import { usePlaudIntegration } from "@/hooks/usePlaudIntegration";

const ScribeIQ = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { isConnected, connectionStatus } = usePlaudIntegration();
  const { getBrandName } = useSpecialty();

  // Listen for tab change events from dashboard buttons
  useEffect(() => {
    const handleTabChange = (event: CustomEvent) => {
      setActiveTab(event.detail);
    };

    window.addEventListener('changeScribeTab', handleTabChange as EventListener);
    return () => {
      window.removeEventListener('changeScribeTab', handleTabChange as EventListener);
    };
  }, []);

  return (
    <SOAPProvider>
      <div className="space-y-6">
        <PageHeader 
          title={`${getBrandName()} - Scribe`}
          subtitle="AI-powered medical documentation and voice transcription with HIPAA compliance"
        >
          <div className="flex gap-2">
            <Badge className="bg-blue-100 text-blue-700">AI Agent</Badge>
            <Badge className="bg-green-100 text-green-700">
              <Shield className="w-3 h-3 mr-1" />
              HIPAA Compliant
            </Badge>
            {connectionStatus === 'connected' && (
              <Badge variant="outline" className="border-green-500 text-green-700">
                <Smartphone className="w-3 h-3 mr-1" />
                Plaud Connected
              </Badge>
            )}
            {connectionStatus === 'checking' && (
              <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                <Smartphone className="w-3 h-3 mr-1" />
                Checking Connection...
              </Badge>
            )}
            {connectionStatus === 'error' && (
              <Badge variant="outline" className="border-red-500 text-red-700">
                <Smartphone className="w-3 h-3 mr-1" />
                Connection Error
              </Badge>
            )}
          </div>
        </PageHeader>
        
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="plaud">
                <Smartphone className="w-4 h-4 mr-1" />
                Plaud Device
              </TabsTrigger>
              <TabsTrigger value="whisper">AI Recording</TabsTrigger>
              <TabsTrigger value="soap">SOAP Generation</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <ScribeDashboardTab />
            </TabsContent>

            <TabsContent value="plaud">
              <PlaudIntegration />
            </TabsContent>

            <TabsContent value="whisper">
              <EnhancedVoiceRecorder />
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
      </div>
    </SOAPProvider>
  );
};

export default ScribeIQ;
