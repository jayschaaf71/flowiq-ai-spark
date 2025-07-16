
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Shield, Smartphone } from "lucide-react";
import { ScribeDashboardTab } from "@/components/scribe/ScribeDashboardTab";
import { ScribeLiveRecording } from "@/components/scribe/ScribeLiveRecording";
import { EnhancedVoiceRecorder } from "@/components/scribe/EnhancedVoiceRecorder";
import { ScribeSOAPGeneration } from "@/components/scribe/ScribeSOAPGeneration";
import { ScribeTemplatesTab } from "@/components/scribe/ScribeTemplatesTab";
import { ScribeSettingsTab } from "@/components/scribe/ScribeSettingsTab";
import { SOAPProvider } from "@/contexts/SOAPContext";
import { useSpecialty } from "@/contexts/SpecialtyContext";
import { MobileRecordingWidget } from "@/components/scribe/MobileRecordingWidget";

const ScribeIQ = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { getBrandName } = useSpecialty();

  // Mobile detection
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    typeof navigator !== 'undefined' ? navigator.userAgent : ''
  );

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
          </div>
        </PageHeader>
        
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="whisper">AI Recording</TabsTrigger>
              <TabsTrigger value="soap">SOAP Generation</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <ScribeDashboardTab />
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

        {/* Mobile Quick Recording Widget - Only show on mobile and not on whisper tab */}
        {isMobile && activeTab !== 'whisper' && (
          <MobileRecordingWidget 
            onTranscriptionComplete={(transcription) => {
              // Switch to whisper tab when transcription is complete
              setActiveTab('whisper');
            }}
          />
        )}
      </div>
    </SOAPProvider>
  );
};

export default ScribeIQ;
