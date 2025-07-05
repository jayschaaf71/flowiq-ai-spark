
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAIClaimsProcessing = () => {
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const processClaimWithAI = async (claimId: string) => {
    try {
      setProcessing(true);
      
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update claim with AI results
      const aiConfidenceScore = Math.floor(Math.random() * 20) + 80; // 80-100%
      const processingStatus = aiConfidenceScore > 90 ? 'ready_for_review' : 'needs_review';
      
      const { error } = await supabase
        .from('claims')
        .update({ 
          status: processingStatus,
          notes: `AI Confidence Score: ${aiConfidenceScore}`
        })
        .eq('id', claimId);

      if (error) throw error;

      toast({
        title: "AI Processing Complete",
        description: `Claim processed with ${aiConfidenceScore}% confidence`,
      });

      return { success: true, confidence: aiConfidenceScore };
    } catch (err) {
      console.error('Error processing claim with AI:', err);
      toast({
        title: "AI Processing Failed",
        description: "Please try again or process manually",
        variant: "destructive"
      });
      return { success: false };
    } finally {
      setProcessing(false);
    }
  };

  const batchProcessClaims = async (claimIds: string[]) => {
    try {
      setProcessing(true);
      const results = [];
      
      for (const claimId of claimIds) {
        const result = await processClaimWithAI(claimId);
        results.push({ claimId, ...result });
        
        // Add small delay between batch processing
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      const successCount = results.filter(r => r.success).length;
      toast({
        title: "Batch Processing Complete",
        description: `${successCount}/${claimIds.length} claims processed successfully`,
      });
      
      return results;
    } catch (err) {
      console.error('Error in batch processing:', err);
      toast({
        title: "Batch Processing Failed",
        description: "Some claims may not have been processed",
        variant: "destructive"
      });
      return [];
    } finally {
      setProcessing(false);
    }
  };

  const validateClaimData = async (claimId: string) => {
    try {
      const { data: claim, error } = await supabase
        .from('claims')
        .select(`
          *,
          patients(first_name, last_name, date_of_birth),
          insurance_providers(name)
        `)
        .eq('id', claimId)
        .single();

      if (error) throw error;

      // Simulate AI validation
      const validationIssues = [];
      
      if (!claim.patients?.date_of_birth) {
        validationIssues.push('Missing patient date of birth');
      }
      
      if (!claim.total_amount || claim.total_amount <= 0) {
        validationIssues.push('Invalid claim amount');
      }
      
      if (!claim.submitted_date) {
        validationIssues.push('Missing service date');
      }

      return {
        isValid: validationIssues.length === 0,
        issues: validationIssues,
        confidence: validationIssues.length === 0 ? 95 : Math.max(50, 95 - (validationIssues.length * 15))
      };
    } catch (err) {
      console.error('Error validating claim:', err);
      return { isValid: false, issues: ['Validation failed'], confidence: 0 };
    }
  };

  return {
    processing,
    processClaimWithAI,
    batchProcessClaims,
    validateClaimData
  };
};
