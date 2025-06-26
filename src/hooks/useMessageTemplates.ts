
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface MessageTemplate {
  id: string;
  name: string;
  type: 'sms' | 'email';
  subject?: string;
  content: string;
  variables: string[];
  category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

// Mock data for development until tables are created
const mockTemplates: MessageTemplate[] = [
  {
    id: '1',
    name: '24-hour Appointment Reminder',
    type: 'sms',
    content: 'Hi {{patientName}}, this is a reminder of your appointment tomorrow at {{appointmentTime}}. Reply CONFIRM if you will be there.',
    variables: ['patientName', 'appointmentTime', 'appointmentDate'],
    category: 'appointment',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Appointment Confirmation Email',
    type: 'email',
    subject: 'Appointment Confirmation - {{appointmentDate}}',
    content: 'Dear {{patientName}},\n\nThis email confirms your appointment on {{appointmentDate}} at {{appointmentTime}}.\n\nPlease arrive 15 minutes early.\n\nBest regards,\nYour Healthcare Team',
    variables: ['patientName', 'appointmentDate', 'appointmentTime'],
    category: 'appointment',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export const useMessageTemplates = () => {
  return useQuery({
    queryKey: ['message_templates'],
    queryFn: async () => {
      // Return mock data for now
      return mockTemplates.filter(template => template.is_active);
    },
  });
};

export const useCreateMessageTemplate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (template: Omit<MessageTemplate, 'id' | 'created_at' | 'updated_at'>) => {
      // Mock creation for now
      const newTemplate = {
        ...template,
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      console.log('Mock template created:', newTemplate);
      return newTemplate;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['message_templates'] });
      toast({
        title: "Template Created",
        description: "Message template has been created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create message template",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateMessageTemplate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<MessageTemplate> & { id: string }) => {
      // Mock update for now
      const updatedTemplate = { id, ...updates, updated_at: new Date().toISOString() };
      console.log('Mock template updated:', updatedTemplate);
      return updatedTemplate;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['message_templates'] });
      toast({
        title: "Template Updated",
        description: "Message template has been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update message template",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteMessageTemplate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      // Mock deletion for now
      console.log('Mock template deleted:', id);
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['message_templates'] });
      toast({
        title: "Template Deleted",
        description: "Message template has been deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete message template",
        variant: "destructive",
      });
    },
  });
};
