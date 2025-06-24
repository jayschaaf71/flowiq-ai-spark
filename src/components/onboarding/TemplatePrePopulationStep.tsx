
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  FileText, 
  Sparkles, 
  Clock, 
  Settings,
  Database
} from "lucide-react";
import { SpecialtyType, specialtyConfigs } from '@/utils/specialtyConfig';
import { TemplateSelectionCard } from './template/TemplateSelectionCard';
import { CustomizationPreferences } from './template/CustomizationPreferences';
import { GenerationControls } from './template/GenerationControls';
import { GeneratedTemplatesPreview } from './template/GeneratedTemplatesPreview';
import { TemplatePrePopulationStepProps } from './template/types';

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
      icon: Database,
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
          <TemplateSelectionCard
            availableTemplates={availableTemplates}
            selectedTemplates={templateConfig.selectedTemplates}
            onTemplateToggle={handleTemplateToggle}
            primaryColor={specialtyConfig.primaryColor}
          />

          {/* Customization Preferences */}
          <CustomizationPreferences
            customizationPreferences={templateConfig.customizationPreferences}
            onCustomizationChange={handleCustomizationChange}
            primaryColor={specialtyConfig.primaryColor}
          />

          {/* Generation Controls */}
          <GenerationControls
            selectedTemplatesCount={templateConfig.selectedTemplates.length}
            generationProgress={templateConfig.generationProgress}
            onGenerateTemplates={handleGenerateTemplates}
            primaryColor={specialtyConfig.primaryColor}
          />

          {/* Preview of Generated Content */}
          <GeneratedTemplatesPreview
            selectedTemplates={templateConfig.selectedTemplates}
            availableTemplates={availableTemplates}
            hasGenerated={hasGenerated}
          />
        </>
      )}
    </div>
  );
};
