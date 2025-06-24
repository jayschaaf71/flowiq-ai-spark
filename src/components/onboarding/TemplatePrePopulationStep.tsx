
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Sparkles, 
  Clock, 
  CheckCircle2,
  Settings,
  Download,
  Eye
} from "lucide-react";
import { SpecialtyType, specialtyConfigs } from '@/utils/specialtyConfig';

interface TemplatePrePopulationStepProps {
  specialty: SpecialtyType;
  templateConfig: {
    enableAutoGeneration: boolean;
    selectedTemplates: string[];
    customizationPreferences: {
      includeBranding: boolean;
      primaryColor: string;
      secondaryColor: string;
      logoUrl?: string;
    };
    generationProgress: number;
    generatedTemplates: any[];
  };
  onUpdateTemplateConfig: (config: any) => void;
}

export const TemplatePrePopulationStep: React.FC<TemplatePrePopulationStepProps> = ({
  specialty,
  templateConfig,
  onUpdateTemplateConfig
}) => {
  const specialtyConfig = specialtyConfigs[specialty];

  const availableTemplates = [
    {
      id: 'intake-forms',
      name: 'Intake Forms',
      description: `Specialty-specific intake forms for ${specialtyConfig.brandName.toLowerCase()}`,
      icon: FileText,
      estimated_time: '2 min',
      templates_count: specialtyConfig.formTemplates?.length || 3
    },
    {
      id: 'consent-forms',
      name: 'Consent Forms',
      description: 'Treatment consent and HIPAA authorization forms',
      icon: FileText,
      estimated_time: '1 min',
      templates_count: 4
    },
    {
      id: 'appointment-confirmations',
      name: 'Appointment Templates',
      description: 'Confirmation, reminder, and follow-up templates',
      icon: Clock,
      estimated_time: '1 min',
      templates_count: 6
    },
    {
      id: 'billing-templates',
      name: 'Billing Templates',
      description: 'Insurance claims and payment request templates',
      icon: Settings,
      estimated_time: '2 min',
      templates_count: 5
    }
  ];

  const handleToggleAutoGeneration = (enabled: boolean) => {
    onUpdateTemplateConfig({
      ...templateConfig,
      enableAutoGeneration: enabled
    });
  };

  const handleTemplateToggle = (templateId: string, enabled: boolean) => {
    const updatedTemplates = enabled
      ? [...templateConfig.selectedTemplates, templateId]
      : templateConfig.selectedTemplates.filter(id => id !== templateId);

    onUpdateTemplateConfig({
      ...templateConfig,
      selectedTemplates: updatedTemplates
    });
  };

  const handleCustomizationChange = (key: string, value: any) => {
    onUpdateTemplateConfig({
      ...templateConfig,
      customizationPreferences: {
        ...templateConfig.customizationPreferences,
        [key]: value
      }
    });
  };

  const handleGenerateTemplates = async () => {
    // Simulate template generation
    onUpdateTemplateConfig({
      ...templateConfig,
      generationProgress: 0
    });

    // Simulate progress
    for (let i = 0; i <= 100; i += 20) {
      setTimeout(() => {
        onUpdateTemplateConfig({
          ...templateConfig,
          generationProgress: i
        });
      }, i * 30);
    }
  };

  const isGenerating = templateConfig.generationProgress > 0 && templateConfig.generationProgress < 100;
  const hasGenerated = templateConfig.generationProgress === 100;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Template Pre-Population</h2>
        <p className="text-gray-600 text-lg">
          Let our AI generate specialty-specific templates for your {specialtyConfig.brandName.toLowerCase()} practice to get you started quickly.
        </p>
      </div>

      {/* Enable Auto-Generation */}
      <Card className="border-2" style={{ borderColor: specialtyConfig.primaryColor + '20' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" style={{ color: specialtyConfig.primaryColor }} />
            AI Template Generation
          </CardTitle>
          <CardDescription>
            Automatically generate customized forms and templates for your practice specialty.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Enable AI Template Generation</Label>
              <p className="text-sm text-gray-600">Generate forms tailored to your specialty</p>
            </div>
            <Switch
              checked={templateConfig.enableAutoGeneration}
              onCheckedChange={handleToggleAutoGeneration}
            />
          </div>
        </CardContent>
      </Card>

      {templateConfig.enableAutoGeneration && (
        <>
          {/* Template Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Templates to Generate</CardTitle>
              <CardDescription>
                Choose which templates you'd like us to create for your practice.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {availableTemplates.map((template) => {
                  const Icon = template.icon;
                  const isSelected = templateConfig.selectedTemplates.includes(template.id);
                  
                  return (
                    <div key={template.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-gray-600" />
                        <div>
                          <h4 className="font-medium">{template.name}</h4>
                          <p className="text-sm text-gray-600">{template.description}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              {template.templates_count} templates
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              ~{template.estimated_time}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Switch
                        checked={isSelected}
                        onCheckedChange={(checked) => handleTemplateToggle(template.id, checked)}
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Customization Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Customization Preferences</CardTitle>
              <CardDescription>
                Customize how your templates will look and feel.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Include Practice Branding</Label>
                  <p className="text-sm text-gray-600">Add your practice colors and styling</p>
                </div>
                <Switch
                  checked={templateConfig.customizationPreferences.includeBranding}
                  onCheckedChange={(checked) => handleCustomizationChange('includeBranding', checked)}
                />
              </div>

              {templateConfig.customizationPreferences.includeBranding && (
                <div className="pl-4 space-y-3 border-l-2" style={{ borderColor: specialtyConfig.primaryColor }}>
                  <div>
                    <Label>Primary Color</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <div 
                        className="w-8 h-8 rounded-full border-2 border-gray-300"
                        style={{ backgroundColor: specialtyConfig.primaryColor }}
                      ></div>
                      <span className="text-sm font-mono">{specialtyConfig.primaryColor}</span>
                    </div>
                  </div>
                  <div>
                    <Label>Secondary Color</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <div 
                        className="w-8 h-8 rounded-full border-2 border-gray-300"
                        style={{ backgroundColor: specialtyConfig.secondaryColor }}
                      ></div>
                      <span className="text-sm font-mono">{specialtyConfig.secondaryColor}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Generation Controls */}
          {templateConfig.selectedTemplates.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                {!isGenerating && !hasGenerated && (
                  <div className="text-center">
                    <Button 
                      onClick={handleGenerateTemplates}
                      className="w-full"
                      style={{ backgroundColor: specialtyConfig.primaryColor }}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate {templateConfig.selectedTemplates.length} Template Set(s)
                    </Button>
                    <p className="text-sm text-gray-600 mt-2">
                      This will take approximately 3-5 minutes
                    </p>
                  </div>
                )}

                {isGenerating && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <h4 className="font-medium mb-2">Generating Templates...</h4>
                      <Progress value={templateConfig.generationProgress} className="w-full" />
                      <p className="text-sm text-gray-600 mt-2">
                        {templateConfig.generationProgress}% complete
                      </p>
                    </div>
                  </div>
                )}

                {hasGenerated && (
                  <div className="space-y-4">
                    <div className="text-center text-green-600">
                      <CheckCircle2 className="w-8 h-8 mx-auto mb-2" />
                      <h4 className="font-medium">Templates Generated Successfully!</h4>
                    </div>
                    <div className="flex gap-2 justify-center">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview Templates
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export Templates
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Preview of Generated Content */}
          {hasGenerated && (
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-900">Generated Templates</CardTitle>
                <CardDescription className="text-green-700">
                  Your specialty-specific templates are ready to use.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {templateConfig.selectedTemplates.map((templateId) => {
                    const template = availableTemplates.find(t => t.id === templateId);
                    return (
                      <div key={templateId} className="flex items-center justify-between p-2 bg-white rounded border">
                        <span className="text-sm font-medium">{template?.name}</span>
                        <Badge className="bg-green-100 text-green-800">
                          {template?.templates_count} templates
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};
