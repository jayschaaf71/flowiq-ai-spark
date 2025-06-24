
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Activity,
  FileText,
  Stethoscope,
  Plus,
  Save
} from "lucide-react";

interface ChiropracticTemplate {
  id: string;
  name: string;
  type: 'soap' | 'evaluation' | 'treatment_plan';
  specialty: 'general' | 'spine' | 'joint' | 'sports';
  template: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
  billingCodes: string[];
}

export const ChiropracticTemplates = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<ChiropracticTemplate | null>(null);
  const [currentSOAP, setCurrentSOAP] = useState({
    subjective: '',
    objective: '',
    assessment: '',
    plan: ''
  });
  const { toast } = useToast();

  const chiropracticTemplates: ChiropracticTemplate[] = [
    {
      id: '1',
      name: 'Lower Back Pain - Initial Evaluation',
      type: 'soap',
      specialty: 'spine',
      template: {
        subjective: 'Patient presents with chief complaint of lower back pain, onset [DURATION] ago. Pain described as [QUALITY] and rated [PAIN_SCALE]/10. Pain [AGGRAVATING_FACTORS] and [RELIEVING_FACTORS]. Associated symptoms include [SYMPTOMS]. Patient reports [FUNCTIONAL_LIMITATIONS].',
        objective: 'Vital signs stable. Posture: [POSTURE_FINDINGS]. Inspection: [VISUAL_FINDINGS]. Palpation: [PALPATION_FINDINGS]. Range of Motion: Lumbar flexion [DEGREES], extension [DEGREES], lateral flexion [L/R]. Orthopedic tests: [TEST_RESULTS]. Neurological: [NEURO_FINDINGS].',
        assessment: 'Primary diagnosis: [PRIMARY_DX] (M54.5 - Low back pain). Contributing factors: [CONTRIBUTING_FACTORS]. Prognosis: [PROGNOSIS] with appropriate treatment.',
        plan: '1. Chiropractic manipulation (98940-98942)\n2. Therapeutic exercises (97110)\n3. Manual therapy (97140)\n4. Patient education on posture and ergonomics\n5. Home exercise program\n6. Follow-up in [TIMEFRAME]\n7. Re-evaluation in [TIMEFRAME]'
      },
      billingCodes: ['98940', '98941', '98942', '97110', '97140', '97012']
    },
    {
      id: '2',
      name: 'Cervical Spine - Neck Pain',
      type: 'soap',
      specialty: 'spine',
      template: {
        subjective: 'Patient reports neck pain of [DURATION] duration. Pain quality: [QUALITY], intensity [PAIN_SCALE]/10. Mechanism of injury: [MOI]. Associated headaches: [Y/N]. Arm symptoms: [ARM_SYMPTOMS]. Sleep disturbance: [Y/N]. Work-related activities affected: [WORK_IMPACT].',
        objective: 'Cervical posture: [POSTURE]. Active ROM: Flexion [DEGREES], extension [DEGREES], rotation L/R [DEGREES], lateral flexion L/R [DEGREES]. Muscle spasm: [LOCATION]. Trigger points: [LOCATION]. Foraminal compression test: [RESULT]. Spurling\'s test: [RESULT].',
        assessment: 'Cervical strain/sprain (S13.4). Secondary: [SECONDARY_DX]. Functional disability: [DISABILITY_LEVEL]. Prognosis: [PROGNOSIS].',
        plan: '1. Cervical manipulation (98940)\n2. Soft tissue mobilization (97140)\n3. Cervical traction if indicated\n4. Postural correction exercises\n5. Ergonomic assessment\n6. Ice/heat therapy education\n7. Return visit [TIMEFRAME]'
      },
      billingCodes: ['98940', '97140', '97012', '97110']
    },
    {
      id: '3',
      name: 'Sports Injury - Shoulder',
      type: 'soap',
      specialty: 'sports',
      template: {
        subjective: 'Athlete presents with shoulder pain following [ACTIVITY]. Onset: [ACUTE/GRADUAL]. Current pain level: [PAIN_SCALE]/10. Activities limited: [LIMITATIONS]. Previous injury history: [HISTORY]. Performance impact: [IMPACT].',
        objective: 'Shoulder inspection: [FINDINGS]. Active ROM: [ROM_FINDINGS]. Passive ROM: [PASSIVE_ROM]. Strength testing: [STRENGTH]. Special tests: Neer\'s [RESULT], Hawkins [RESULT], Empty can [RESULT], Apprehension [RESULT].',
        assessment: '[PRIMARY_DIAGNOSIS]. Stage of healing: [ACUTE/SUBACUTE/CHRONIC]. Return to sport timeline: [TIMELINE]. Risk factors: [RISK_FACTORS].',
        plan: '1. Joint mobilization (97140)\n2. Therapeutic exercise program (97110)\n3. Kinesiology taping\n4. Sport-specific rehabilitation\n5. Gradual return to activity protocol\n6. Preventive education\n7. Follow-up [TIMEFRAME]'
      },
      billingCodes: ['97140', '97110', '97112', '97530']
    }
  ];

  const chiropracticBillingCodes = [
    { code: '98940', description: 'Chiropractic manipulative treatment (CMT); spinal, 1-2 regions', fee: 65 },
    { code: '98941', description: 'CMT; spinal, 3-4 regions', fee: 85 },
    { code: '98942', description: 'CMT; spinal, 5 regions', fee: 105 },
    { code: '97110', description: 'Therapeutic procedure, therapeutic exercises', fee: 45 },
    { code: '97140', description: 'Manual therapy techniques', fee: 55 },
    { code: '97012', description: 'Application of modalities (hot/cold packs)', fee: 25 },
    { code: '97112', description: 'Neuromuscular reeducation', fee: 50 },
    { code: '97530', description: 'Therapeutic activities, dynamic activities', fee: 60 }
  ];

  const handleTemplateSelect = (template: ChiropracticTemplate) => {
    setSelectedTemplate(template);
    setCurrentSOAP(template.template);
  };

  const handleSave = () => {
    toast({
      title: "SOAP Note Saved",
      description: "Chiropractic documentation has been saved to patient record",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-600" />
            West County Spine & Joint - Chiropractic Templates
          </h3>
          <p className="text-gray-600">
            Specialized templates and billing codes for chiropractic care
          </p>
        </div>
        <Button onClick={() => window.location.href = '/agents/scribe-iq'}>
          <Plus className="w-4 h-4 mr-2" />
          Create New Note
        </Button>
      </div>

      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList>
          <TabsTrigger value="templates">SOAP Templates</TabsTrigger>
          <TabsTrigger value="billing">Billing Codes</TabsTrigger>
          <TabsTrigger value="editor">Note Editor</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {chiropracticTemplates.map((template) => (
              <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleTemplateSelect(template)}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    <Badge variant="outline">{template.specialty}</Badge>
                  </div>
                  <CardDescription>
                    {template.type} template for {template.specialty} conditions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <strong>Billing Codes:</strong> {template.billingCodes.join(', ')}
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      <FileText className="w-3 h-3 mr-1" />
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Chiropractic Billing Codes</CardTitle>
              <CardDescription>
                Standard CPT codes and fees for chiropractic services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {chiropracticBillingCodes.map((code) => (
                  <div key={code.code} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{code.code}</Badge>
                        <span className="font-medium">${code.fee}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{code.description}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="editor" className="space-y-4">
          {selectedTemplate && (
            <Card>
              <CardHeader>
                <CardTitle>Editing: {selectedTemplate.name}</CardTitle>
                <CardDescription>
                  Customize the template with patient-specific information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="subjective">Subjective</Label>
                    <Textarea
                      id="subjective"
                      value={currentSOAP.subjective}
                      onChange={(e) => setCurrentSOAP(prev => ({ ...prev, subjective: e.target.value }))}
                      className="min-h-[120px]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="objective">Objective</Label>
                    <Textarea
                      id="objective"
                      value={currentSOAP.objective}
                      onChange={(e) => setCurrentSOAP(prev => ({ ...prev, objective: e.target.value }))}
                      className="min-h-[120px]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="assessment">Assessment</Label>
                    <Textarea
                      id="assessment"
                      value={currentSOAP.assessment}
                      onChange={(e) => setCurrentSOAP(prev => ({ ...prev, assessment: e.target.value }))}
                      className="min-h-[120px]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="plan">Plan</Label>
                    <Textarea
                      id="plan"
                      value={currentSOAP.plan}
                      onChange={(e) => setCurrentSOAP(prev => ({ ...prev, plan: e.target.value }))}
                      className="min-h-[120px]"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline">Save as Template</Button>
                  <Button onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Save SOAP Note
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {!selectedTemplate && (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4" />
              <p>Select a template from the Templates tab to begin editing</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
