
import { AutoCorrection, DenialPattern, RecommendedAction } from './types';

export class RecommendationEngine {
  calculateAppealProbability(patterns: DenialPattern[], claim: any): number {
    // Simple calculation based on pattern success rates and claim value
    const baseProb = patterns.reduce((avg, p) => avg + (p.correctionRules[0]?.successRate || 0), 0) / patterns.length;
    const claimValue = parseFloat(claim.total_amount.toString());
    const valueMultiplier = claimValue > 500 ? 1.2 : claimValue > 200 ? 1.1 : 1.0;
    
    return Math.min(95, Math.max(10, baseProb * valueMultiplier));
  }

  generateRecommendedActions(
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
}

export const recommendationEngine = new RecommendationEngine();
