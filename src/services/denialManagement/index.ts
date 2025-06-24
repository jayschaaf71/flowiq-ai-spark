
import { supabase } from "@/integrations/supabase/client";
import { DenialAnalysis } from './types';
import { patternIdentificationService } from './patternIdentification';
import { autoCorrectionService } from './autoCorrection';
import { denialAnalyticsService } from './analytics';
import { recommendationEngine } from './recommendationEngine';

// Re-export types for backward compatibility
export * from './types';

class DenialManagementService {
  // Analyze denial and provide auto-correction recommendations
  async analyzeDenial(claimId: string, denialReasons: string[]): Promise<DenialAnalysis> {
    try {
      console.log('Analyzing denial for claim:', claimId);

      // Get claim details
      const { data: claim, error: claimError } = await supabase
        .from('claims')
        .select(`
          *,
          claim_line_items(*),
          patients!inner(first_name, last_name, date_of_birth),
          providers!inner(first_name, last_name, npi)
        `)
        .eq('id', claimId)
        .single();

      if (claimError || !claim) {
        throw new Error('Claim not found');
      }

      // Identify denial patterns
      const patterns = await patternIdentificationService.identifyDenialPatterns(denialReasons);
      
      // Generate auto-corrections
      const autoCorrections = await autoCorrectionService.generateAutoCorrections(claim, patterns);
      
      // Calculate appeal probability
      const appealProbability = recommendationEngine.calculateAppealProbability(patterns, claim);
      
      // Generate recommended actions
      const recommendedActions = recommendationEngine.generateRecommendedActions(
        patterns, 
        autoCorrections, 
        appealProbability,
        parseFloat(claim.total_amount.toString())
      );

      return {
        claimId,
        denialReasons,
        patterns,
        autoCorrections,
        recommendedActions,
        appealProbability
      };

    } catch (error) {
      console.error('Denial analysis error:', error);
      throw error;
    }
  }

  // Apply auto-corrections to a claim
  async applyAutoCorrections(claimId: string, corrections: any[]): Promise<boolean> {
    return autoCorrectionService.applyAutoCorrections(claimId, corrections);
  }

  // Get denial analytics for dashboard
  async getDenialAnalytics(dateRange: { start: string; end: string }) {
    return denialAnalyticsService.getDenialAnalytics(dateRange);
  }
}

export const denialManagementService = new DenialManagementService();
