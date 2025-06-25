
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, FileText, Brain, Activity, Settings, Shield, Zap, Smartphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AIVoiceRecorder } from "@/components/ai/AIVoiceRecorder";
import { PlaudIntegration } from "@/components/ai/PlaudIntegration";
import { useSOAPGeneration } from "@/hooks/useSOAPGeneration";

const ScribeIQ = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [currentTranscription, setCurrentTranscription] = useState("");
  const { 
    isGenerating, 
    generatedSOAP, 
    generateSOAPFromTranscription, 
    clearSOAP 
  } = useSOAPGeneration();

  const handleTranscriptionComplete = (transcription: string) => {
    setCurrentTranscription(transcription);
  };

  const handleGenerateSOAP = async () => {
    if (currentTranscription) {
      try {
        await generateSOAPFromTranscription(currentTranscription);
      } catch (error) {
        console.error('Failed to generate SOAP note:', error);
      }
    }
  };

  return (
    <Layout>
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

          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    AI Notes Generated
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">127</div>
                  <p className="text-sm text-gray-600">This week (+15%)</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mic className="w-5 h-5" />
                    Voice Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">89</div>
                  <p className="text-sm text-gray-600">AI transcribed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    AI Accuracy Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">98.5%</div>
                  <p className="text-sm text-gray-600">Transcription + SOAP</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-600" />
                  AI-Powered Features
                </CardTitle>
                <CardDescription>Advanced AI capabilities now active</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 border rounded-lg bg-blue-50">
                    <Mic className="w-5 h-5 text-blue-600" />
                    <div>
                      <h4 className="font-medium">Real-time Voice Transcription</h4>
                      <p className="text-sm text-gray-600">OpenAI Whisper integration</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Active</Badge>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg bg-blue-50">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div>
                      <h4 className="font-medium">AI SOAP Generation</h4>
                      <p className="text-sm text-gray-600">Structured note creation</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Transcriptions</CardTitle>
                <CardDescription>Latest voice-to-text sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Patient Session #{i}</p>
                        <p className="text-sm text-gray-600">SOAP note - 5 minutes</p>
                      </div>
                      <Badge variant="outline">Completed</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transcribe" className="space-y-4">
            <AIVoiceRecorder 
              onTranscriptionComplete={handleTranscriptionComplete}
              placeholder="Start recording to see AI-powered transcription appear here in real-time..."
            />
            
            {currentTranscription && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-purple-600" />
                    AI Actions
                  </CardTitle>
                  <CardDescription>
                    Transform your transcription with AI-powered tools
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3">
                    <Button 
                      onClick={handleGenerateSOAP}
                      disabled={isGenerating}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Brain className="w-4 w-4 mr-2" />
                      {isGenerating ? "Generating..." : "Generate SOAP Note"}
                    </Button>
                    <Button variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      Save Transcription
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="plaud" className="space-y-4">
            <PlaudIntegration />
          </TabsContent>

          <TabsContent value="soap" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  AI SOAP Generation
                </CardTitle>
                <CardDescription>
                  Generate structured SOAP notes from voice transcriptions using AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                {generatedSOAP ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-green-100 text-green-700">
                        <Brain className="w-3 h-3 mr-1" />
                        AI Generated
                      </Badge>
                      <Button onClick={clearSOAP} variant="outline" size="sm">
                        Clear
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-sm mb-2">Subjective</h4>
                        <div className="p-3 bg-gray-50 rounded border text-sm">
                          {generatedSOAP.subjective}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-2">Objective</h4>
                        <div className="p-3 bg-gray-50 rounded border text-sm">
                          {generatedSOAP.objective}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-2">Assessment</h4>
                        <div className="p-3 bg-gray-50 rounded border text-sm">
                          {generatedSOAP.assessment}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-2">Plan</h4>
                        <div className="p-3 bg-gray-50 rounded border text-sm whitespace-pre-line">
                          {generatedSOAP.plan}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button className="bg-green-600 hover:bg-green-700">
                        <FileText className="w-4 h-4 mr-2" />
                        Save to Patient Record
                      </Button>
                      <Button variant="outline">
                        Export
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">AI SOAP Generation Ready</p>
                    <p className="text-sm">Record voice transcription first, then generate structured SOAP notes</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>AI-Powered Templates</CardTitle>
                <CardDescription>Smart templates enhanced with AI suggestions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4" />
                  <p>AI template management coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>AI Scribe Settings</CardTitle>
                <CardDescription>Configure AI transcription and SOAP generation preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Settings className="w-12 h-12 mx-auto mb-4" />
                  <p>AI settings configuration coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ScribeIQ;
