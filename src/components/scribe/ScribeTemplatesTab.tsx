
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Eye, Edit, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const soapTemplates = [
  {
    id: 1,
    name: "Sleep Apnea Consultation",
    specialty: "Dental Sleep Medicine",
    description: "Initial consultation for suspected obstructive sleep apnea",
    subjective: "Patient presents with chief complaint of [snoring/sleep disruption/daytime fatigue]. Partner reports [witnessed apneas/loud snoring/restless sleep]. Symptoms began [timeframe] and have [progressed/remained stable]. Epworth Sleepiness Scale: [score/15]. Sleep history: bedtime [time], wake time [time], sleep latency [minutes]. Medical history significant for [hypertension/diabetes/heart disease]. Current medications: [list]. BMI: [value].",
    objective: "Extraoral examination: BMI [value], neck circumference [cm], Mallampati class [I-IV]. Intraoral examination: tongue position [Friedman classification], tonsil size [grade], soft palate length and thickness [normal/elongated/thick], uvula [normal/elongated/bifid]. Dental examination: [crowding/spacing], [wear patterns], periodontal status [WNL/gingivitis/periodontitis]. Airway assessment: [patent/restricted], nasal breathing [clear/congested].",
    assessment: "Suspected obstructive sleep apnea based on clinical presentation and examination findings. [Mild/Moderate/Severe] risk based on [clinical indicators]. Patient is [candidate/not candidate] for oral appliance therapy. [Additional considerations].",
    plan: "1. Home sleep apnea test or polysomnography referral\n2. ENT consultation if indicated\n3. Weight management counseling if BMI >30\n4. Sleep hygiene education\n5. Follow-up with sleep study results\n6. Consider oral appliance therapy pending study results\n7. [Return precautions/timeline]"
  },
  {
    id: 2,
    name: "Oral Appliance Delivery",
    specialty: "Dental Sleep Medicine",
    description: "Delivery and fitting of oral appliance for sleep apnea",
    subjective: "Patient returns for delivery of [mandibular advancement device/tongue retaining device]. Sleep study results: AHI [value], lowest O2 sat [%]. Patient reports [current symptoms]. Understands oral appliance therapy goals and limitations.",
    objective: "Oral appliance fit and function: [excellent/good/fair]. Mandibular advancement: [mm] from maximum comfortable protrusion. Vertical opening: [mm]. Retention: [adequate/needs adjustment]. Patient demonstrates proper insertion and removal. Comfort level: [comfortable/mild discomfort/needs adjustment].",
    assessment: "Oral appliance delivered and fitted. Initial comfort and retention [satisfactory/requires modification]. Patient educated on proper use, care, and cleaning. [Side effects discussed].",
    plan: "1. Gradual advancement protocol initiated\n2. Titration schedule: advance [0.5mm] every [timeframe]\n3. Sleep diary to monitor symptoms\n4. Follow-up in 2 weeks for adjustment\n5. Follow-up sleep study in 3-6 months\n6. Daily appliance wear as tolerated\n7. [Emergency contact information provided]"
  },
  {
    id: 3,
    name: "Oral Appliance Follow-up",
    specialty: "Dental Sleep Medicine",
    description: "Follow-up visit for oral appliance therapy",
    subjective: "Patient using oral appliance for [duration]. Compliance: [hours/night, nights/week]. Current advancement: [mm]. Partner reports [snoring improved/resolved/unchanged]. Patient reports [energy improved/sleep quality better/daytime fatigue resolved]. Side effects: [TMJ discomfort/tooth movement/dry mouth/none].",
    objective: "Oral appliance condition: [good/worn/damaged]. Fit and retention: [maintained/loose/tight]. Dental examination: [occlusal changes/tooth movement/stable]. TMJ examination: [clicking/tenderness/normal range of motion]. Titration progress: currently at [mm] advancement.",
    assessment: "Oral appliance therapy [well-tolerated/partially effective/needs adjustment]. Subjective improvement in [symptoms]. [Compliance excellent/good/poor]. [Side effects minimal/significant/none].",
    plan: "1. [Continue current advancement/increase to next level/maintain current position]\n2. [TMJ therapy if indicated]\n3. [Dental monitoring for tooth movement]\n4. Follow-up sleep study scheduled for [date]\n5. Continue daily wear\n6. [Appliance modifications if needed]\n7. Next appointment in [timeframe]"
  },
  {
    id: 4,
    name: "Sleep Bruxism Evaluation",
    specialty: "Dental Sleep Medicine",
    description: "Assessment and treatment of sleep-related bruxism",
    subjective: "Patient/partner reports [grinding sounds/jaw clenching] during sleep. Symptoms include [morning jaw pain/headaches/tooth sensitivity]. Duration: [timeframe]. Stress level: [high/moderate/low]. Sleep quality: [poor/fair/good]. Current sleep position: [supine/side/prone]. Caffeine intake: [amount/timing].",
    objective: "Dental examination reveals [wear facets/fractures/muscle hypertrophy]. Tooth wear pattern: [generalized/localized] affecting [anterior/posterior] teeth. TMJ examination: [muscle tenderness/clicking/limited opening]. Masseter and temporalis muscle palpation: [tender/hypertrophied/normal]. Occlusion: [stable/interferences noted].",
    assessment: "Sleep bruxism with [mild/moderate/severe] dental wear. [Primary/secondary] bruxism related to [stress/sleep disorder/medication]. TMJ [dysfunction present/normal function]. Risk for [further dental damage/TMJ complications].",
    plan: "1. Custom night guard fabrication\n2. Sleep hygiene counseling\n3. Stress management techniques\n4. [Medication review if applicable]\n5. TMJ therapy if needed\n6. Follow-up in 4-6 weeks\n7. Monitor dental wear progression\n8. [Sleep study if OSA suspected]"
  },
  {
    id: 5,
    name: "General Consultation",
    specialty: "Primary Care",
    description: "Standard template for general medical consultations",
    subjective: "Patient presents with [chief complaint]. Symptoms began [timeframe] and include [symptoms]. [Review of systems findings]. Past medical history significant for [relevant history].",
    objective: "Vital signs: BP [value], HR [value], RR [value], Temp [value], O2 sat [value]. Physical examination reveals [findings]. Patient appears [general appearance].",
    assessment: "[Primary diagnosis] based on [clinical reasoning]. Differential diagnosis includes [alternatives]. [Additional impressions if applicable].",
    plan: "1. [Treatment plan]\n2. [Medications if prescribed]\n3. [Follow-up instructions]\n4. [Patient education]\n5. [Return precautions]"
  },
  {
    id: 6,
    name: "Follow-up Visit",
    specialty: "General",
    description: "Template for routine follow-up appointments",
    subjective: "Patient returns for follow-up of [condition]. Since last visit, patient reports [symptom status]. Current medications include [medications]. Compliance with treatment [status].",
    objective: "Vital signs stable. Physical examination shows [interval changes]. [Relevant diagnostic results if available].",
    assessment: "[Condition] - [stable/improved/worsened]. [Additional assessments].",
    plan: "Continue current management. [Medication adjustments if needed]. Follow-up in [timeframe]. [Additional instructions]."
  },
  {
    id: 7,
    name: "Acute Care Visit",
    specialty: "Emergency/Urgent Care",
    description: "Template for acute medical conditions",
    subjective: "Patient presents with acute onset of [symptoms] beginning [timeframe]. Associated symptoms include [symptoms]. No recent travel, fever, or [relevant negatives].",
    objective: "Patient appears [state]. Vital signs: [values]. Examination notable for [positive findings]. [Relevant negative findings].",
    assessment: "Acute [diagnosis/condition]. [Severity assessment]. [Rule out considerations].",
    plan: "Immediate: [acute interventions]. Medications: [prescriptions]. Instructions: [discharge planning]. Return if [warning signs]."
  },
  {
    id: 8,
    name: "Preventive Care",
    specialty: "Primary Care",
    description: "Annual physical and preventive care template",
    subjective: "Patient here for annual physical examination. No acute complaints. [Review of systems]. [Health maintenance review].",
    objective: "Well-appearing patient. Vital signs within normal limits. Complete physical examination performed. [Specific findings].",
    assessment: "Annual physical examination. [Risk factor assessment]. [Preventive care status].",
    plan: "Preventive care: [vaccinations needed]. Screening: [recommended tests]. Lifestyle: [counseling provided]. Next annual exam in 12 months."
  }
];

export const ScribeTemplatesTab = () => {
  const { toast } = useToast();

  const copyTemplate = async (template: typeof soapTemplates[0]) => {
    const templateText = `SOAP TEMPLATE: ${template.name}

Subjective:
${template.subjective}

Objective:
${template.objective}

Assessment:
${template.assessment}

Plan:
${template.plan}`;

    try {
      await navigator.clipboard.writeText(templateText);
      toast({
        title: "Template Copied",
        description: `${template.name} template copied to clipboard`,
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy template",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            SOAP Note Templates
          </CardTitle>
          <CardDescription>
            Pre-built templates to streamline your medical documentation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-gray-600">
              {soapTemplates.length} templates available
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Custom Template
            </Button>
          </div>

          <div className="grid gap-4">
            {soapTemplates.map((template) => (
              <Card key={template.id} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{template.specialty}</Badge>
                        {template.description}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => copyTemplate(template)}
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <strong className="text-blue-700">Subjective:</strong>
                      <p className="text-gray-600 mt-1 line-clamp-2">{template.subjective}</p>
                    </div>
                    <div>
                      <strong className="text-green-700">Objective:</strong>
                      <p className="text-gray-600 mt-1 line-clamp-2">{template.objective}</p>
                    </div>
                    <div>
                      <strong className="text-orange-700">Assessment:</strong>
                      <p className="text-gray-600 mt-1 line-clamp-2">{template.assessment}</p>
                    </div>
                    <div>
                      <strong className="text-foreground">Plan:</strong>
                      <p className="text-gray-600 mt-1 line-clamp-2">{template.plan}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
