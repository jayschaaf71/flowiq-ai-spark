
import { supabase } from "@/integrations/supabase/client";

export interface DenialPattern {
  id: string;
  denialCode: string;
  description: string;
  frequency: number;
  autoCorrectible: boolean;
  correctionRules: CorrectionRule[];
  category: 'coding' | 'authorization' | 'eligibility' | 'documentation' | 'billing';
}

export interface CorrectionRule {
  id: string;
  condition: string;
  action: 'recode' | 'modifier' | 'documentation' | 'resubmit';
  parameters: Record<string, any>;
  successRate: number;
}

export interface DenialAnalysis {
  claimId: string;
  denialReasons: string[];
  patterns: DenialPattern[];
  autoCorrections: AutoCorrection[];
  recommendedActions: RecommendedAction[];
  appealProbability: number;
}

export interface AutoCorrection {
  type: 'code_change' | 'modifier_add' | 'documentation_update';
  originalValue: string;
  correctedValue: string;
  confidence: number;
  reason: string;
}

export interface RecommendedAction {
  action: 'appeal' | 'correct_and_resubmit' | 'patient_responsibility' | 'write_off';
  priority: 'high' | 'medium' | 'low';
  estimatedValue: number;
  timeframe: string;
  description: string;
}

interface GroupedDenialData {
  count: number;
  amount: number;
}

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
      const patterns = await this.identifyDenialPatterns(denialReasons);
      
      // Generate auto-corrections
      const autoCorrections = await this.generateAutoCorrections(claim, patterns);
      
      // Calculate appeal probability
      const appealProbability = this.calculateAppealProbability(patterns, claim);
      
      // Generate recommended actions
      const recommendedActions = this.generateRecommendedActions(
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
  async applyAutoCorrections(claimId: string, corrections: AutoCorrection[]): Promise<boolean> {
    try {
      console.log('Applying auto-corrections to claim:', claimId);

      for (const correction of corrections) {
        switch (correction.type) {
          case 'code_change':
            await this.updateProcedureCode(claimId, correction);
            break;
          case 'modifier_add':
            await this.addModifier(claimId, correction);
            break;
          case 'documentation_update':
            await this.updateDocumentation(claimId, correction);
            break;
        }
      }

      // Update claim status
      await supabase
        .from('claims')
        .update({
          processing_status: 'auto_corrected',
          updated_at: new Date().toISOString()
        })
        .eq('id', claimId);

      // Create audit log
      await this.logAutoCorrection(claimId, corrections);

      return true;

    } catch (error) {
      console.error('Auto-correction error:', error);
      return false;
    }
  }

  // Get denial analytics for dashboard
  async getDenialAnalytics(dateRange: { start: string; end: string }) {
    const { data: denials, error } = await supabase
      .from('claim_denials')
      .select(`
        *,
        claims!inner(total_amount, provider_id, service_date)
      `)
      .gte('denial_date', dateRange.start)
      .lte('denial_date', dateRange.end);

    if (error) throw error;

    // Calculate metrics
    const totalDenials = denials?.length || 0;
    const totalDeniedAmount = denials?.reduce((sum, d) => sum + parseFloat(d.denial_amount.toString()), 0) || 0;
    const autoCorrectible = denials?.filter(d => d.is_auto_correctable).length || 0;
    const autoCorrectSuccessful = denials?.filter(d => d.auto_correction_success).length || 0;

    // Group by denial reason
    const denialsByReason = this.groupDenialsByReason(denials || []);
    
    // Calculate trends
    const trends = this.calculateDenialTrends(denials || []);

    return {
      totalDenials,
      totalDeniedAmount,
      autoCorrectible,
      autoCorrectSuccessful,
      autoCorrectRate: autoCorrectible > 0 ? (autoCorrectSuccessful / autoCorrectible) * 100 : 0,
      denialsByReason,
      trends
    };
  }

  // Private helper methods
  private async identifyDenialPatterns(denialReasons: string[]): Promise<DenialPattern[]> {
    // Mock pattern identification - in production this would use ML
    const commonPatterns: DenialPattern[] = [
      {
        id: '1',
        denialCode: 'CO-97',
        description: 'Invalid/missing provider identifier',
        frequency: 25,
        autoCorrectible: true,
        correctionRules: [{
          id: '1',
          condition: 'missing_npi',
          action: 'recode',
          parameters: { field: 'provider_npi' },
          successRate: 95
        }],
        category: 'coding'
      },
      {
        id: '2',
        denialCode: 'CO-16',
        description: 'Claim lacks information',
        frequency: 18,
        autoCorrectible: true,
        correctionRules: [{
          id: '2',
          condition: 'missing_diagnosis',
          action: 'documentation',
          parameters: { required_field: 'primary_diagnosis' },
          successRate: 87
        }],
        category: 'documentation'
      }
    ];

    return commonPatterns.filter(pattern => 
      denialReasons.some(reason => reason.includes(pattern.denialCode))
    );
  }

  private async generateAutoCorrections(claim: any, patterns: DenialPattern[]): Promise<AutoCorrection[]> {
    const corrections: AutoCorrection[] = [];

    for (const pattern of patterns) {
      if (pattern.autoCorrectible) {
        for (const rule of pattern.correctionRules) {
          switch (rule.action) {
            case 'recode':
              corrections.push({
                type: 'code_change',
                originalValue: claim.claim_line_items[0]?.procedure_code || '',
                correctedValue: this.suggestCorrectedCode(claim.claim_line_items[0]?.procedure_code),
                confidence: rule.successRate,
                reason: pattern.description
              });
              break;
            case 'modifier':
              corrections.push({
                type: 'modifier_add',
                originalValue: '',
                correctedValue: this.suggestModifier(pattern.denialCode),
                confidence: rule.successRate,
                reason: pattern.description
              });
              break;
          }
        }
      }
    }

    return corrections;
  }

  private calculateAppealProbability(patterns: DenialPattern[], claim: any): number {
    // Simple calculation based on pattern success rates and claim value
    const baseProb = patterns.reduce((avg, p) => avg + (p.correctionRules[0]?.successRate || 0), 0) / patterns.length;
    const claimValue = parseFloat(claim.total_amount.toString());
    const valueMultiplier = claimValue > 500 ? 1.2 : claimValue > 200 ? 1.1 : 1.0;
    
    return Math.min(95, Math.max(10, baseProb * valueMultiplier));
  }

  private generateRecommendedActions(
    patterns: DenialPattern[], 
    corrections: AutoCorrection[], 
    appealProbability: number,
    claimValue: number
  ): RecommendedAction[] {
    const actions: RecommendedAction[] = [];

    if (corrections.length > 0 && corrections.some(c => c.confidence > 80)) {
      actions.push({
        action: 'correct_and_resubmit',
        priority: 'high',
        estimatedValue: claimValue * 0.9,
        timeframe: '2-3 days',
        description: 'Auto-correct identified issues and resubmit claim'
      });
    }

    if (appealProbability > 70) {
      actions.push({
        action: 'appeal',
        priority: claimValue > 500 ? 'high' : 'medium',
        estimatedValue: claimValue * (appealProbability / 100),
        timeframe: '30-60 days',
        description: 'High probability of successful appeal'
      });
    }

    return actions;
  }

  private suggestCorrectedCode(originalCode: string): string {
    // Mock code correction logic
    const corrections: Record<string, string> = {
      '99213': '99214',
      '99201': '99202',
      'D1110': 'D1120'
    };
    return corrections[originalCode] || originalCode;
  }

  private suggestModifier(denialCode: string): string {
    // Mock modifier suggestions
    const modifiers: Record<string, string> = {
      'CO-97': 'GT',
      'CO-16': '25'
    };
    return modifiers[denialCode] || '';
  }

  private async updateProcedureCode(claimId: string, correction: AutoCorrection): Promise<void> {
    await supabase
      .from('claim_line_items')
      .update({ procedure_code: correction.correctedValue })
      .eq('claim_id', claimId)
      .eq('procedure_code', correction.originalValue);
  }

  private async addModifier(claimId: string, correction: AutoCorrection): Promise<void> {
    // Implementation would add modifier to claim line items
    console.log('Adding modifier:', correction.correctedValue, 'to claim:', claimId);
  }

  private async updateDocumentation(claimId: string, correction: AutoCorrection): Promise<void> {
    // Implementation would update claim documentation
    console.log('Updating documentation for claim:', claimId);
  }

  private async logAutoCorrection(claimId: string, corrections: AutoCorrection[]): Promise<void> {
    // Log the auto-correction for audit trail
    console.log('Logging auto-corrections for claim:', claimId, corrections);
  }

  private groupDenialsByReason(denials: any[]) {
    const grouped = denials.reduce((acc, denial) => {
      const reason = denial.denial_reason || 'Unknown';
      if (!acc[reason]) {
        acc[reason] = { count: 0, amount: 0 };
      }
      acc[reason].count++;
      acc[reason].amount += parseFloat(denial.denial_amount.toString());
      return acc;
    }, {} as Record<string, GroupedDenialData>);

    return Object.entries(grouped).map(([reason, data]) => ({
      reason,
      count: (data as GroupedDenialData).count,
      amount: (data as GroupedDenialData).amount
    }));
  }

  private calculateDenialTrends(denials: any[]) {
    // Calculate month-over-month trends
    const monthlyData = denials.reduce((acc, denial) => {
      const month = new Date(denial.denial_date).toISOString().slice(0, 7);
      if (!acc[month]) {
        acc[month] = { count: 0, amount: 0 };
      }
      acc[month].count++;
      acc[month].amount += parseFloat(denial.denial_amount.toString());
      return acc;
    }, {} as Record<string, GroupedDenialData>);

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      count: (data as GroupedDenialData).count,
      amount: (data as GroupedDenialData).amount
    }));
  }
}

export const denialManagementService = new DenialManagementService();
