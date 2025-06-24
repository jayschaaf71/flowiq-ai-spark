
import { supabase } from "@/integrations/supabase/client";
import { AutoCorrection, DenialPattern } from './types';

export class AutoCorrectionService {
  async generateAutoCorrections(claim: any, patterns: DenialPattern[]): Promise<AutoCorrection[]> {
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
}

export const autoCorrectionService = new AutoCorrectionService();
