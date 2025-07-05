import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface SOAPTemplate {
  id: string;
  name: string;
  specialty: string;
  template_data: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
  is_active: boolean;
  created_at: string;
  created_by: string | null;
}

export const useSOAPTemplates = (specialty?: string) => {
  return useQuery({
    queryKey: ['soap_templates', specialty],
    queryFn: async () => {
      // Mock SOAP templates data
      const mockTemplates: SOAPTemplate[] = [
        {
          id: '1',
          name: 'Chiropractic Initial Evaluation',
          specialty: 'chiropractic',
          template_data: {
            subjective: 'Chief complaint: [CHIEF_COMPLAINT]\nHistory of present illness: [HPI]\nPain scale: [PAIN_SCALE]/10',
            objective: 'Vital signs: [VITALS]\nRange of motion: [ROM]\nOrthopedic tests: [ORTHO_TESTS]',
            assessment: 'Primary diagnosis: [DIAGNOSIS]\nSecondary conditions: [SECONDARY]',
            plan: 'Treatment plan: [TREATMENT]\nFrequency: [FREQUENCY]\nHome exercises: [EXERCISES]'
          },
          is_active: true,
          created_at: new Date().toISOString(),
          created_by: 'provider-1'
        },
        {
          id: '2',
          name: 'Follow-up Visit',
          specialty: 'general',
          template_data: {
            subjective: 'Patient reports [IMPROVEMENT/WORSENING] since last visit\nCurrent symptoms: [SYMPTOMS]',
            objective: 'Physical examination findings: [FINDINGS]\nResponse to previous treatment: [RESPONSE]',
            assessment: 'Clinical impression: [ASSESSMENT]\nProgress: [PROGRESS]',
            plan: 'Continue current treatment\nModifications: [MODIFICATIONS]\nNext visit: [NEXT_VISIT]'
          },
          is_active: true,
          created_at: new Date().toISOString(),
          created_by: 'provider-1'
        }
      ];

      return specialty 
        ? mockTemplates.filter(template => template.specialty === specialty || template.specialty === 'general')
        : mockTemplates;
    },
  });
};

export const useCreateSOAPTemplate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (template: Omit<SOAPTemplate, 'id' | 'created_at' | 'created_by'>) => {
      // Mock template creation
      console.log('Creating SOAP template:', template);
      
      const newTemplate: SOAPTemplate = {
        ...template,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        created_by: 'current-user'
      };

      return newTemplate;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['soap_templates'] });
      toast({
        title: "Template created",
        description: "SOAP template has been created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create SOAP template",
        variant: "destructive",
      });
    },
  });
};