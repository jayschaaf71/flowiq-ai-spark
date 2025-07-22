import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Brain, 
  Save, 
  Wand2, 
  FileText, 
  Mic, 
  MicOff,
  Loader2,
  CheckCircle,
  Clock,
  Stethoscope
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface SOAPNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  fullNote?: string;
}

interface MedicalCode {
  code: string;
  description: string;
  confidence: number;
  rationale: string;
  modifiers?: string[];
}

interface CodingResult {
  diagnosisCodes: MedicalCode[];
  procedureCodes: MedicalCode[];
  evaluationCodes: MedicalCode[];
  summary: string;
}

export const SmartClinicalNotes = () => {
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [soapNote, setSoapNote] = useState<SOAPNote | null>(null);
  const [codingResult, setCodingResult] = useState<CodingResult | null>(null);
  const [isGeneratingSoap, setIsGeneratingSoap] = useState(false);
  const [isAnalyzingCoding, setIsAnalyzingCoding] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [activeTab, setActiveTab] = useState('notes');

  // Mock patient data - replace with actual patient context
  const patientData = {
    name: 'John Doe',
    age: 45,
    gender: 'Male',
    medicalHistory: ['Hypertension', 'Type 2 Diabetes'],
    currentMedications: ['Lisinopril 10mg', 'Metformin 500mg'],
    allergies: ['Penicillin']
  };

  const handleGenerateSOAP = async () => {
    if (!clinicalNotes.trim()) {
      toast.error('Please enter clinical notes first');
      return;
    }

    setIsGeneratingSoap(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-soap-generation', {
        body: {
          patientData,
          clinicalNotes,
          appointmentType: 'Follow-up',
          specialty: 'Chiropractic'
        }
      });

      if (error) throw error;

      setSoapNote(data.soapNote);
      setActiveTab('soap');
      toast.success('SOAP note generated successfully');
    } catch (error) {
      console.error('Error generating SOAP note:', error);
      toast.error('Failed to generate SOAP note');
    } finally {
      setIsGeneratingSoap(false);
    }
  };

  const handleAnalyzeCoding = async () => {
    const textToAnalyze = soapNote?.fullNote || clinicalNotes;
    if (!textToAnalyze.trim()) {
      toast.error('Please enter clinical documentation first');
      return;
    }

    setIsAnalyzingCoding(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-medical-coding', {
        body: {
          clinicalText: textToAnalyze,
          specialty: 'Chiropractic',
          appointmentType: 'Follow-up'
        }
      });

      if (error) throw error;

      setCodingResult(data);
      setActiveTab('coding');
      toast.success('Medical coding analysis completed');
    } catch (error) {
      console.error('Error analyzing medical coding:', error);
      toast.error('Failed to analyze medical coding');
    } finally {
      setIsAnalyzingCoding(false);
    }
  };

  const handleSaveNotes = async () => {
    try {
      // Save to medical_records table
      const { error } = await supabase
        .from('medical_records')
        .insert({
          patient_id: patientData.name, // Replace with actual patient ID
          record_type: 'clinical_note',
          content: JSON.parse(JSON.stringify({
            clinical_notes: clinicalNotes,
            soap_note: soapNote,
            coding_result: codingResult,
            created_at: new Date().toISOString()
          }))
        });

      if (error) throw error;

      toast.success('Clinical notes saved successfully');
    } catch (error) {
      console.error('Error saving notes:', error);
      toast.error('Failed to save notes');
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    // Implement voice recording functionality
    toast.info('Voice recording started');
  };

  const stopRecording = () => {
    setIsRecording(false);
    // Implement voice-to-text conversion
    toast.info('Voice recording stopped');
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 8) return <Badge variant="default">High</Badge>;
    if (confidence >= 6) return <Badge variant="secondary">Medium</Badge>;
    return <Badge variant="destructive">Low</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Smart Clinical Notes</h2>
          <p className="text-muted-foreground">
            AI-powered clinical documentation and coding assistance
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSaveNotes} variant="outline">
            <Save className="mr-2 h-4 w-4" />
            Save Notes
          </Button>
          <Button onClick={handleGenerateSOAP} disabled={isGeneratingSoap}>
            {isGeneratingSoap ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Brain className="mr-2 h-4 w-4" />
            )}
            Generate SOAP
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="notes">Clinical Notes</TabsTrigger>
          <TabsTrigger value="soap">SOAP Note</TabsTrigger>
          <TabsTrigger value="coding">Medical Coding</TabsTrigger>
        </TabsList>

        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                Clinical Documentation
              </CardTitle>
              <CardDescription>
                Enter clinical observations, patient complaints, and examination findings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 mb-4">
                <Button
                  variant={isRecording ? "destructive" : "outline"}
                  size="sm"
                  onClick={isRecording ? stopRecording : startRecording}
                >
                  {isRecording ? (
                    <>
                      <MicOff className="mr-2 h-4 w-4" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="mr-2 h-4 w-4" />
                      Voice Input
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm">
                  <Wand2 className="mr-2 h-4 w-4" />
                  Smart Suggestions
                </Button>
              </div>

              <Textarea
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                placeholder="Enter clinical notes here...

Example:
Chief Complaint: Lower back pain
History: 45-year-old male presents with acute lower back pain that started 3 days ago after lifting heavy objects at work. Pain is described as sharp, radiating to the right leg. Patient rates pain as 7/10.

Physical Examination:
- Vital signs: BP 130/80, HR 78, Temp 98.6°F
- Range of motion limited in lumbar flexion
- Positive straight leg raise test on right side
- Tenderness over L4-L5 region
- No neurological deficits noted"
                className="min-h-[300px]"
              />

              <div className="flex gap-2">
                <Button onClick={handleGenerateSOAP} disabled={isGeneratingSoap}>
                  {isGeneratingSoap ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Brain className="mr-2 h-4 w-4" />
                  )}
                  Generate SOAP Note
                </Button>
                <Button onClick={handleAnalyzeCoding} disabled={isAnalyzingCoding}>
                  {isAnalyzingCoding ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <FileText className="mr-2 h-4 w-4" />
                  )}
                  Analyze Coding
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="soap" className="space-y-4">
          {soapNote ? (
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Subjective</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={soapNote.subjective}
                    onChange={(e) => setSoapNote({...soapNote, subjective: e.target.value})}
                    className="min-h-[120px]"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Objective</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={soapNote.objective}
                    onChange={(e) => setSoapNote({...soapNote, objective: e.target.value})}
                    className="min-h-[120px]"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={soapNote.assessment}
                    onChange={(e) => setSoapNote({...soapNote, assessment: e.target.value})}
                    className="min-h-[120px]"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={soapNote.plan}
                    onChange={(e) => setSoapNote({...soapNote, plan: e.target.value})}
                    className="min-h-[120px]"
                  />
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Generate a SOAP note from your clinical notes
                  </p>
                  <Button 
                    onClick={handleGenerateSOAP} 
                    disabled={isGeneratingSoap}
                    className="mt-4"
                  >
                    {isGeneratingSoap ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Brain className="mr-2 h-4 w-4" />
                    )}
                    Generate SOAP Note
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="coding" className="space-y-4">
          {codingResult ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Diagnosis Codes (ICD-10-CM)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {codingResult.diagnosisCodes.map((code, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <code className="font-mono text-sm bg-muted px-2 py-1 rounded">
                            {code.code}
                          </code>
                          {getConfidenceBadge(code.confidence)}
                        </div>
                        <p className="text-sm font-medium">{code.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{code.rationale}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Procedure Codes (CPT)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {codingResult.procedureCodes.map((code, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <code className="font-mono text-sm bg-muted px-2 py-1 rounded">
                            {code.code}
                          </code>
                          {getConfidenceBadge(code.confidence)}
                          {code.modifiers && code.modifiers.map((modifier, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {modifier}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-sm font-medium">{code.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{code.rationale}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {codingResult.evaluationCodes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Evaluation & Management (E&M)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {codingResult.evaluationCodes.map((code, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <code className="font-mono text-sm bg-muted px-2 py-1 rounded">
                              {code.code}
                            </code>
                            {getConfidenceBadge(code.confidence)}
                          </div>
                          <p className="text-sm font-medium">{code.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{code.rationale}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              <Alert>
                <Brain className="h-4 w-4" />
                <AlertDescription>
                  <strong>AI Coding Summary:</strong> {codingResult.summary}
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Analyze clinical documentation for medical coding
                  </p>
                  <Button 
                    onClick={handleAnalyzeCoding} 
                    disabled={isAnalyzingCoding}
                    className="mt-4"
                  >
                    {isAnalyzingCoding ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <FileText className="mr-2 h-4 w-4" />
                    )}
                    Analyze Medical Coding
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};