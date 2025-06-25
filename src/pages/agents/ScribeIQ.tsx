
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, FileText, Brain, Activity, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ScribeIQ = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <Layout>
      <PageHeader 
        title="Scribe iQ"
        subtitle="AI-powered medical documentation and voice transcription"
      >
        <Badge className="bg-blue-100 text-blue-700">AI Agent</Badge>
      </PageHeader>
      
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="transcribe">Voice Transcription</TabsTrigger>
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
                    Notes Generated
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">87</div>
                  <p className="text-sm text-gray-600">This week</p>
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
                  <div className="text-2xl font-bold">124</div>
                  <p className="text-sm text-gray-600">Total recorded</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Accuracy Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">96%</div>
                  <p className="text-sm text-gray-600">Transcription accuracy</p>
                </CardContent>
              </Card>
            </div>

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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="w-5 h-5" />
                  Voice Transcription
                </CardTitle>
                <CardDescription>Record and transcribe patient encounters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Button size="lg" className="bg-red-600 hover:bg-red-700">
                    <Mic className="w-5 h-5 mr-2" />
                    Start Recording
                  </Button>
                  <p className="text-sm text-gray-600 mt-4">Click to begin voice transcription</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="soap" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>AI SOAP Generation</CardTitle>
                <CardDescription>Generate structured SOAP notes from transcriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Brain className="w-12 h-12 mx-auto mb-4" />
                  <p>SOAP generation features coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Documentation Templates</CardTitle>
                <CardDescription>Pre-built templates for common procedures</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4" />
                  <p>Template management coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Scribe Settings</CardTitle>
                <CardDescription>Configure voice recognition and documentation preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Settings className="w-12 h-12 mx-auto mb-4" />
                  <p>Settings configuration coming soon...</p>
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
