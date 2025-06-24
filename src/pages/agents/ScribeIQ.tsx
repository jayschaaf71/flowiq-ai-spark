
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Square, 
  FileText, 
  Sparkles, 
  Clock,
  CheckCircle,
  Brain,
  ArrowRight,
  Zap
} from "lucide-react";

const ScribeIQ = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [soapNote, setSoapNote] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("record");
  const { toast } = useToast();

  const sampleTranscription = `Patient presents with chief complaint of tooth pain in the upper right quadrant. Pain started 3 days ago, described as sharp and throbbing, worsening with cold foods. Patient reports difficulty sleeping due to pain. No fever or facial swelling noted. Medical history significant for hypertension, currently taking lisinopril. No known drug allergies. On examination, tooth #3 shows large carious lesion on mesial surface. Percussion test positive. Radiographic examination reveals periapical radiolucency consistent with abscess. Diagnosis: Acute apical abscess tooth #3. Treatment plan: Emergency endodontic therapy, antibiotic therapy with amoxicillin 500mg TID for 7 days, ibuprofen for pain management.`;

  const sampleSoapNote = {
    subjective: "Patient presents with chief complaint of severe tooth pain in upper right quadrant, onset 3 days ago. Pain described as sharp, throbbing, 8/10 severity. Worsens with cold stimuli. Difficulty sleeping. Denies fever, facial swelling.",
    objective: "Vital signs stable. Extraoral exam: No facial asymmetry or lymphadenopathy. Intraoral exam: Tooth #3 large mesial carious lesion, tender to percussion. Radiographic findings: Periapical radiolucency consistent with abscess.",
    assessment: "Acute apical abscess, tooth #3 (maxillary right first molar)",
    plan: "1. Emergency endodontic therapy\n2. Amoxicillin 500mg TID x 7 days\n3. Ibuprofen 600mg q6h PRN pain\n4. Follow-up in 1 week\n5. Patient education on oral hygiene"
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    toast({
      title: "Recording Started",
      description: "AI is now listening and transcribing in real-time",
    });
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setTranscription(sampleTranscription);
      setIsProcessing(false);
      toast({
        title: "Transcription Complete",
        description: "Audio has been processed and transcribed",
      });
    }, 2000);
  };

  const handleGenerateSOAP = () => {
    setIsProcessing(true);
    
    // Simulate SOAP generation
    setTimeout(() => {
      setSoapNote(JSON.stringify(sampleSoapNote, null, 2));
      setIsProcessing(false);
      setActiveTab("soap");
      toast({
        title: "SOAP Note Generated",
        description: "AI has structured your notes into SOAP format",
      });
    }, 1500);
  };

  const handleCreateClaim = () => {
    toast({
      title: "Claim Created",
      description: "SOAP note has been sent to Claims iQ for processing",
    });
  };

  const recentSessions = [
    { id: 1, patient: "John Smith", date: "2024-01-24", duration: "15 min", status: "completed" },
    { id: 2, patient: "Sarah Johnson", date: "2024-01-24", duration: "22 min", status: "completed" },
    { id: 3, patient: "Mike Wilson", date: "2024-01-23", duration: "18 min", status: "completed" },
  ];

  return (
    <Layout>
      <PageHeader 
        title="Scribe iQ"
        subtitle="AI-powered medical transcription and clinical documentation"
      />
      
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Sessions</CardTitle>
              <Mic className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+3 from yesterday</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Session Time</CardTitle>
              <Clock className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18m</div>
              <p className="text-xs text-muted-foreground">-2m from last week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accuracy Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98.5%</div>
              <p className="text-xs text-muted-foreground">+0.2% this month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
              <Zap className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.2h</div>
              <p className="text-xs text-muted-foreground">Per day average</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="record">Live Recording</TabsTrigger>
            <TabsTrigger value="transcription">Transcription</TabsTrigger>
            <TabsTrigger value="soap">SOAP Notes</TabsTrigger>
            <TabsTrigger value="history">Session History</TabsTrigger>
          </TabsList>

          <TabsContent value="record" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-600" />
                  AI-Powered Live Transcription
                </CardTitle>
                <CardDescription>
                  Start recording to capture and transcribe patient encounters in real-time
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className={`w-32 h-32 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                    isRecording 
                      ? 'border-red-500 bg-red-50 animate-pulse' 
                      : 'border-gray-300 bg-gray-50'
                  }`}>
                    {isRecording ? (
                      <Mic className="w-16 h-16 text-red-500" />
                    ) : (
                      <MicOff className="w-16 h-16 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="text-center">
                    <p className="text-lg font-medium mb-2">
                      {isRecording ? 'Recording in Progress' : 'Ready to Record'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {isRecording 
                        ? 'AI is transcribing your conversation in real-time' 
                        : 'Click the button below to start recording'
                      }
                    </p>
                  </div>

                  {isRecording && (
                    <div className="w-full max-w-md">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-sm">Live transcription active</span>
                      </div>
                      <Progress value={65} className="w-full" />
                      <p className="text-xs text-muted-foreground mt-1">Recording quality: Excellent</p>
                    </div>
                  )}

                  <div className="flex gap-4">
                    {!isRecording ? (
                      <Button 
                        onClick={handleStartRecording}
                        className="bg-red-600 hover:bg-red-700"
                        size="lg"
                      >
                        <Mic className="w-4 h-4 mr-2" />
                        Start Recording
                      </Button>
                    ) : (
                      <Button 
                        onClick={handleStopRecording}
                        variant="outline"
                        size="lg"
                      >
                        <Square className="w-4 h-4 mr-2" />
                        Stop Recording
                      </Button>
                    )}
                  </div>
                </div>

                {isProcessing && (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">Processing audio and generating transcription...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transcription" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Raw Transcription</CardTitle>
                    <CardDescription>Review and edit the AI-generated transcription</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleGenerateSOAP}
                      disabled={!transcription || isProcessing}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate SOAP
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Transcription will appear here after recording..."
                  value={transcription}
                  onChange={(e) => setTranscription(e.target.value)}
                  className="min-h-[300px]"
                />
                {transcription && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        Transcription confidence: 98.5%
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="soap" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>SOAP Note</CardTitle>
                    <CardDescription>AI-structured clinical documentation</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button 
                      size="sm"
                      onClick={handleCreateClaim}
                      disabled={!soapNote}
                    >
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Send to Claims iQ
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {soapNote ? (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-blue-800">AI-Generated SOAP Note</span>
                      </div>
                      <pre className="text-sm whitespace-pre-wrap text-blue-700">
                        {soapNote}
                      </pre>
                    </div>
                    
                    <div className="flex items-center gap-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-800">Ready for Claims Processing</p>
                        <p className="text-sm text-green-700">This SOAP note is formatted for automatic claim generation</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-4" />
                    <p>Generate a SOAP note from your transcription to get started</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Sessions</CardTitle>
                <CardDescription>Review your recent transcription sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{session.patient}</p>
                        <p className="text-sm text-muted-foreground">
                          {session.date} • {session.duration}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="default">
                          {session.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <FileText className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
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
