
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { payerIntegrationService, PayerConnection, ClaimSubmissionRequest } from '@/services/payerIntegration';
import { useToast } from '@/hooks/use-toast';

export const usePayerConnections = () => {
  return useQuery({
    queryKey: ['payer-connections'],
    queryFn: () => payerIntegrationService.getPayerConnections(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePayerConnection = (id: string) => {
  return useQuery({
    queryKey: ['payer-connection', id],
    queryFn: () => payerIntegrationService.getPayerConnection(id),
    enabled: !!id,
  });
};

export const useClaimSubmission = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (request: ClaimSubmissionRequest) => 
      payerIntegrationService.submitClaim(request),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['claims'] });
      queryClient.invalidateQueries({ queryKey: ['edi-transactions'] });
      toast({
        title: "Claim Submitted",
        description: `Claim submitted successfully with control number: ${data.controlNumber}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit claim to payer",
        variant: "destructive",
      });
    },
  });
};

export const useBatchClaimSubmission = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (requests: ClaimSubmissionRequest[]) => 
      payerIntegrationService.batchSubmitClaims(requests),
    onSuccess: (results) => {
      queryClient.invalidateQueries({ queryKey: ['claims'] });
      queryClient.invalidateQueries({ queryKey: ['edi-transactions'] });
      
      const successful = results.filter(r => r.status === 'submitted').length;
      const failed = results.length - successful;
      
      toast({
        title: "Batch Submission Complete",
        description: `${successful} claims submitted successfully, ${failed} failed`,
      });
    },
    onError: (error) => {
      toast({
        title: "Batch Submission Failed",
        description: error.message || "Failed to submit claims batch",
        variant: "destructive",
      });
    },
  });
};

export const useConnectionTest = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payerId: string) => 
      payerIntegrationService.testConnection(payerId),
    onSuccess: (result) => {
      toast({
        title: result.success ? "Connection Successful" : "Connection Failed",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });
    },
    onError: (error) => {
      toast({
        title: "Connection Test Failed",
        description: error.message || "Unable to test connection",
        variant: "destructive",
      });
    },
  });
};

export const useClaimTransactions = (claimId: string) => {
  return useQuery({
    queryKey: ['claim-transactions', claimId],
    queryFn: () => payerIntegrationService.getClaimTransactions(claimId),
    enabled: !!claimId,
  });
};
