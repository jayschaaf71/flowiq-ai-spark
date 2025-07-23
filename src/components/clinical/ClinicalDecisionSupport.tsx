import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Brain, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Loader2,
  Stethoscope,
  Heart,
  Activity,
  Pill,
  ClipboardList,
  BookOpen
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface PatientData {
  age: string;
  gender: string;
  symptoms: string;
  medicalHistory: string;
  vitalSigns: {
    bloodPressure: string;
    heartRate: string;
    temperature: string;
    respiratoryRate: string;
    oxygenSaturation: string;
  };
  physicalExam: string;
  labResults: string;
  currentMedications: string[];
  allergies: string[];
}

interface DiagnosisOption {
  diagnosis: string;
  probability: number;
  reasoning: string;
}

interface DiagnosticTest {
  test: string;
  indication: string;
  priority: 'low' | 'medium' | 'high';
}

interface TreatmentRecommendation {
  treatment: string;
  dosage?: string;
  duration?: string;
  reasoning: string;
}

interface ClinicalSupport {
  differentialDiagnosis: DiagnosisOption[];
  diagnosticTests: DiagnosticTest[];
  treatmentRecommendations: TreatmentRecommendation[];
  redFlags: string[];
  followUpPlan: string;
  patientEducation: string[];
  evidenceLevel: string;
}

interface DrugInteraction {
  medication1: string;
  medication2: string;
  severity: 'major' | 'moderate' | 'minor';
  effect: string;
}

export const ClinicalDecisionSupport = () => {
  const [patientData, setPatientData] = useState<PatientData>({
    age: '',
    gender: '',
    symptoms: '',
    medicalHistory: '',
    vitalSigns: {
      bloodPressure: '',
      heartRate: '',
      temperature: '',
      respiratoryRate: '',
      oxygenSaturation: ''
    },
    physicalExam: '',
    labResults: '',
    currentMedications: [],
    allergies: []
  });

  const [clinicalSupport, setClinicalSupport] = useState<ClinicalSupport | null>(null);
  const [drugInteractions, setDrugInteractions] = useState<DrugInteraction[]>([]);
  const [newMedication, setNewMedication] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCheckingDrugs, setIsCheckingDrugs] = useState(false);
  const [specialty, setSpecialty] = useState('family-medicine');

  const handleAnalyzeCase = async () => {
    if (!patientData.symptoms.trim()) {
      toast.error('Please enter patient symptoms');
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('clinical-decision-support', {
        body: {
          symptoms: patientData.symptoms,
          patientHistory: patientData.medicalHistory,
          vitalSigns: patientData.vitalSigns,
          physicalExam: patientData.physicalExam,
          labResults: patientData.labResults,
          specialty: specialty,
          patientAge: patientData.age,
          patientGender: patientData.gender
        }
      });

      if (error) throw error;

      setClinicalSupport(data.clinicalSupport);
      toast.success('Clinical analysis completed');
    } catch (error) {
      console.error('Error analyzing case:', error);
      toast.error('Failed to analyze clinical case');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCheckDrugInteractions = async () => {
    if (!newMedication.trim()) {
      toast.error('Please enter a medication to check');
      return;
    }

    setIsCheckingDrugs(true);
    try {
      const { data, error } = await supabase.functions.invoke('drug-interaction-checker', {
        body: {
          medications: patientData.currentMedications,
          newMedication: newMedication,
          patientConditions: patientData.medicalHistory.split(',').map(c => c.trim()),
          allergies: patientData.allergies
        }
      });

      if (error) throw error;

      setDrugInteractions(data.knownInteractions || []);
      toast.success('Drug interaction check completed');
    } catch (error) {
      console.error('Error checking drug interactions:', error);
      toast.error('Failed to check drug interactions');
    } finally {
      setIsCheckingDrugs(false);
    }
  };

  const addMedication = () => {
    if (newMedication.trim() && !patientData.currentMedications.includes(newMedication)) {
      setPatientData({
        ...patientData,
        currentMedications: [...patientData.currentMedications, newMedication]
      });
      setNewMedication('');
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'major': return 'destructive';
      case 'moderate': return 'secondary';
      case 'minor': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Clinical Decision Support</h2>
          <p className="text-muted-foreground">
            AI-powered clinical analysis and decision support tools
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={specialty} onValueChange={setSpecialty}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select specialty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="family-medicine">Family Medicine</SelectItem>
              <SelectItem value="internal-medicine">Internal Medicine</SelectItem>
              <SelectItem value="emergency-medicine">Emergency Medicine</SelectItem>
              <SelectItem value="pediatrics">Pediatrics</SelectItem>
              <SelectItem value="cardiology">Cardiology</SelectItem>
              <SelectItem value="chiropractic">Chiropractic</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="patient-data" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="patient-data">Patient Data</TabsTrigger>
          <TabsTrigger value="clinical-analysis">Clinical Analysis</TabsTrigger>
          <TabsTrigger value="drug-interactions">Drug Interactions</TabsTrigger>
          <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
        </TabsList>

        <TabsContent value="patient-data" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Patient Demographics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      value={patientData.age}
                      onChange={(e) => setPatientData({...patientData, age: e.target.value})}
                      placeholder="Patient age"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select 
                      value={patientData.gender} 
                      onValueChange={(value) => setPatientData({...patientData, gender: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="symptoms">Chief Complaint & Symptoms</Label>
                  <Textarea
                    id="symptoms"
                    value={patientData.symptoms}
                    onChange={(e) => setPatientData({...patientData, symptoms: e.target.value})}
                    placeholder="Describe the patient's chief complaint and presenting symptoms..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medical-history">Medical History</Label>
                  <Textarea
                    id="medical-history"
                    value={patientData.medicalHistory}
                    onChange={(e) => setPatientData({...patientData, medicalHistory: e.target.value})}
                    placeholder="Past medical history, surgeries, chronic conditions..."
                    className="min-h-[80px]"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Vital Signs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Blood Pressure</Label>
                    <Input
                      value={patientData.vitalSigns.bloodPressure}
                      onChange={(e) => setPatientData({
                        ...patientData,
                        vitalSigns: {...patientData.vitalSigns, bloodPressure: e.target.value}
                      })}
                      placeholder="120/80"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Heart Rate</Label>
                    <Input
                      value={patientData.vitalSigns.heartRate}
                      onChange={(e) => setPatientData({
                        ...patientData,
                        vitalSigns: {...patientData.vitalSigns, heartRate: e.target.value}
                      })}
                      placeholder="72 bpm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Temperature</Label>
                    <Input
                      value={patientData.vitalSigns.temperature}
                      onChange={(e) => setPatientData({
                        ...patientData,
                        vitalSigns: {...patientData.vitalSigns, temperature: e.target.value}
                      })}
                      placeholder="98.6°F"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Respiratory Rate</Label>
                    <Input
                      value={patientData.vitalSigns.respiratoryRate}
                      onChange={(e) => setPatientData({
                        ...patientData,
                        vitalSigns: {...patientData.vitalSigns, respiratoryRate: e.target.value}
                      })}
                      placeholder="16/min"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>O2 Saturation</Label>
                    <Input
                      value={patientData.vitalSigns.oxygenSaturation}
                      onChange={(e) => setPatientData({
                        ...patientData,
                        vitalSigns: {...patientData.vitalSigns, oxygenSaturation: e.target.value}
                      })}
                      placeholder="98%"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="physical-exam">Physical Examination</Label>
                  <Textarea
                    id="physical-exam"
                    value={patientData.physicalExam}
                    onChange={(e) => setPatientData({...patientData, physicalExam: e.target.value})}
                    placeholder="Physical examination findings..."
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lab-results">Laboratory Results</Label>
                  <Textarea
                    id="lab-results"
                    value={patientData.labResults}
                    onChange={(e) => setPatientData({...patientData, labResults: e.target.value})}
                    placeholder="Lab values, imaging results..."
                    className="min-h-[60px]"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center">
            <Button onClick={handleAnalyzeCase} disabled={isAnalyzing} size="lg">
              {isAnalyzing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Brain className="mr-2 h-4 w-4" />
              )}
              Analyze Clinical Case
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="clinical-analysis" className="space-y-4">
          {clinicalSupport ? (
            <div className="grid gap-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Disclaimer:</strong> This AI-generated analysis is for educational purposes only and should not replace professional medical judgment.
                </AlertDescription>
              </Alert>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="h-5 w-5" />
                      Differential Diagnosis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Array.isArray(clinicalSupport.differentialDiagnosis) ? 
                        clinicalSupport.differentialDiagnosis.map((diagnosis, index) => (
                          <div key={index} className="p-3 border rounded-lg">
                            <div className="flex justify-between items-start mb-1">
                              <h4 className="font-medium">{diagnosis.diagnosis}</h4>
                              <Badge variant="outline">{diagnosis.probability}%</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {diagnosis.reasoning}
                            </p>
                          </div>
                        )) :
                        <div className="text-sm whitespace-pre-wrap">{clinicalSupport.differentialDiagnosis}</div>
                      }
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ClipboardList className="h-5 w-5" />
                      Recommended Tests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Array.isArray(clinicalSupport.diagnosticTests) ?
                        clinicalSupport.diagnosticTests.map((test, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-secondary/50 rounded">
                            <span className="text-sm">{test.test}</span>
                            <Badge variant="outline" className="text-xs">
                              {test.priority}
                            </Badge>
                          </div>
                        )) :
                        <div className="text-sm whitespace-pre-wrap">{clinicalSupport.diagnosticTests}</div>
                      }
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Treatment Plan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Array.isArray(clinicalSupport.treatmentRecommendations) ?
                        clinicalSupport.treatmentRecommendations.map((treatment, index) => (
                          <div key={index} className="p-2 border-l-2 border-primary pl-3">
                            <p className="text-sm font-medium">{treatment.treatment}</p>
                            {treatment.dosage && (
                              <p className="text-xs text-muted-foreground">
                                {treatment.dosage} {treatment.duration && `for ${treatment.duration}`}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">{treatment.reasoning}</p>
                          </div>
                        )) :
                        <div className="text-sm whitespace-pre-wrap">{clinicalSupport.treatmentRecommendations}</div>
                      }
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Red Flags & Warnings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Array.isArray(clinicalSupport.redFlags) ?
                        clinicalSupport.redFlags.map((flag, index) => (
                          <Alert key={index}>
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription className="text-sm">
                              {flag}
                            </AlertDescription>
                          </Alert>
                        )) :
                        <div className="text-sm whitespace-pre-wrap">{clinicalSupport.redFlags}</div>
                      }
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Follow-up Plan & Patient Education</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Follow-up Schedule</h4>
                    <p className="text-sm">{clinicalSupport.followUpPlan}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Patient Education Points</h4>
                    <div className="text-sm whitespace-pre-wrap">{clinicalSupport.patientEducation}</div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Evidence Level</h4>
                    <p className="text-sm">{clinicalSupport.evidenceLevel}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Enter patient data and analyze the clinical case to see AI-powered recommendations
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="drug-interactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5" />
                Drug Interaction Checker
              </CardTitle>
              <CardDescription>
                Check for interactions between medications and patient conditions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newMedication}
                  onChange={(e) => setNewMedication(e.target.value)}
                  placeholder="Enter medication name..."
                  className="flex-1"
                />
                <Button onClick={addMedication}>Add</Button>
                <Button 
                  onClick={handleCheckDrugInteractions} 
                  disabled={isCheckingDrugs}
                >
                  {isCheckingDrugs ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="mr-2 h-4 w-4" />
                  )}
                  Check Interactions
                </Button>
              </div>

              {patientData.currentMedications.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Current Medications</h4>
                  <div className="flex flex-wrap gap-2">
                    {patientData.currentMedications.map((med, index) => (
                      <Badge key={index} variant="outline">{med}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {drugInteractions.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium">Drug Interactions Found</h4>
                  {drugInteractions.map((interaction, index) => (
                    <Alert key={index}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="flex items-center justify-between">
                          <div>
                            <strong>{interaction.medication1}</strong> + <strong>{interaction.medication2}</strong>
                            <p className="text-sm mt-1">{interaction.effect}</p>
                          </div>
                          <Badge variant={getSeverityColor(interaction.severity)}>
                            {interaction.severity}
                          </Badge>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guidelines" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Clinical Guidelines & Protocols
              </CardTitle>
              <CardDescription>
                Evidence-based clinical guidelines and treatment protocols
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-medium">Common Protocols</h4>
                  <div className="space-y-2">
                    <div className="p-3 border rounded-lg hover:bg-accent cursor-pointer">
                      <h5 className="font-medium">Hypertension Management</h5>
                      <p className="text-sm text-muted-foreground">AHA/ACC Guidelines 2024</p>
                    </div>
                    <div className="p-3 border rounded-lg hover:bg-accent cursor-pointer">
                      <h5 className="font-medium">Diabetes Care Standards</h5>
                      <p className="text-sm text-muted-foreground">ADA Standards of Care 2024</p>
                    </div>
                    <div className="p-3 border rounded-lg hover:bg-accent cursor-pointer">
                      <h5 className="font-medium">Chest Pain Evaluation</h5>
                      <p className="text-sm text-muted-foreground">Emergency Medicine Protocol</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">Risk Calculators</h4>
                  <div className="space-y-2">
                    <div className="p-3 border rounded-lg hover:bg-accent cursor-pointer">
                      <h5 className="font-medium">ASCVD Risk Calculator</h5>
                      <p className="text-sm text-muted-foreground">10-year cardiovascular risk</p>
                    </div>
                    <div className="p-3 border rounded-lg hover:bg-accent cursor-pointer">
                      <h5 className="font-medium">FRAX Score</h5>
                      <p className="text-sm text-muted-foreground">Fracture risk assessment</p>
                    </div>
                    <div className="p-3 border rounded-lg hover:bg-accent cursor-pointer">
                      <h5 className="font-medium">CHA2DS2-VASc</h5>
                      <p className="text-sm text-muted-foreground">Stroke risk in atrial fibrillation</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};