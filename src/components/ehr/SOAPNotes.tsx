import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Plus, 
  Search,
  Brain,
  Save,
  User,
  Calendar,
  Clock,
  Mic,
  MicOff
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SOAPTemplateSelector } from "./SOAPTemplateSelector";
import { useSOAPNotes } from "@/hooks/useSOAPNotes";
import { useUserProfile } from "@/hooks/useUserProfile";

export const SOAPNotes = () => {
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const { soapNotes, loading } = useSOAPNotes();
  const { data: userProfile } = useUserProfile();

  // Convert database SOAP notes to display format
  const allNotes = soapNotes.map(note => ({
    id: note.id,
    patientName: "Patient", // In real app, would join with patients table
    date: note.visit_date,
    provider: "Provider", // In real app, would join with providers table
    status: note.status === 'draft' ? 'Draft' : 'Signed',
    subjective: note.subjective || '',
    objective: note.objective || '',
    assessment: note.assessment || '',
    plan: note.plan || '',
    generatedByAI: note.is_ai_generated,
    createdAt: note.created_at
  }));

  const filteredNotes = allNotes.filter(note =>
    note.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.subjective.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.assessment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search notes by patient, provider, or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowTemplates(!showTemplates)}>
            <FileText className="h-4 w-4 mr-2" />
            {showTemplates ? "Hide Templates" : "Show Templates"}
          </Button>
          <Button variant="outline" onClick={toggleRecording}>
            {isRecording ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
            {isRecording ? "Stop Recording" : "Voice Note"}
          </Button>
          <Button variant="outline">
            <Brain className="h-4 w-4 mr-2" />
            AI Assist
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New SOAP Note
          </Button>
        </div>
      </div>

      {showTemplates && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              SOAP Note Templates
            </CardTitle>
            <CardDescription>
              Select a template to quickly start a new SOAP note
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SOAPTemplateSelector
              specialty={userProfile?.specialty}
              onSelectTemplate={(template) => {
                console.log('Selected template:', template);
                // Here you would apply the template to a new SOAP note
                setShowTemplates(false);
              }}
            />
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notes List */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-lg font-semibold">Recent Notes</h3>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 border rounded-lg animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No SOAP notes found</p>
              {soapNotes.length === 0 && (
                <p className="text-xs mt-1">Create your first SOAP note using ScribeIQ</p>
              )}
            </div>
          ) : (
            filteredNotes.map((note) => (
            <Card 
              key={note.id} 
              className={`cursor-pointer transition-all ${
                selectedNote === note.id ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedNote(note.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{note.patientName}</CardTitle>
                  <Badge variant={note.status === 'Signed' ? 'default' : 'secondary'}>
                    {note.status}
                  </Badge>
                </div>
                <CardDescription className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <User className="h-3 w-3" />
                    {note.provider}
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Calendar className="h-3 w-3" />
                    {new Date(note.date).toLocaleDateString()}
                  </div>
                  {note.generatedByAI && (
                    <div className="flex items-center gap-2 text-xs text-blue-600">
                      <Brain className="h-3 w-3" />
                      AI Generated
                    </div>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {note.subjective}
                </p>
              </CardContent>
            </Card>
          ))
          )}
        </div>

        {/* SOAP Editor */}
        <div className="lg:col-span-2">
          {selectedNote ? (
            <SOAPEditor note={allNotes.find(n => n.id === selectedNote)!} />
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a SOAP Note</h3>
                <p className="text-gray-500 mb-4">
                  Choose a note from the list to view and edit
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Note
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

const SOAPEditor = ({ note }: { note: any }) => {
  const [formData, setFormData] = useState({
    subjective: note.subjective,
    objective: note.objective,
    assessment: note.assessment,
    plan: note.plan
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAIEnhance = () => {
    // AI enhancement logic would go here
    console.log("AI enhancing note...");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              SOAP Note - {note.patientName}
            </CardTitle>
            <CardDescription className="flex items-center gap-4 mt-1">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(note.date).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {note.provider}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(note.createdAt).toLocaleTimeString()}
              </span>
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleAIEnhance}>
              <Brain className="h-4 w-4 mr-2" />
              AI Enhance
            </Button>
            <Button size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="subjective" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="subjective">Subjective</TabsTrigger>
            <TabsTrigger value="objective">Objective</TabsTrigger>
            <TabsTrigger value="assessment">Assessment</TabsTrigger>
            <TabsTrigger value="plan">Plan</TabsTrigger>
          </TabsList>

          <TabsContent value="subjective" className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Subjective (Patient's Report)
              </label>
              <Textarea
                placeholder="What the patient tells you about their symptoms, pain level, etc."
                value={formData.subjective}
                onChange={(e) => handleInputChange('subjective', e.target.value)}
                className="min-h-[120px]"
              />
            </div>
          </TabsContent>

          <TabsContent value="objective" className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Objective (Your Observations)
              </label>
              <Textarea
                placeholder="Your clinical observations, measurements, test results, etc."
                value={formData.objective}
                onChange={(e) => handleInputChange('objective', e.target.value)}
                className="min-h-[120px]"
              />
            </div>
          </TabsContent>

          <TabsContent value="assessment" className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Assessment (Your Diagnosis)
              </label>
              <Textarea
                placeholder="Your professional assessment and diagnosis"
                value={formData.assessment}
                onChange={(e) => handleInputChange('assessment', e.target.value)}
                className="min-h-[120px]"
              />
            </div>
          </TabsContent>

          <TabsContent value="plan" className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Plan (Treatment Plan)
              </label>
              <Textarea
                placeholder="Treatment plan, follow-up instructions, medications, etc."
                value={formData.plan}
                onChange={(e) => handleInputChange('plan', e.target.value)}
                className="min-h-[120px]"
              />
            </div>
          </TabsContent>
        </Tabs>

        {note.generatedByAI && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <Brain className="h-4 w-4" />
              This note was generated with AI assistance and should be reviewed for accuracy.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
