
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Eye, Edit, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const soapTemplates = [
  {
    id: 1,
    name: "General Consultation",
    specialty: "Primary Care",
    description: "Standard template for general medical consultations",
    subjective: "Patient presents with [chief complaint]. Symptoms began [timeframe] and include [symptoms]. [Review of systems findings]. Past medical history significant for [relevant history].",
    objective: "Vital signs: BP [value], HR [value], RR [value], Temp [value], O2 sat [value]. Physical examination reveals [findings]. Patient appears [general appearance].",
    assessment: "[Primary diagnosis] based on [clinical reasoning]. Differential diagnosis includes [alternatives]. [Additional impressions if applicable].",
    plan: "1. [Treatment plan]\n2. [Medications if prescribed]\n3. [Follow-up instructions]\n4. [Patient education]\n5. [Return precautions]"
  },
  {
    id: 2,
    name: "Follow-up Visit",
    specialty: "General",
    description: "Template for routine follow-up appointments",
    subjective: "Patient returns for follow-up of [condition]. Since last visit, patient reports [symptom status]. Current medications include [medications]. Compliance with treatment [status].",
    objective: "Vital signs stable. Physical examination shows [interval changes]. [Relevant diagnostic results if available].",
    assessment: "[Condition] - [stable/improved/worsened]. [Additional assessments].",
    plan: "Continue current management. [Medication adjustments if needed]. Follow-up in [timeframe]. [Additional instructions]."
  },
  {
    id: 3,
    name: "Acute Care Visit",
    specialty: "Emergency/Urgent Care",
    description: "Template for acute medical conditions",
    subjective: "Patient presents with acute onset of [symptoms] beginning [timeframe]. Associated symptoms include [symptoms]. No recent travel, fever, or [relevant negatives].",
    objective: "Patient appears [state]. Vital signs: [values]. Examination notable for [positive findings]. [Relevant negative findings].",
    assessment: "Acute [diagnosis/condition]. [Severity assessment]. [Rule out considerations].",
    plan: "Immediate: [acute interventions]. Medications: [prescriptions]. Instructions: [discharge planning]. Return if [warning signs]."
  },
  {
    id: 4,
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
