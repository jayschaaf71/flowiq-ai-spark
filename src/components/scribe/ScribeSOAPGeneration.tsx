import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Brain, FileText, Copy, Download, User, Stethoscope, Code } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSOAPNotes } from "@/hooks/useSOAPNotes";
import { usePatientSelection } from "@/hooks/usePatientSelection";
import { PatientSearchDialog } from "@/components/ehr/PatientSearchDialog";
import { useEnhancedMedicalAI } from "@/hooks/useEnhancedMedicalAI";
import { useState } from "react";

export const ScribeSOAPGeneration = () => {
  const { enhancedSOAP, isProcessing, resetEnhancedData } = useEnhancedMedicalAI();
  const { toast } = useToast();
  const { createSOAPNote } = useSOAPNotes();
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedSOAP, setEditedSOAP] = useState<any>(null);
  const { selectedPatient, isSearchOpen, selectPatient, openSearch, closeSearch } = usePatientSelection();

  console.log('ScribeSOAPGeneration render - enhancedSOAP:', enhancedSOAP);
  console.log('ScribeSOAPGeneration render - isProcessing:', isProcessing);

  const copyToClipboard = async () => {
    if (!enhancedSOAP) return;
    
    const soapText = `SOAP NOTE - Enhanced AI Generated
    
Subjective:
${enhancedSOAP.subjective}

Objective:
${enhancedSOAP.objective}

Assessment:
${enhancedSOAP.assessment}

Plan:
${enhancedSOAP.plan}

${enhancedSOAP.icd10Codes?.length ? `\nICD-10 Codes: ${enhancedSOAP.icd10Codes.join(', ')}` : ''}
${enhancedSOAP.suggestedCPTCodes?.length ? `\nSuggested CPT Codes: ${enhancedSOAP.suggestedCPTCodes.join(', ')}` : ''}
${enhancedSOAP.clinicalFlags?.length ? `\nClinical Flags: ${enhancedSOAP.clinicalFlags.join(', ')}` : ''}`;

    try {
      await navigator.clipboard.writeText(soapText);
      toast({
        title: "Copied to Clipboard",
        description: "Enhanced SOAP note has been copied to your clipboard",
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
    if (!enhancedSOAP) return;
    
    const soapText = `SOAP NOTE - ${new Date().toLocaleDateString()} - Enhanced AI Generated
    
Subjective:
${enhancedSOAP.subjective}

Objective:
${enhancedSOAP.objective}

Assessment:
${enhancedSOAP.assessment}

Plan:
${enhancedSOAP.plan}

${enhancedSOAP.icd10Codes?.length ? `\nICD-10 Codes: ${enhancedSOAP.icd10Codes.join(', ')}` : ''}
${enhancedSOAP.suggestedCPTCodes?.length ? `\nSuggested CPT Codes: ${enhancedSOAP.suggestedCPTCodes.join(', ')}` : ''}
${enhancedSOAP.clinicalFlags?.length ? `\nClinical Flags: ${enhancedSOAP.clinicalFlags.join(', ')}` : ''}
${enhancedSOAP.confidence ? `\nAI Confidence: ${Math.round(enhancedSOAP.confidence * 100)}%` : ''}`;

    const blob = new Blob([soapText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `enhanced-soap-note-${new Date().toISOString().split('T')[0]}.txt`;
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
    if (!enhancedSOAP || !selectedPatient) return;
    
    setIsSaving(true);
    try {
      await createSOAPNote({
        subjective: enhancedSOAP.subjective,
        objective: enhancedSOAP.objective,
        assessment: enhancedSOAP.assessment,
        plan: enhancedSOAP.plan,
        is_ai_generated: true,
        ai_confidence_score: enhancedSOAP.confidence ? Math.round(enhancedSOAP.confidence * 100) : 85,
        status: 'draft',
        visit_date: new Date().toISOString().split('T')[0],
        patient_id: selectedPatient.id,
      });
      
      toast({
        title: "Enhanced SOAP Note Saved",
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
    if (!enhancedSOAP) return;
    setIsEditing(true);
    setEditedSOAP({ ...enhancedSOAP });
  };

  const handleSaveEdits = () => {
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
            Enhanced AI SOAP Generation
          </CardTitle>
          <CardDescription>
            Generate structured SOAP notes with specialty-aware AI and medical intelligence
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isProcessing ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-lg font-medium">Enhanced AI is generating SOAP note...</p>
                <p className="text-sm text-muted-foreground">Processing medical terminology and specialty-specific content</p>
              </div>
            </div>
          ) : enhancedSOAP ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex gap-2">
                  <Badge className="bg-green-100 text-green-700">
                    <Brain className="w-3 h-3 mr-1" />
                    Enhanced AI Generated
                  </Badge>
                  {enhancedSOAP.specialty && (
                    <Badge className="bg-blue-100 text-blue-700">
                      <Stethoscope className="w-3 h-3 mr-1" />
                      {enhancedSOAP.specialty}
                    </Badge>
                  )}
                  {enhancedSOAP.confidence && (
                    <Badge className="bg-purple-100 text-purple-700">
                      {Math.round(enhancedSOAP.confidence * 100)}% Confidence
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button onClick={copyToClipboard} variant="outline" size="sm">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                  <Button onClick={downloadSOAP} variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button onClick={resetEnhancedData} variant="outline" size="sm">
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
                      {enhancedSOAP.subjective}
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
                      {enhancedSOAP.objective}
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
                      {enhancedSOAP.assessment}
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
                      {enhancedSOAP.plan}
                    </div>
                  )}
                </div>

                {/* Enhanced AI Features */}
                {(enhancedSOAP.icd10Codes?.length || enhancedSOAP.suggestedCPTCodes?.length || enhancedSOAP.clinicalFlags?.length) && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-sm mb-3 text-primary flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      Medical Intelligence
                    </h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      {enhancedSOAP.icd10Codes?.length > 0 && (
                        <div>
                          <h5 className="text-xs font-medium mb-2 text-muted-foreground">ICD-10 Codes</h5>
                          <div className="space-y-1">
                            {enhancedSOAP.icd10Codes.map((code, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {code}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {enhancedSOAP.suggestedCPTCodes?.length > 0 && (
                        <div>
                          <h5 className="text-xs font-medium mb-2 text-muted-foreground">CPT Codes</h5>
                          <div className="space-y-1">
                            {enhancedSOAP.suggestedCPTCodes.map((code, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {code}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {enhancedSOAP.clinicalFlags?.length > 0 && (
                        <div>
                          <h5 className="text-xs font-medium mb-2 text-muted-foreground">Clinical Flags</h5>
                          <div className="space-y-1">
                            {enhancedSOAP.clinicalFlags.map((flag, index) => (
                              <Badge key={index} variant="destructive" className="text-xs">
                                {flag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
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
              <p className="text-lg font-medium mb-2">Enhanced AI SOAP Generation Ready</p>
              <p className="text-sm">Go to 'Live Recording' tab, record or load test transcription, then generate enhanced SOAP notes with medical intelligence</p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};