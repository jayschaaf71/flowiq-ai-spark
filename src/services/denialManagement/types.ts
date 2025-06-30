
export interface DenialPattern {
  id: string;
  denialCode: string;
  description: string;
  frequency: number;
  autoCorrectible: boolean;
  correctionRules: CorrectionRule[];
  category: 'coding' | 'authorization' | 'eligibility' | 'documentation' | 'billing';
  successRate: number;
}

export interface CorrectionRule {
  id: string;
  condition: string;
  action: 'recode' | 'modifier' | 'documentation' | 'resubmit';
  parameters: Record<string, any>;
  successRate: number;
}

export interface AutoCorrection {
  type: 'code_change' | 'modifier_add' | 'documentation_update';
  originalValue: string;
  correctedValue: string;
  confidence: number;
  reason: string;
}

export interface RecommendedAction {
  action: 'correct_and_resubmit' | 'appeal' | 'write_off' | 'contact_payer';
  priority: 'high' | 'medium' | 'low';
  estimatedValue: number;
  timeframe: string;
  description: string;
}

export interface DenialAnalysis {
  claimId: string;
  denialReasons: string[];
  patterns: DenialPattern[];
  autoCorrections: AutoCorrection[];
  recommendedActions: RecommendedAction[];
  appealProbability: number;
}
