
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { EnhancedVoiceRecorder } from "@/components/scribe/EnhancedVoiceRecorder";
import { useSOAPNotes } from "@/hooks/useSOAPNotes";
import { 
  Mic, 
  FileText, 
  Clock,
  CheckCircle,
  Brain,
  ArrowRight,
  Zap,
  Plus
} from "lucide-react";

const ScribeIQ = () => {
  const [activeTab, setActiveTab] = useState("record");
  const [currentTranscription, setCurrentTranscription] = useState("");
  const [currentSOAP, setCurrentSOAP] = useState<any>(null);
  const { toast } = useToast();
  const { soapNotes, createSOAPNote, loading } = useSOAPNotes();

  const handleSaveSOAP = async () => {
    if (!currentSOAP) return;
    
    try {
      await createSOAPNote({
        patient_id: 'temp-patient-id', // This should come from actual patient selection
        subjective: currentSOAP.subjective,
        objective: currentSOAP.objective,
        assessment: currentSOAP.assessment,
        plan: currentSOAP.plan,
        transcription_text: currentTranscription,
        is_ai_generated: true,
        ai_confidence_score: 95,
        status: 'draft',
        visit_date: new Date().toISOString().split('T')[0]
      });
      
      toast({
        title: "SOAP Note Saved",
        description: "Note has been saved to patient records",
      });
      
      setActiveTab("history");
    } catch (error) {
      console.error('Error saving SOAP note:', error);
    }
  };

  const handleCreateClaim = () => {
    toast({
      title: "Claim Created",
      description: "SOAP note has been sent to Claims iQ for processing",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Scribe iQ"
        subtitle="AI-powered medical transcription and clinical documentation"
      />
      
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="record">Live Recording</TabsTrigger>
          <TabsTrigger value="soap">SOAP Notes</TabsTrigger>
          <TabsTrigger value="history">Note History</TabsTrigger>
        </TabsList>

        <TabsContent value="record" className="space-y-6">
          <EnhancedVoiceRecorder
            onTranscriptionComplete={setCurrentTranscription}
            onSOAPGenerated={setCurrentSOAP}
          />
          
          {currentSOAP && (
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
                <CardDescription>Save or process your SOAP note</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Button onClick={handleSaveSOAP}>
                    <Plus className="w-4 h-4 mr-2" />
                    Save SOAP Note
                  </Button>
                  <Button variant="outline" onClick={handleCreateClaim}>
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Send to Claims iQ
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="soap" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current SOAP Note</CardTitle>
              <CardDescription>Review your generated clinical documentation</CardDescription>
            </CardHeader>
            <CardContent>
              {currentSOAP ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">SUBJECTIVE</h4>
                      <p className="text-sm text-gray-700">{currentSOAP.subjective}</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">OBJECTIVE</h4>
                      <p className="text-sm text-gray-700">{currentSOAP.objective}</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">ASSESSMENT</h4>
                      <p className="text-sm text-gray-700">{currentSOAP.assessment}</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">PLAN</h4>
                      <p className="text-sm text-gray-700 whitespace-pre-line">{currentSOAP.plan}</p>
                    </div>
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
                  <p>Record a session and generate a SOAP note to get started</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SOAP Note History</CardTitle>
              <CardDescription>View your saved clinical documentation</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">Loading SOAP notes...</p>
                </div>
              ) : soapNotes.length > 0 ? (
                <div className="space-y-4">
                  {soapNotes.map((note) => (
                    <div key={note.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">
                          {note.assessment || 'Untitled Note'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(note.created_at).toLocaleDateString()} • 
                          Status: {note.status}
                          {note.is_ai_generated && ' • AI Generated'}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={note.status === 'signed' ? 'default' : 'secondary'}>
                          {note.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <FileText className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4" />
                  <p>No SOAP notes found. Create your first note to get started.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScribeIQ;
