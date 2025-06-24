
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
  Moon,
  FileText,
  Stethoscope,
  Plus,
  Save,
  Activity
} from "lucide-react";

interface DentalSleepTemplate {
  id: string;
  name: string;
  type: 'evaluation' | 'appliance_delivery' | 'follow_up' | 'titration';
  template: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
  billingCodes: string[];
}

export const DentalSleepTemplates = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<DentalSleepTemplate | null>(null);
  const [currentSOAP, setCurrentSOAP] = useState({
    subjective: '',
    objective: '',
    assessment: '',
    plan: ''
  });
  const { toast } = useToast();

  const dentalSleepTemplates: DentalSleepTemplate[] = [
    {
      id: '1',
      name: 'Sleep Apnea - Initial Evaluation',
      type: 'evaluation',
      template: {
        subjective: 'Patient referred for evaluation of obstructive sleep apnea. Sleep study results: AHI [AHI_VALUE], RDI [RDI_VALUE]. Primary symptoms: [SYMPTOMS]. ESS score: [ESS_SCORE]. Snoring frequency: [FREQUENCY]. Witnessed apneas: [Y/N]. Daytime sleepiness: [SEVERITY]. Previous treatments: [PREVIOUS_TX]. CPAP compliance issues: [CPAP_ISSUES].',
        objective: 'Extraoral exam: BMI [BMI], neck circumference [NECK_CM] cm. Intraoral exam: Mallampati class [CLASS], tongue size [SIZE], tonsillar grade [GRADE], soft palate length [LENGTH]. Dental exam: [DENTAL_FINDINGS]. Occlusion: [OCCLUSION]. TMJ: [TMJ_FINDINGS]. Airway assessment: [AIRWAY_FINDINGS].',
        assessment: 'OSA with AHI [AHI_VALUE] - [MILD/MODERATE/SEVERE]. Candidate for oral appliance therapy per AASM guidelines. Dental status: [ADEQUATE/INADEQUATE] for appliance. Contraindications: [NONE/LIST].',
        plan: '1. Fabricate mandibular advancement device\n2. Impressions and bite registration (D0350, D0470)\n3. Custom oral appliance (E0486)\n4. Patient education on appliance use\n5. Follow-up in 2-3 weeks for delivery\n6. Coordinate with sleep physician\n7. Follow-up sleep study in 3 months'
      },
      billingCodes: ['D0350', 'D0470', 'E0486', 'D9946', 'D9975']
    },
    {
      id: '2',
      name: 'Oral Appliance Delivery',
      type: 'appliance_delivery',
      template: {
        subjective: 'Patient returns for delivery of custom mandibular advancement device. Sleep symptoms since last visit: [SYMPTOMS]. Expectations discussed: [EXPECTATIONS]. Compliance with pre-delivery instructions: [COMPLIANCE].',
        objective: 'Appliance fit: [EXCELLENT/GOOD/FAIR]. Comfort level: [COMFORTABLE/MILD DISCOMFORT/SIGNIFICANT]. Retention: [ADEQUATE/INADEQUATE]. Speech clarity: [NORMAL/SLIGHTLY AFFECTED/SIGNIFICANTLY AFFECTED]. Bite changes: [NONE/MINIMAL/CONCERNING]. Initial protrusion: [MM] mm.',
        assessment: 'Successful delivery of mandibular advancement device. Patient demonstrates understanding of insertion/removal. Baseline position established at [MM] mm protrusion.',
        plan: '1. Home use instructions provided\n2. Cleaning and care instructions\n3. Gradual titration protocol\n4. Return in 1 week for adjustment\n5. Side effects monitoring\n6. Sleep study in 6-8 weeks\n7. Coordinate with sleep physician'
      },
      billingCodes: ['D9946', 'D9975', 'E0486']
    },
    {
      id: '3',
      name: 'Appliance Titration & Follow-up',
      type: 'titration',
      template: {
        subjective: 'Patient using oral appliance for [DURATION]. Symptom improvement: [IMPROVEMENT]. Snoring: [REDUCED/ELIMINATED/UNCHANGED]. Sleep quality: [IMPROVED/UNCHANGED/WORSE]. Comfort level: [RATING]. Side effects: [SIDE_EFFECTS]. Compliance: [HOURS_PER_NIGHT] hours/night.',
        objective: 'Appliance condition: [CONDITION]. Retention: [ADEQUATE/NEEDS_ADJUSTMENT]. Current protrusion: [MM] mm. Dental changes: [NONE/MINIMAL/SIGNIFICANT]. Bite relationship: [STABLE/CHANGED]. TMJ status: [NORMAL/TENDER/PAINFUL].',
        assessment: 'Patient responding [WELL/PARTIALLY/POORLY] to oral appliance therapy. Current titration: [MM] mm protrusion. [FURTHER_TITRATION/OPTIMIZATION] needed.',
        plan: '1. Advance appliance [MM] mm\n2. Continue current position\n3. Home sleep test in [WEEKS] weeks\n4. Monitor for side effects\n5. Bite registration if needed\n6. Return visit in [WEEKS] weeks\n7. Communicate with sleep physician'
      },
      billingCodes: ['D9946', 'D9975', 'D0350']
    }
  ];

  const dentalSleepBillingCodes = [
    { code: 'E0486', description: 'Oral device/appliance for sleep apnea', fee: 2800 },
    { code: 'D9946', description: 'Fabrication of oral appliance', fee: 2500 },
    { code: 'D9975', description: 'External bleaching - per arch', fee: 150 },
    { code: 'D0350', description: 'Oral/facial images', fee: 85 },
    { code: 'D0470', description: 'Diagnostic casts', fee: 125 },
    { code: 'D7880', description: 'Occlusal orthotic device', fee: 650 },
    { code: 'D9951', description: 'Occlusal adjustment - limited', fee: 95 },
    { code: 'D9952', description: 'Occlusal adjustment - complete', fee: 285 }
  ];

  const sleepStudyParameters = [
    { parameter: 'AHI (Apnea-Hypopnea Index)', normal: '<5', mild: '5-14', moderate: '15-29', severe: '≥30' },
    { parameter: 'RDI (Respiratory Disturbance Index)', normal: '<5', mild: '5-14', moderate: '15-29', severe: '≥30' },
    { parameter: 'ESS (Epworth Sleepiness Scale)', normal: '0-7', mild: '8-10', moderate: '11-15', severe: '16-24' },
    { parameter: 'O2 Saturation', normal: '>95%', mild: '90-95%', moderate: '85-90%', severe: '<85%' }
  ];

  const handleTemplateSelect = (template: DentalSleepTemplate) => {
    setSelectedTemplate(template);
    setCurrentSOAP(template.template);
  };

  const handleSave = () => {
    toast({
      title: "Sleep Medicine Note Saved",
      description: "Dental sleep medicine documentation has been saved to patient record",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Moon className="w-5 h-5 text-blue-600" />
            Midwest Dental Sleep Medicine - Templates
          </h3>
          <p className="text-gray-600">
            Specialized templates and billing codes for dental sleep medicine
          </p>
        </div>
        <Button onClick={() => window.location.href = '/agents/scribe-iq'}>
          <Plus className="w-4 h-4 mr-2" />
          Create New Note
        </Button>
      </div>

      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList>
          <TabsTrigger value="templates">Sleep Templates</TabsTrigger>
          <TabsTrigger value="billing">Billing Codes</TabsTrigger>
          <TabsTrigger value="parameters">Sleep Parameters</TabsTrigger>
          <TabsTrigger value="editor">Note Editor</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dentalSleepTemplates.map((template) => (
              <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleTemplateSelect(template)}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    <Badge variant="outline">{template.type}</Badge>
                  </div>
                  <CardDescription>
                    Template for {template.type.replace('_', ' ')} visits
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
              <CardTitle>Dental Sleep Medicine Billing Codes</CardTitle>
              <CardDescription>
                CPT/DME codes and fees for sleep apnea treatment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dentalSleepBillingCodes.map((code) => (
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

        <TabsContent value="parameters" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sleep Study Parameters Reference</CardTitle>
              <CardDescription>
                Normal ranges and severity classifications for sleep studies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Parameter</th>
                      <th className="text-left p-2">Normal</th>
                      <th className="text-left p-2">Mild</th>
                      <th className="text-left p-2">Moderate</th>
                      <th className="text-left p-2">Severe</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sleepStudyParameters.map((param, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2 font-medium">{param.parameter}</td>
                        <td className="p-2"><Badge variant="outline" className="bg-green-50">{param.normal}</Badge></td>
                        <td className="p-2"><Badge variant="outline" className="bg-yellow-50">{param.mild}</Badge></td>
                        <td className="p-2"><Badge variant="outline" className="bg-orange-50">{param.moderate}</Badge></td>
                        <td className="p-2"><Badge variant="outline" className="bg-red-50">{param.severe}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
              <p>Select a template from the Sleep Templates tab to begin editing</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
