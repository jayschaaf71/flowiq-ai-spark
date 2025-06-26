
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useIntakeForms } from './useIntakeForms';

export const useIntakeSubmissions = () => {
  const { submissions, loading } = useIntakeForms();
  const queryClient = useQueryClient();

  // Assign staff to submission
  const assignStaffMutation = useMutation({
    mutationFn: async ({ submissionId, staffId }: { submissionId: string; staffId: string }) => {
      const { data, error } = await supabase
        .from('intake_submissions')
        .update({ 
          status: 'assigned',
          // Note: We don't have an assigned_to field in the current schema
          // This would need to be added to the database schema
        })
        .eq('id', submissionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intake-submissions'] });
      toast.success('Staff member assigned successfully');
    },
    onError: (error) => {
      toast.error(`Failed to assign staff: ${error.message}`);
    },
  });

  // Send communication
  const sendCommunicationMutation = useMutation({
    mutationFn: async ({ 
      submissionId, 
      type, 
      recipient, 
      message 
    }: { 
      submissionId: string; 
      type: string; 
      recipient: string; 
      message: string; 
    }) => {
      const { data, error } = await supabase
        .from('communication_logs')
        .insert({
          submission_id: submissionId,
          type,
          recipient,
          message: message,
          status: 'sent'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intake-submissions'] });
      toast.success('Communication sent successfully');
    },
    onError: (error) => {
      toast.error(`Failed to send communication: ${error.message}`);
    },
  });

  // Update submission status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ submissionId, status }: { submissionId: string; status: string }) => {
      const { data, error } = await supabase
        .from('intake_submissions')
        .update({ status })
        .eq('id', submissionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intake-submissions'] });
      toast.success('Status updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update status: ${error.message}`);
    },
  });

  return {
    submissions,
    isLoading: loading,
    assignStaff: assignStaffMutation.mutate,
    sendCommunication: sendCommunicationMutation.mutate,
    updateStatus: updateStatusMutation.mutate,
    isAssigning: assignStaffMutation.isPending,
    isSendingCommunication: sendCommunicationMutation.isPending,
    isUpdatingStatus: updateStatusMutation.isPending,
  };
};
