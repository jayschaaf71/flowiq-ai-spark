
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
      const { data, error } = await supabase
        .from('message_templates')
        .select(`
          id,
          name,
          type,
          category,
          subject,
          content,
          variables,
          is_built_in,
          is_active,
          styling,
          metadata,
          created_at,
          updated_at
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(template => ({
        id: template.id,
        name: template.name,
        type: template.type as 'email' | 'sms',
        category: template.category,
        subject: template.subject,
        content: template.content,
        variables: template.variables || [],
        isBuiltIn: template.is_built_in,
        isActive: template.is_active,
        styling: (template.styling as Record<string, any>) || {},
        metadata: (template.metadata as Record<string, any>) || {},
        createdAt: template.created_at,
        updatedAt: template.updated_at,
        usageCount: 0, // Will be populated by usage query
        lastUsed: undefined
      }));
    }
  });

  const createTemplateMutation = useMutation({
    mutationFn: async (template: Omit<Template, 'id' | 'isBuiltIn' | 'usageCount' | 'lastUsed' | 'createdAt' | 'updatedAt'>) => {
      const { data, error } = await supabase
        .from('message_templates')
        .insert({
          name: template.name,
          type: template.type,
          category: template.category,
          subject: template.subject,
          content: template.content,
          variables: template.variables,
          styling: template.styling || {},
          metadata: template.metadata || {},
          is_active: template.isActive
        })
        .select()
        .single();

      if (error) throw error;
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
      const { data, error } = await supabase
        .from('message_templates')
        .update({
          name: template.name,
          type: template.type,
          category: template.category,
          subject: template.subject,
          content: template.content,
          variables: template.variables,
          styling: template.styling,
          metadata: template.metadata,
          is_active: template.isActive
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
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
      const { error } = await supabase
        .from('message_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
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
