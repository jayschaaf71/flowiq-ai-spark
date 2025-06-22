
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
    mutationFn: async (params: {
      submissionId: string;
      staffId: string;
      staffName: string;
    }) => {
      return await StaffAssignmentService.assignSubmission(
        params.submissionId,
        params.staffId,
        params.staffName,
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
    mutationFn: async (params: {
      submissionId: string;
      templateId: string;
      recipient: string;
      patientName: string;
      customMessage?: string;
      type: 'email' | 'sms';
    }) => {
      return await CommunicationService.sendCommunication({
        submissionId: params.submissionId,
        templateId: params.templateId,
        recipient: params.recipient,
        patientName: params.patientName,
        customMessage: params.customMessage,
        type: params.type
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

  // Wrapper functions to match expected signatures
  const assignStaff = (submissionId: string, staffId: string, staffName: string) => {
    assignStaffMutation.mutate({ submissionId, staffId, staffName });
  };

  const sendCommunication = (
    submissionId: string,
    templateId: string,
    recipient: string,
    patientName: string,
    customMessage?: string,
    type: 'email' | 'sms' = 'email'
  ) => {
    sendCommunicationMutation.mutate({
      submissionId,
      templateId,
      recipient,
      patientName,
      customMessage,
      type
    });
  };

  const updateStatus = (submissionId: string, status: string) => {
    updateStatusMutation.mutate({ submissionId, status });
  };

  return {
    submissions: submissions || [],
    isLoading,
    assignStaff,
    sendCommunication,
    updateStatus,
    isAssigning: assignStaffMutation.isPending,
    isSendingCommunication: sendCommunicationMutation.isPending,
    isUpdatingStatus: updateStatusMutation.isPending,
  };
};
