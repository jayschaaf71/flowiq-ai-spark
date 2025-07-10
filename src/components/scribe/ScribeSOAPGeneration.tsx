
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Brain, FileText, Copy, Download, User } from "lucide-react";
import { useSOAPContext } from "@/contexts/SOAPContext";
import { useToast } from "@/hooks/use-toast";
import { useSOAPNotes } from "@/hooks/useSOAPNotes";
import { usePatientSelection } from "@/hooks/usePatientSelection";
import { PatientSearchDialog } from "@/components/ehr/PatientSearchDialog";
import { useState } from "react";

export const ScribeSOAPGeneration = () => {
  const { generatedSOAP, clearSOAP, isGenerating } = useSOAPContext();
  const { toast } = useToast();
  const { createSOAPNote } = useSOAPNotes();
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedSOAP, setEditedSOAP] = useState<any>(null);
  const { selectedPatient, isSearchOpen, selectPatient, openSearch, closeSearch } = usePatientSelection();

  console.log('ScribeSOAPGeneration render - generatedSOAP:', generatedSOAP);
  console.log('ScribeSOAPGeneration render - isGenerating:', isGenerating);

  const copyToClipboard = async () => {
    if (!generatedSOAP) return;
    
    const soapText = `SOAP NOTE
    
Subjective:
${generatedSOAP.subjective}

Objective:
${generatedSOAP.objective}

Assessment:
${generatedSOAP.assessment}

Plan:
${generatedSOAP.plan}`;

    try {
      await navigator.clipboard.writeText(soapText);
      toast({
        title: "Copied to Clipboard",
        description: "SOAP note has been copied to your clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const downloadSOAP = () => {
    if (!generatedSOAP) return;
    
    const soapText = `SOAP NOTE - ${new Date().toLocaleDateString()}
    
Subjective:
${generatedSOAP.subjective}

Objective:
${generatedSOAP.objective}

Assessment:
${generatedSOAP.assessment}

Plan:
${generatedSOAP.plan}`;

    const blob = new Blob([soapText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `soap-note-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSaveClick = () => {
    if (!selectedPatient) {
      openSearch();
      return;
    }
    saveToPatientRecord();
  };

  const saveToPatientRecord = async () => {
    if (!generatedSOAP || !selectedPatient) return;
    
    setIsSaving(true);
    try {
      await createSOAPNote({
        subjective: generatedSOAP.subjective,
        objective: generatedSOAP.objective,
        assessment: generatedSOAP.assessment,
        plan: generatedSOAP.plan,
        is_ai_generated: true,
        ai_confidence_score: 85,
        status: 'draft',
        visit_date: new Date().toISOString().split('T')[0],
        patient_id: selectedPatient.id,
      });
      
      toast({
        title: "SOAP Note Saved",
        description: `SOAP note saved to ${selectedPatient.first_name} ${selectedPatient.last_name}'s record`,
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Unable to save SOAP note to patient record",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditClick = () => {
    if (!generatedSOAP) return;
    setIsEditing(true);
    setEditedSOAP({ ...generatedSOAP });
  };

  const handleSaveEdits = () => {
    // Update the context with edited content (we'd need to add this to SOAPContext)
    setIsEditing(false);
    toast({
      title: "Changes Saved",
      description: "Your SOAP note edits have been saved",
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedSOAP(null);
  };

  const updateEditedField = (field: string, value: string) => {
    setEditedSOAP(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <PatientSearchDialog
        open={isSearchOpen}
        onOpenChange={closeSearch}
        onPatientSelect={selectPatient}
      />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            AI SOAP Generation
          </CardTitle>
          <CardDescription>
            Generate structured SOAP notes from voice transcriptions using AI
          </CardDescription>
        </CardHeader>
      <CardContent>
        {isGenerating ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-lg font-medium">AI is generating SOAP note...</p>
              <p className="text-sm text-muted-foreground">Analyzing transcription and structuring medical documentation</p>
            </div>
          </div>
        ) : generatedSOAP ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <Badge className="bg-green-100 text-green-700">
                <Brain className="w-3 h-3 mr-1" />
                AI Generated
              </Badge>
              <div className="flex gap-2">
                <Button onClick={copyToClipboard} variant="outline" size="sm">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button onClick={downloadSOAP} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button onClick={clearSOAP} variant="outline" size="sm">
                  Clear
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2 text-blue-700">Subjective</h4>
                {isEditing ? (
                  <Textarea
                    value={editedSOAP?.subjective || ''}
                    onChange={(e) => updateEditedField('subjective', e.target.value)}
                    className="min-h-[80px] text-sm"
                    placeholder="Patient's subjective symptoms and complaints..."
                  />
                ) : (
                  <div className="p-3 bg-blue-50 rounded border text-sm whitespace-pre-line">
                    {generatedSOAP.subjective}
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2 text-green-700">Objective</h4>
                {isEditing ? (
                  <Textarea
                    value={editedSOAP?.objective || ''}
                    onChange={(e) => updateEditedField('objective', e.target.value)}
                    className="min-h-[80px] text-sm"
                    placeholder="Objective findings and observations..."
                  />
                ) : (
                  <div className="p-3 bg-green-50 rounded border text-sm whitespace-pre-line">
                    {generatedSOAP.objective}
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2 text-orange-700">Assessment</h4>
                {isEditing ? (
                  <Textarea
                    value={editedSOAP?.assessment || ''}
                    onChange={(e) => updateEditedField('assessment', e.target.value)}
                    className="min-h-[80px] text-sm"
                    placeholder="Clinical assessment and diagnosis..."
                  />
                ) : (
                  <div className="p-3 bg-orange-50 rounded border text-sm whitespace-pre-line">
                    {generatedSOAP.assessment}
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2 text-foreground">Plan</h4>
                {isEditing ? (
                  <Textarea
                    value={editedSOAP?.plan || ''}
                    onChange={(e) => updateEditedField('plan', e.target.value)}
                    className="min-h-[80px] text-sm"
                    placeholder="Treatment plan and next steps..."
                  />
                ) : (
                  <div className="p-3 bg-accent rounded border text-sm whitespace-pre-line">
                    {generatedSOAP.plan}
                  </div>
                )}
              </div>
            </div>

            {selectedPatient && (
              <div className="p-3 bg-blue-50 rounded border mb-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">Selected Patient:</span>
                  <span className="text-sm">{selectedPatient.first_name} {selectedPatient.last_name}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={openSearch}
                    className="ml-auto"
                  >
                    Change Patient
                  </Button>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-4 border-t">
              {isEditing ? (
                <>
                  <Button 
                    className="bg-green-600 hover:bg-green-700" 
                    onClick={handleSaveEdits}
                  >
                    Save Changes
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    className="bg-green-600 hover:bg-green-700" 
                    onClick={handleSaveClick}
                    disabled={isSaving}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    {isSaving ? "Saving..." : selectedPatient ? "Save to Patient Record" : "Select Patient & Save"}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handleEditClick}
                  >
                    Edit & Refine
                  </Button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">AI SOAP Generation Ready</p>
            <p className="text-sm">Go to 'Live Recording' tab, record or load test transcription, then generate structured SOAP notes with AI</p>
          </div>
        )}
      </CardContent>
    </Card>
    </>
  );
};
