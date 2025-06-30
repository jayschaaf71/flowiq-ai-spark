
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { payerIntegrationService, PayerConnection, ClaimSubmissionRequest, EligibilityRequest } from '@/services/payerIntegration';
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

export const useEligibilityCheck = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (request: EligibilityRequest) => 
      payerIntegrationService.checkEligibility(request),
    onSuccess: (data) => {
      toast({
        title: data.isEligible ? "Patient Eligible" : "Eligibility Issue",
        description: data.isEligible 
          ? `Coverage: ${data.coverageDetails.coveragePercentage}% after ${data.coverageDetails.copayAmount ? `$${data.coverageDetails.copayAmount} copay` : 'deductible'}`
          : data.errors?.[0] || "Patient not eligible for coverage",
        variant: data.isEligible ? "default" : "destructive",
      });
    },
    onError: (error) => {
      toast({
        title: "Eligibility Check Failed",
        description: error.message || "Unable to verify eligibility",
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

export const useRealTimeTransactionStatus = (transactionId: string) => {
  const [transaction, setTransaction] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!transactionId) return;

    const pollStatus = async () => {
      try {
        const updated = await payerIntegrationService.pollTransactionStatus(transactionId);
        if (updated) {
          setTransaction(updated);
          queryClient.invalidateQueries({ queryKey: ['claim-transactions'] });
        }
      } catch (error) {
        console.error('Error polling transaction status:', error);
      }
    };

    // Poll every 30 seconds
    const interval = setInterval(pollStatus, 30000);
    pollStatus(); // Initial call

    return () => clearInterval(interval);
  }, [transactionId, queryClient]);

  return transaction;
};
