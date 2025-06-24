
export interface TemplateItem {
  id: string;
  name: string;
  description: string;
  icon: any;
  estimated_time: string;
  templates_count: number;
}

export interface TemplateConfig {
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
}

export interface TemplatePrePopulationStepProps {
  specialty: any;
  templateConfig: TemplateConfig;
  onUpdateTemplateConfig: (config: any) => void;
}
