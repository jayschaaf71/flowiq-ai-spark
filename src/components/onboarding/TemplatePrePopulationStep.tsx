
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  FileText, 
  Mail, 
  MessageSquare, 
  Calendar,
  Sparkles,
  CheckCircle,
  Settings,
  Download,
  Eye
} from "lucide-react";
import { SpecialtyType, specialtyConfigs } from '@/utils/specialtyConfig';

interface Template {
  id: string;
  name: string;
  description: string;
  type: 'form' | 'email' | 'sms' | 'document';
  category: string;
  preSelected: boolean;
  customizable: boolean;
}

interface TemplatePrePopulationStepProps {
  specialty: SpecialtyType;
  templateConfig: {
    enableAutoGeneration: boolean;
    selectedTemplates: string[];
    customizationPreferences: {
      useSpecialtyTerminology: boolean;
      includeBranding: boolean;
      autoTranslate: boolean;
    };
  };
  onUpdateTemplateConfig: (config: any) => void;
}

export const TemplatePrePopulationStep = ({ 
  specialty, 
  templateConfig, 
  onUpdateTemplateConfig 
}: TemplatePrePopulationStepProps) => {
  const specialtyConfig = specialtyConfigs[specialty];

  const templatesBySpecialty = {
    chiropractic: [
      {
        id: 'chiro_intake',
        name: 'Chiropractic Intake Form',
        description: 'Comprehensive new patient intake with pain assessment',
        type: 'form' as const,
        category: 'Patient Intake',
        preSelected: true,
        customizable: true
      },
      {
        id: 'pain_assessment',
        name: 'Pain Assessment Questionnaire',
        description: 'Detailed pain scale and location mapping',
        type: 'form' as const,
        category: 'Clinical Assessment',
        preSelected: true,
        customizable: true
      },
      {
        id: 'treatment_consent',
        name: 'Chiropractic Treatment Consent',
        description: 'Informed consent for chiropractic care',
        type: 'document' as const,
        category: 'Legal Documents',
        preSelected: true,
        customizable: false
      },
      {
        id: 'appointment_reminder',
        name: 'Appointment Reminder',
        description: 'Automated appointment reminder with prep instructions',
        type: 'sms' as const,
        category: 'Communication',
        preSelected: true,
        customizable: true
      },
      {
        id: 'welcome_email',
        name: 'New Patient Welcome Email',
        description: 'Welcome message with practice information',
        type: 'email' as const,
        category: 'Communication',
        preSelected: true,
        customizable: true
      }
    ],
    dental_sleep: [
      {
        id: 'sleep_intake',
        name: 'Sleep Medicine Intake Form',
        description: 'Comprehensive sleep disorder assessment',
        type: 'form' as const,
        category: 'Patient Intake',
        preSelected: true,
        customizable: true
      },
      {
        id: 'epworth_scale',
        name: 'Epworth Sleepiness Scale',
        description: 'Standardized sleepiness assessment',
        type: 'form' as const,
        category: 'Clinical Assessment',
        preSelected: true,
        customizable: false
      },
      {
        id: 'cpap_compliance',
        name: 'CPAP Compliance Form',
        description: 'Treatment compliance tracking',
        type: 'form' as const,
        category: 'Treatment Monitoring',
        preSelected: true,
        customizable: true
      }
    ],
    med_spa: [
      {
        id: 'aesthetic_consultation',
        name: 'Aesthetic Consultation Form',
        description: 'Beauty goals and treatment history',
        type: 'form' as const,
        category: 'Patient Intake',
        preSelected: true,
        customizable: true
      },
      {
        id: 'treatment_consent',
        name: 'Cosmetic Treatment Consent',
        description: 'Informed consent for aesthetic procedures',
        type: 'document' as const,
        category: 'Legal Documents',
        preSelected: true,
        customizable: false
      },
      {
        id: 'aftercare_instructions',
        name: 'Post-Treatment Care Instructions',
        description: 'Automated aftercare guidance',
        type: 'email' as const,
        category: 'Patient Education',
        preSelected: true,
        customizable: true
      }
    ],
    concierge: [
      {
        id: 'membership_intake',
        name: 'Concierge Membership Intake',
        description: 'Comprehensive health and lifestyle assessment',
        type: 'form' as const,
        category: 'Patient Intake',
        preSelected: true,
        customizable: true
      },
      {
        id: 'health_goals',
        name: 'Health Goals Assessment',
        description: 'Personalized health objectives planning',
        type: 'form' as const,
        category: 'Health Planning',
        preSelected: true,
        customizable: true
      },
      {
        id: 'membership_welcome',
        name: 'Membership Welcome Package',
        description: 'Personalized welcome with service overview',
        type: 'email' as const,
        category: 'Communication',
        preSelected: true,
        customizable: true
      }
    ],
    hrt: [
      {
        id: 'hormone_intake',
        name: 'Hormone Therapy Intake Form',
        description: 'Comprehensive hormonal health assessment',
        type: 'form' as const,
        category: 'Patient Intake',
        preSelected: true,
        customizable: true
      },
      {
        id: 'symptom_tracker',
        name: 'Hormone Symptom Tracker',
        description: 'Ongoing symptom monitoring form',
        type: 'form' as const,
        category: 'Treatment Monitoring',
        preSelected: true,
        customizable: true
      },
      {
        id: 'lab_instructions',
        name: 'Lab Test Preparation Instructions',
        description: 'Pre-lab testing guidance',
        type: 'email' as const,
        category: 'Patient Education',
        preSelected: true,
        customizable: true
      }
    ]
  };

  const availableTemplates = templatesBySpecialty[specialty] || [];

  const handleAutoGenerationToggle = (enabled: boolean) => {
    onUpdateTemplateConfig({
      ...templateConfig,
      enableAutoGeneration: enabled,
      selectedTemplates: enabled ? availableTemplates.filter(t => t.preSelected).map(t => t.id) : []
    });
  };

  const handleTemplateToggle = (templateId: string, checked: boolean) => {
    const updatedSelected = checked
      ? [...templateConfig.selectedTemplates, templateId]
      : templateConfig.selectedTemplates.filter(id => id !== templateId);

    onUpdateTemplateConfig({
      ...templateConfig,
      selectedTemplates: updatedSelected
    });
  };

  const handlePreferenceToggle = (preference: string, enabled: boolean) => {
    onUpdateTemplateConfig({
      ...templateConfig,
      customizationPreferences: {
        ...templateConfig.customizationPreferences,
        [preference]: enabled
      }
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'form': return <FileText className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'sms': return <MessageSquare className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'form': return 'bg-blue-100 text-blue-800';
      case 'email': return 'bg-green-100 text-green-800';
      case 'sms': return 'bg-purple-100 text-purple-800';
      case 'document': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Template Pre-Population</h2>
        <p className="text-gray-600 text-lg">
          We'll pre-populate your {specialtyConfig.brandName.toLowerCase()} practice with industry-specific forms, templates, and communication workflows.
        </p>
      </div>

      {/* Enable Auto-Generation */}
      <Card className="border-2" style={{ borderColor: specialtyConfig.primaryColor + '20' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" style={{ color: specialtyConfig.primaryColor }} />
            Smart Template Generation
          </CardTitle>
          <CardDescription>
            Automatically generate specialty-specific templates customized for your {specialtyConfig.brandName.toLowerCase()} practice.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Enable Template Pre-Population</Label>
              <p className="text-sm text-gray-600">Generate templates based on your specialty and best practices</p>
            </div>
            <Switch
              checked={templateConfig.enableAutoGeneration}
              onCheckedChange={handleAutoGenerationToggle}
            />
          </div>
        </CardContent>
      </Card>

      {templateConfig.enableAutoGeneration && (
        <>
          {/* Template Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" style={{ color: specialtyConfig.primaryColor }} />
                Select Templates to Generate
              </CardTitle>
              <CardDescription>
                Choose which templates you'd like us to create for your practice. You can customize them later.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {availableTemplates.map((template) => (
                  <Card key={template.id} className="p-4">
                    <div className="flex items-start gap-4">
                      <Checkbox
                        checked={templateConfig.selectedTemplates.includes(template.id)}
                        onCheckedChange={(checked) => handleTemplateToggle(template.id, checked as boolean)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getTypeIcon(template.type)}
                          <h4 className="font-medium">{template.name}</h4>
                          <Badge className={getTypeColor(template.type)}>
                            {template.type}
                          </Badge>
                          {template.preSelected && (
                            <Badge variant="secondary">Recommended</Badge>
                          )}
                          {template.customizable && (
                            <Badge variant="outline">Customizable</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                        <p className="text-xs text-gray-500">Category: {template.category}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Customization Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" style={{ color: specialtyConfig.primaryColor }} />
                Customization Preferences
              </CardTitle>
              <CardDescription>
                Configure how your templates should be customized for your practice.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Use Specialty-Specific Terminology</Label>
                  <p className="text-sm text-gray-600">Include medical terms specific to {specialtyConfig.brandName.toLowerCase()}</p>
                </div>
                <Switch
                  checked={templateConfig.customizationPreferences.useSpecialtyTerminology}
                  onCheckedChange={(checked) => handlePreferenceToggle('useSpecialtyTerminology', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Include Practice Branding</Label>
                  <p className="text-sm text-gray-600">Add your practice colors, logo, and contact information</p>
                </div>
                <Switch
                  checked={templateConfig.customizationPreferences.includeBranding}
                  onCheckedChange={(checked) => handlePreferenceToggle('includeBranding', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Multi-Language Support</Label>
                  <p className="text-sm text-gray-600">Generate templates in multiple languages if needed</p>
                </div>
                <Switch
                  checked={templateConfig.customizationPreferences.autoTranslate}
                  onCheckedChange={(checked) => handlePreferenceToggle('autoTranslate', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Generation Summary */}
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h4 className="font-medium text-green-900">Template Generation Summary</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-700">
                    {templateConfig.selectedTemplates.length}
                  </div>
                  <div className="text-sm text-green-600">Templates Selected</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-700">
                    {availableTemplates.filter(t => t.type === 'form' && templateConfig.selectedTemplates.includes(t.id)).length}
                  </div>
                  <div className="text-sm text-green-600">Intake Forms</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-700">
                    {availableTemplates.filter(t => t.type === 'email' && templateConfig.selectedTemplates.includes(t.id)).length}
                  </div>
                  <div className="text-sm text-green-600">Email Templates</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-700">
                    {availableTemplates.filter(t => t.customizable && templateConfig.selectedTemplates.includes(t.id)).length}
                  </div>
                  <div className="text-sm text-green-600">Customizable</div>
                </div>
              </div>
              <p className="text-sm text-green-700 mt-4">
                Templates will be generated and ready for use immediately after setup completion.
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
