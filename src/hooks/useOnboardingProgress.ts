
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface OnboardingProgress {
  id: string;
  user_id: string;
  tenant_id?: string;
  current_step: number;
  form_data: any;
  is_completed: boolean;
  completed_at?: string;
}

export const useOnboardingProgress = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch existing progress
  const { data: progress, isLoading } = useQuery({
    queryKey: ['onboarding-progress', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('onboarding_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_completed', false)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as OnboardingProgress | null;
    },
    enabled: !!user,
  });

  // Save progress mutation
  const saveProgressMutation = useMutation({
    mutationFn: async ({ 
      currentStep, 
      formData, 
      tenantId 
    }: { 
      currentStep: number; 
      formData: any; 
      tenantId?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const progressData = {
        user_id: user.id,
        current_step: currentStep,
        form_data: formData,
        tenant_id: tenantId,
        updated_at: new Date().toISOString()
      };

      if (progress?.id) {
        // Update existing progress
        const { data, error } = await supabase
          .from('onboarding_progress')
          .update(progressData)
          .eq('id', progress.id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        // Create new progress entry
        const { data, error } = await supabase
          .from('onboarding_progress')
          .insert([progressData])
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding-progress'] });
    },
    onError: (error) => {
      console.error('Error saving progress:', error);
      toast({
        title: 'Error saving progress',
        description: 'Your progress could not be saved. Please try again.',
        variant: 'destructive'
      });
    },
  });

  // Complete progress mutation
  const completeProgressMutation = useMutation({
    mutationFn: async (tenantId: string) => {
      if (!user || !progress?.id) throw new Error('No progress to complete');

      const { data, error } = await supabase
        .from('onboarding_progress')
        .update({
          is_completed: true,
          completed_at: new Date().toISOString(),
          tenant_id: tenantId
        })
        .eq('id', progress.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding-progress'] });
      toast({
        title: 'Onboarding completed!',
        description: 'Your setup has been saved successfully.',
      });
    },
  });

  // Clear progress (for starting fresh)
  const clearProgressMutation = useMutation({
    mutationFn: async () => {
      if (!progress?.id) return;

      const { error } = await supabase
        .from('onboarding_progress')
        .delete()
        .eq('id', progress.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding-progress'] });
    },
  });

  return {
    progress,
    isLoading,
    saveProgress: saveProgressMutation.mutate,
    isSaving: saveProgressMutation.isPending,
    completeProgress: completeProgressMutation.mutate,
    isCompleting: completeProgressMutation.isPending,
    clearProgress: clearProgressMutation.mutate,
    isClearing: clearProgressMutation.isPending,
  };
};
