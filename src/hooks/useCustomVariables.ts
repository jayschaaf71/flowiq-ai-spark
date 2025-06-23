
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CustomVariable {
  id: string;
  key: string;
  label: string;
  description: string;
  type: 'text' | 'date' | 'number' | 'boolean' | 'select';
  defaultValue?: string;
  options?: string[];
  category: string;
  isSystem: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const useCustomVariables = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: variables = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['custom-variables'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('custom_variables')
        .select('*')
        .order('category', { ascending: true })
        .order('label', { ascending: true });

      if (error) throw error;

      return data.map(variable => ({
        id: variable.id,
        key: variable.key,
        label: variable.label,
        description: variable.description || '',
        type: variable.type as CustomVariable['type'],
        defaultValue: variable.default_value,
        options: variable.options,
        category: variable.category,
        isSystem: variable.is_system,
        createdAt: variable.created_at,
        updatedAt: variable.updated_at
      }));
    }
  });

  const createVariableMutation = useMutation({
    mutationFn: async (variable: Omit<CustomVariable, 'id' | 'isSystem' | 'createdAt' | 'updatedAt'>) => {
      const { data, error } = await supabase
        .from('custom_variables')
        .insert({
          key: variable.key,
          label: variable.label,
          description: variable.description,
          type: variable.type,
          default_value: variable.defaultValue,
          options: variable.options,
          category: variable.category,
          is_system: false
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-variables'] });
      toast({
        title: "Variable Created",
        description: "Custom variable has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create variable. Please try again.",
        variant: "destructive",
      });
    }
  });

  const updateVariableMutation = useMutation({
    mutationFn: async ({ id, ...variable }: Partial<CustomVariable> & { id: string }) => {
      const { data, error } = await supabase
        .from('custom_variables')
        .update({
          key: variable.key,
          label: variable.label,
          description: variable.description,
          type: variable.type,
          default_value: variable.defaultValue,
          options: variable.options,
          category: variable.category
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-variables'] });
      toast({
        title: "Variable Updated",
        description: "Custom variable has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update variable. Please try again.",
        variant: "destructive",
      });
    }
  });

  const deleteVariableMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('custom_variables')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-variables'] });
      toast({
        title: "Variable Deleted",
        description: "Custom variable has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete variable. Please try again.",
        variant: "destructive",
      });
    }
  });

  const variablesByCategory = variables.reduce((acc, variable) => {
    if (!acc[variable.category]) {
      acc[variable.category] = [];
    }
    acc[variable.category].push(variable);
    return acc;
  }, {} as Record<string, CustomVariable[]>);

  return {
    variables,
    variablesByCategory,
    isLoading,
    error,
    createVariable: createVariableMutation.mutate,
    updateVariable: updateVariableMutation.mutate,
    deleteVariable: deleteVariableMutation.mutate,
    isCreating: createVariableMutation.isPending,
    isUpdating: updateVariableMutation.isPending,
    isDeleting: deleteVariableMutation.isPending
  };
};
