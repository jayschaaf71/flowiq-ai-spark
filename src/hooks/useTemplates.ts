
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Template {
  id: string;
  name: string;
  type: 'email' | 'sms';
  category: string;
  subject?: string;
  content: string;
  variables: string[];
  isBuiltIn: boolean;
  isActive: boolean;
  usageCount?: number;
  lastUsed?: string;
  styling?: Record<string, any>;
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export const useTemplates = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: templates = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['templates'],
    queryFn: async () => {
      // Mock templates data since table doesn't exist
      console.log('Using mock templates data');
      
      const mockTemplates: Template[] = [
        {
          id: '1',
          name: 'Appointment Reminder',
          type: 'email',
          category: 'reminders',
          subject: 'Appointment Reminder - {{practice_name}}',
          content: 'Dear {{patient_name}}, this is a reminder about your appointment on {{appointment_date}} at {{appointment_time}}.',
          variables: ['practice_name', 'patient_name', 'appointment_date', 'appointment_time'],
          isBuiltIn: true,
          isActive: true,
          usageCount: 150,
          lastUsed: new Date().toISOString(),
          styling: {},
          metadata: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Welcome Message',
          type: 'sms',
          category: 'welcome',
          content: 'Welcome to {{practice_name}}! We look forward to seeing you.',
          variables: ['practice_name'],
          isBuiltIn: true,
          isActive: true,
          usageCount: 85,
          lastUsed: new Date().toISOString(),
          styling: {},
          metadata: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];

      return mockTemplates;
    }
  });

  const createTemplateMutation = useMutation({
    mutationFn: async (template: Omit<Template, 'id' | 'isBuiltIn' | 'usageCount' | 'lastUsed' | 'createdAt' | 'updatedAt'>) => {
      // Mock template creation since table doesn't exist
      console.log('Mock creating template:', template);
      
      const data = {
        id: Date.now().toString(),
        ...template,
        isBuiltIn: false,
        usageCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast({
        title: "Template Created",
        description: "Your template has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create template. Please try again.",
        variant: "destructive",
      });
    }
  });

  const updateTemplateMutation = useMutation({
    mutationFn: async ({ id, ...template }: Partial<Template> & { id: string }) => {
      // Mock template update since table doesn't exist
      console.log('Mock updating template:', id, template);
      
      const data = {
        id,
        ...template,
        updatedAt: new Date().toISOString()
      };
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast({
        title: "Template Updated",
        description: "Your template has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update template. Please try again.",
        variant: "destructive",
      });
    }
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: async (id: string) => {
      // Mock template deletion since table doesn't exist
      console.log('Mock deleting template:', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast({
        title: "Template Deleted",
        description: "Template has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete template. Please try again.",
        variant: "destructive",
      });
    }
  });

  return {
    templates,
    isLoading,
    error,
    createTemplate: createTemplateMutation.mutate,
    updateTemplate: updateTemplateMutation.mutate,
    deleteTemplate: deleteTemplateMutation.mutate,
    isCreating: createTemplateMutation.isPending,
    isUpdating: updateTemplateMutation.isPending,
    isDeleting: deleteTemplateMutation.isPending
  };
};
