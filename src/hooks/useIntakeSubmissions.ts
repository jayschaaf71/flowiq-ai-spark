
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { StaffAssignmentService } from '@/services/staffAssignmentService';
import { CommunicationService } from '@/services/communicationService';

export const useIntakeSubmissions = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch submissions with real-time assignments
  const { data: submissions, isLoading } = useQuery({
    queryKey: ['intake-submissions-with-assignments'],
    queryFn: async () => {
      const { data: submissionsData, error: submissionsError } = await supabase
        .from('intake_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (submissionsError) throw submissionsError;

      // Fetch current assignments for each submission
      const submissionsWithAssignments = await Promise.all(
        submissionsData.map(async (submission) => {
          const currentAssignment = await StaffAssignmentService.getCurrentAssignment(submission.id);
          return {
            ...submission,
            currentAssignment
          };
        })
      );

      return submissionsWithAssignments;
    },
  });

  // Assign staff mutation
  const assignStaffMutation = useMutation({
    mutationFn: async ({ submissionId, staffId, staffName }: {
      submissionId: string;
      staffId: string;
      staffName: string;
    }) => {
      return await StaffAssignmentService.assignSubmission(
        submissionId,
        staffId,
        staffName,
        'system' // You might want to track who made the assignment
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intake-submissions-with-assignments'] });
      toast({
        title: "Assignment successful",
        description: "Submission has been assigned to staff member",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Assignment failed",
        description: error.message,
        variant: "destructive"
      });
    },
  });

  // Send communication mutation
  const sendCommunicationMutation = useMutation({
    mutationFn: async ({
      submissionId,
      templateId,
      recipient,
      patientName,
      customMessage,
      type
    }: {
      submissionId: string;
      templateId: string;
      recipient: string;
      patientName: string;
      customMessage?: string;
      type: 'email' | 'sms';
    }) => {
      return await CommunicationService.sendCommunication({
        submissionId,
        templateId,
        recipient,
        patientName,
        customMessage,
        type
      });
    },
    onSuccess: () => {
      toast({
        title: "Communication sent",
        description: "Message has been sent successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Communication failed",
        description: error.message,
        variant: "destructive"
      });
    },
  });

  // Update submission status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ submissionId, status }: {
      submissionId: string;
      status: string;
    }) => {
      const { error } = await supabase
        .from('intake_submissions')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', submissionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intake-submissions-with-assignments'] });
      toast({
        title: "Status updated",
        description: "Submission status has been updated",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive"
      });
    },
  });

  return {
    submissions: submissions || [],
    isLoading,
    assignStaff: assignStaffMutation.mutate,
    sendCommunication: sendCommunicationMutation.mutate,
    updateStatus: updateStatusMutation.mutate,
    isAssigning: assignStaffMutation.isPending,
    isSendingCommunication: sendCommunicationMutation.isPending,
    isUpdatingStatus: updateStatusMutation.isPending,
  };
};
